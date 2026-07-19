import { reactive, computed, watch } from "vue";
import { directChat } from "../direct-client";
import { createDesignOperationContext } from "@/operations";
import { canvasStickerOptions } from "@/components/design/layout/canvas";
import { buildSystemPrompt, buildImageAnalysisPrompt } from "../prompts/system";
import { buildKnowledgePrompt } from "../knowledge";
import { resourceService } from "../services/resource";
import { captureCanvasForAI, getCanvasStateSummary } from "../capture";
import {
  buildAITools,
  INTERACTION_TOOL_NAMES,
  normalizeOperationToolName,
  resolveAIToolName,
} from "../shared/tools";
import { executeAITool, isResourceToolName } from "../shared/execute-tool";
import { AI_TIMEOUTS, withTimeout } from "../shared/timeout";
import {
  parseChatResponse,
  extractContent,
  extractJSON,
} from "../shared/response-parser";
import { translateToolResult } from "@/ai/agent/tool-translator";
import { evaluateCanvasVisual } from "../visual-evaluate";
import { websocketClient } from "@/services/websocketClient";
import { migrateLegacyWorkspaceStorage } from "@/services/designRuntime";
import type { VisualEvaluation } from "../visual-evaluate";
import {
  clearAgentDesignProvenance,
  recordAgentDesignPrompt,
} from "../design-provenance";
import {
  beginDesignTabTask,
  completeDesignTabTask,
  markDesignTabWorking,
} from "@/services/designTabStatus";
import {
  buildExecutionPlan,
  ensurePlanStep,
  failPendingPlanSteps,
  getIncompleteDeliveryActions,
  getPlanProgress,
  settlePlanStep,
  shouldAllowCanvasAnalysis,
  shouldContinueAfterArtwork,
  type DesignPlan,
} from "./planning";

// ============ 类型定义 ============

interface AgentMessage {
  id: string;
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  timestamp: number;
  tool_calls?: any[];
  tool_call_id?: string;
  tool_name?: string;
  meta?: {
    iteration?: number; // 迭代轮次
    toolArgs?: any; // 工具调用参数
    toolResult?: any; // 工具执行结果（完整）
    duration?: number; // 执行耗时（ms）
    llmResponse?: any; // LLM 原始响应
    hasImage?: boolean; // 是否包含图片
    plan?: DesignPlan | null; // 执行计划
    type?: string; // 消息类型标识
  };
}

interface PersistedAgentState {
  version: number;
  savedAt: number;
  messages: AgentMessage[];
}

interface AgentInteraction {
  type: string;
  question: string;
  options?: string[];
}

interface SearchRecord {
  tool: string;
  query: string;
  resultCount: number;
  iteration: number;
  cachedData?: any;
}

// ============ 工具定义 ============

// ============ Agent 状态 ============

const agentState = reactive({
  status: "idle" as "idle" | "thinking" | "executing" | "waiting_user" | "done",
  messages: [] as AgentMessage[],
  pendingInteraction: null as AgentInteraction | null,
  error: null as string | null,
  searchHistory: [] as SearchRecord[],
  // 任务追踪
  batchTask: null as {
    total: number;
    completed: number;
    description: string;
  } | null,
  // 规划
  plan: null as DesignPlan | null,
});

let waitForUserInputPromise: { resolve: (value: string) => void } | null = null;
const eventListeners: ((event: any) => void)[] = [];
let tabTaskActive = false;

const isAgentStopped = () => agentState.status === "idle";

watch(
  () => agentState.status,
  (status) => {
    const active = !["idle", "done"].includes(status);
    if (active && !tabTaskActive) {
      tabTaskActive = true;
      beginDesignTabTask();
      return;
    }
    if (active) {
      markDesignTabWorking();
      return;
    }
    if (tabTaskActive) {
      tabTaskActive = false;
      completeDesignTabTask(!agentState.error);
    }
  },
  { flush: "sync" },
);

const STORAGE_KEY = migrateLegacyWorkspaceStorage(
  "yishe_tool_ai_agent_conversation_v1",
);
const MAX_PERSISTED_MESSAGES = 80;
const MAX_PERSISTED_CONTENT_LENGTH = 12000;

function canUseLocalStorage(): boolean {
  try {
    return typeof window !== "undefined" && !!window.localStorage;
  } catch {
    return false;
  }
}

function restorePlanFromMessages() {
  const lastPlanMessage = [...agentState.messages]
    .reverse()
    .find((message) => message.meta?.plan);
  agentState.plan = lastPlanMessage?.meta?.plan || null;
}

function sanitizeMessageForStorage(message: AgentMessage): AgentMessage {
  const meta = message.meta
    ? {
        iteration: message.meta.iteration,
        toolArgs: message.meta.toolArgs,
        toolResult: message.meta.toolResult,
        duration: message.meta.duration,
        hasImage: message.meta.hasImage,
        plan: message.meta.plan,
        type: message.meta.type,
      }
    : undefined;

  return {
    id: message.id,
    role: message.role,
    content: String(message.content || "").slice(
      0,
      MAX_PERSISTED_CONTENT_LENGTH,
    ),
    timestamp: Number(message.timestamp || Date.now()),
    tool_calls: message.tool_calls,
    tool_call_id: message.tool_call_id,
    tool_name: message.tool_name,
    ...(meta ? { meta } : {}),
  };
}

function persistConversation() {
  if (!canUseLocalStorage()) return;
  try {
    const payload: PersistedAgentState = {
      version: 1,
      savedAt: Date.now(),
      messages: agentState.messages
        .slice(-MAX_PERSISTED_MESSAGES)
        .map(sanitizeMessageForStorage),
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (error) {
    console.warn("[Agent] 持久化会话失败:", error);
  }
}

function restoreConversation() {
  if (!canUseLocalStorage()) return;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const payload = JSON.parse(raw) as Partial<PersistedAgentState>;
    if (!Array.isArray(payload.messages)) return;

    agentState.messages.splice(
      0,
      agentState.messages.length,
      ...payload.messages
        .filter((item) => item && typeof item.content === "string")
        .slice(-MAX_PERSISTED_MESSAGES)
        .map(sanitizeMessageForStorage),
    );
    restorePlanFromMessages();
  } catch (error) {
    console.warn("[Agent] 恢复会话失败:", error);
  }
}

function clearPersistedConversation() {
  if (!canUseLocalStorage()) return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn("[Agent] 清理本地会话失败:", error);
  }
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function emit(event: any) {
  eventListeners.forEach((listener) => listener(event));
}

// ============ Agent 状态同步 ============
function syncAgentStatus(extra: Record<string, any> = {}) {
  try {
    const planProgress = getPlanProgress(agentState.plan);
    websocketClient.sendAgentStatus({
      available: agentState.status === "idle",
      agentState: agentState.status as any,
      plan: agentState.plan
        ? {
            goal: agentState.plan.goal,
            totalSteps: agentState.plan.steps.length,
            currentStep: planProgress.settled,
          }
        : null,
      iteration: undefined,
      updatedAt: new Date().toISOString(),
      ...extra,
    });
  } catch {
    // 静默失败，不影响 Agent 正常运行
  }
}

function addMessage(msg: Partial<AgentMessage>): AgentMessage {
  const message: AgentMessage = {
    id: generateId(),
    timestamp: Date.now(),
    ...msg,
  } as AgentMessage;
  agentState.messages.push(message);
  persistConversation();
  emit({ type: "message", data: message });
  return message;
}

restoreConversation();

// ============ 搜索去重 ============

function isDuplicateSearch(
  toolName: string,
  args: Record<string, any>,
): SearchRecord | null {
  const query = (args.query || args.request || "").toLowerCase().trim();
  if (!query) return null;

  return (
    agentState.searchHistory.find(
      (r) =>
        r.tool === toolName &&
        r.query.toLowerCase().trim() === query &&
        r.resultCount > 0,
    ) || null
  );
}

function recordSearch(
  toolName: string,
  args: Record<string, any>,
  resultCount: number,
  iteration: number,
  data?: any,
) {
  agentState.searchHistory.push({
    tool: toolName,
    query: args.query || args.request || "",
    resultCount,
    iteration,
    cachedData: data,
  });
}

function getResourceResultCount(result: any): number {
  return Array.isArray(result?.data) ? result.data.length : 0;
}

function toLLMMessage(message: AgentMessage) {
  if (message.role === "tool") {
    if (!message.tool_call_id) {
      return {
        role: "user",
        content: `[工具结果] ${message.content || ""}`,
      };
    }
    return {
      role: "tool",
      tool_call_id: message.tool_call_id,
      content: message.content || "",
    };
  }

  return {
    role: message.role,
    content: message.content || "",
    ...(message.tool_calls?.length ? { tool_calls: message.tool_calls } : {}),
  };
}

function stripToolCalls(message: any) {
  const { tool_calls: _toolCalls, ...rest } = message;
  return rest;
}

function sanitizeToolProtocolMessages(messages: any[]) {
  const result: any[] = [];

  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];
    const toolCalls = Array.isArray(message?.tool_calls)
      ? message.tool_calls
      : [];

    if (message?.role === "assistant" && toolCalls.length > 0) {
      const requiredIds = toolCalls
        .map((call: any) => call?.id)
        .filter(Boolean);
      const toolMessages: any[] = [];
      let j = i + 1;

      while (messages[j]?.role === "tool") {
        toolMessages.push(messages[j]);
        j++;
      }

      const outputIds = new Set(
        toolMessages
          .map((toolMessage) => toolMessage?.tool_call_id)
          .filter(Boolean),
      );
      const isComplete =
        requiredIds.length > 0 &&
        requiredIds.every((id: string) => outputIds.has(id));

      if (isComplete) {
        result.push(message, ...toolMessages);
      } else if (message.content) {
        result.push(stripToolCalls(message));
      }

      i = j - 1;
      continue;
    }

    if (message?.role === "tool") {
      result.push({
        role: "user",
        content: `[工具结果] ${message.content || ""}`,
      });
      continue;
    }

    result.push(message);
  }

  return result;
}

// ============ 任务追踪 ============

function startBatchTask(total: number, description: string) {
  agentState.batchTask = {
    total,
    completed: 0,
    description,
  };
  console.log(`[Agent] Batch task started: ${description} (${total} items)`);
}

function completeBatchItem(): {
  current: number;
  total: number;
  hint: string;
  isComplete: boolean;
} {
  if (!agentState.batchTask) {
    return { current: 0, total: 0, hint: "", isComplete: false };
  }

  agentState.batchTask.completed++;
  const { completed, total } = agentState.batchTask;
  const isComplete = completed >= total;

  const hint = isComplete
    ? `全部完成！已成功保存 ${total} 个素材。`
    : `已完成 ${completed}/${total}，请继续创建下一个素材，完成后再次调用 canvas.updateAndSaveSticker 保存。`;

  console.log(`[Agent] Batch progress: ${completed}/${total}`);

  if (isComplete) {
    agentState.batchTask = null;
  }

  return { current: completed, total, hint, isComplete };
}

function getBatchProgress(): string {
  if (!agentState.batchTask) return "";
  const { completed, total, description } = agentState.batchTask;
  return `\n\n## 当前任务进度\n任务：${description}\n进度：${completed}/${total}\n请继续完成剩余 ${total - completed} 个素材。`;
}

function clearBatchTask() {
  agentState.batchTask = null;
}

function buildSearchContext(): string {
  const cachedSummary = resourceService.getCachedResultsSummary();
  if (!cachedSummary) return "";

  return `\n\n## 搜索缓存\n${cachedSummary}\n请优先使用缓存结果，不要重复搜索相同关键词。如果需要不同关键词的资源才进行新搜索。`;
}

// ============ 工具参数安全解析 ============

function safeParseToolArgs(raw: string): Record<string, any> {
  // 尝试直接解析
  try {
    return JSON.parse(raw);
  } catch {}

  // 修复常见 JSON 格式问题
  let fixed = raw;

  // 1. 修复 htmlContent 中未转义的引号（最常见的问题）
  // LLM 可能输出：{"htmlContent": "<div style="color:red">"}
  // 需要修复为：{"htmlContent": "<div style=\"color:red\">"}
  fixed = fixUnescapedQuotesInValue(fixed, "htmlContent");

  // 2. 尾部缺少 }
  if (fixed.trim().endsWith('"') && !fixed.trim().endsWith("}")) {
    fixed = fixed.trimEnd() + "}";
  }

  try {
    return JSON.parse(fixed);
  } catch (e: any) {
    console.warn(
      "[Agent] Failed to recover JSON, returning empty args:",
      e.message,
    );
    return {};
  }
}

function fixUnescapedQuotesInValue(json: string, key: string): string {
  const pattern = new RegExp(`"${key}"\\s*:\\s*"`, "g");
  let result = json;

  let match = pattern.exec(result);
  if (!match) return result;

  // 找到值的起始位置和结束引号
  const valueStart = match.index! + match[0].length;
  let depth = 1;
  let i = valueStart;
  let inString = false;

  for (; i < result.length; i++) {
    const ch = result[i];
    const prev = i > 0 ? result[i - 1] : "";

    if (ch === '"' && prev !== "\\") {
      if (!inString) {
        inString = true;
      } else {
        depth--;
        if (depth === 0) break;
      }
    }
    // 实际上，我们需要跳过到下一个未转义的引号
  }

  // 简单方案：从 valueStart 到文件结束，找到最后一个 " 前有 } 的地方
  // 更实用的方案：找到 "key": "... 末尾的引号
  // 简化：只处理明显的未转义 HTML 引号问题

  // 找到值的结束位置（下一个未转义的双引号后跟 , 或 }）
  const valueEnd = findUnescapedQuote(result, valueStart);
  if (valueEnd < 0) return result;

  const rawValue = result.slice(valueStart, valueEnd);
  // 对 HTML 内容中的双引号做转义（但要保留已转义的）
  const escapedValue = rawValue
    .replace(/\\"/g, "__ESCAPED_QUOTE__")
    .replace(/"/g, '\\"')
    .replace(/__ESCAPED_QUOTE__/g, '\\"');

  return result.slice(0, valueStart) + escapedValue + result.slice(valueEnd);
}

function findUnescapedQuote(str: string, start: number): number {
  for (let i = start; i < str.length; i++) {
    if (str[i] === '"' && (i === 0 || str[i - 1] !== "\\")) {
      // 检查前面是否有奇数个反斜杠
      let bsCount = 0;
      for (let j = i - 1; j >= 0 && str[j] === "\\"; j--) {
        bsCount++;
      }
      if (bsCount % 2 === 0) {
        return i;
      }
    }
  }
  return -1;
}

// ============ Agent 循环 ============

interface RunAgentLoopOptions {
  allowInteraction?: boolean;
  allowCanvasAnalysis?: boolean;
  deliveryHandledExternally?: boolean;
  excludeOperations?: string[];
}

const AUTO_BATCH_BLOCKED_OPERATIONS = [
  "canvas.startBatchTask",
  "canvas.getBatchProgress",
  "canvas.updateAndSaveSticker",
  "canvas.exportPng",
];

const CANVAS_ANALYSIS_OPERATIONS = [
  "canvas.analyze",
  "canvas.evaluateDesign",
  "canvas.createAndAnalyze",
  "canvas.quickTest",
];

function getToolTimeoutMs(toolName: string): number {
  return isResourceToolName(toolName)
    ? AI_TIMEOUTS.resourceTool
    : AI_TIMEOUTS.tool;
}

function executeToolWithTimeout(
  toolName: string,
  args: Record<string, any>,
  ctx: ReturnType<typeof createDesignOperationContext>,
) {
  return withTimeout(
    executeAITool(toolName, args, ctx),
    getToolTimeoutMs(toolName),
    `工具 ${toolName}`,
  );
}

function notifyPlanUpdated(step?: string) {
  persistConversation();
  emit({ type: "plan", data: agentState.plan });
  syncAgentStatus(step ? { step } : {});
}

function getPlanActionForTool(toolName: string, args: Record<string, any>) {
  if (toolName === "canvas.addChild" && args?.type === "html") {
    return "canvas.addChild:html";
  }
  return toolName;
}

function describePlanAction(toolName: string): string {
  const descriptions: Record<string, string> = {
    "canvas.clear": "清空画布",
    "canvas.setSize": "设置画布尺寸",
    "canvas.setBaseFontSize": "设置画布基础字号",
    "canvas.smartSize": "智能设置画布尺寸",
    "canvas.setSizeByPreset": "按预设设置画布尺寸",
    "canvas.addHtml": "生成完整 HTML/CSS 作品",
    "canvas.addChild:html": "生成完整 HTML/CSS 作品",
    "resource.searchFont": "搜索字体资源",
    "resource.searchSticker": "搜索图片或贴纸素材",
    "resource.searchSentence": "搜索短文案",
    "resource.searchTextDocument": "搜索文档资料",
    ask_choice: "等待用户选择",
    request_feedback: "等待用户反馈",
  };
  return descriptions[toolName] || `执行 ${toolName}`;
}

function isAgentDesignMutationTool(
  toolName: string,
  args: Record<string, any>,
): boolean {
  if (toolName.startsWith("element.")) return true;
  if (toolName === "canvas.addChild") return args?.type !== "canvas";
  return (
    toolName.startsWith("canvas.add") ||
    toolName.startsWith("canvas.create") ||
    toolName === "canvas.removeChild" ||
    toolName === "canvas.setBaseFontSize" ||
    toolName === "canvas.setBackgroundColor" ||
    toolName === "canvas.quickTest"
  );
}

function syncAgentDesignProvenanceAfterTool(
  toolName: string,
  args: Record<string, any>,
  prompt: string,
) {
  if (toolName === "canvas.clear") {
    clearAgentDesignProvenance(canvasStickerOptions.value);
    return;
  }
  if (isAgentDesignMutationTool(toolName, args)) {
    recordAgentDesignPrompt(canvasStickerOptions.value, prompt, toolName);
  }
}

function didToolCompletePlanStep(toolName: string, result: any): boolean {
  if (!result?.success) return false;
  if (isResourceToolName(toolName) && Array.isArray(result?.data)) {
    return result.data.length > 0;
  }
  return true;
}

function getToolPlanResult(toolName: string, result: any): string | undefined {
  if (isResourceToolName(toolName) && Array.isArray(result?.data)) {
    if (result.data.length === 0) return result?.message;
    const strategy = result?.searchStrategy
      ? `，策略 ${result.searchStrategy}`
      : "";
    const attempts = result?.searchAttempts
      ? `，内部尝试 ${result.searchAttempts} 次`
      : "";
    return `找到 ${result.data.length} 个候选${strategy}${attempts}`;
  }
  return result?.message;
}

function ensureRuntimePlanStep(
  plan: DesignPlan | null,
  action: string,
  description = describePlanAction(action),
) {
  if (!plan) return;
  const previousLength = plan.steps.length;
  ensurePlanStep(plan, action, description);
  if (plan.steps.length !== previousLength) {
    notifyPlanUpdated(`新增计划步骤: ${description}`);
  }
}

function settleRuntimePlanStep(
  plan: DesignPlan | null,
  action: string,
  success: boolean,
  result?: string,
) {
  if (!plan) return;
  settlePlanStep(
    plan,
    action,
    success ? "done" : "failed",
    result,
    describePlanAction(action),
  );
  notifyPlanUpdated(result);
}

function failRemainingPlan(plan: DesignPlan | null, reason: string) {
  if (!plan || !plan.steps.some((step) => step.status === "pending")) return;
  failPendingPlanSteps(plan, reason);
  notifyPlanUpdated(reason);
}

async function executePreflightOperation(
  toolName: "canvas.clear" | "canvas.setSize",
  args: Record<string, any>,
  ctx: ReturnType<typeof createDesignOperationContext>,
  plan: DesignPlan | null,
) {
  const callId = `preflight-${generateId()}`;
  const safeToolName = normalizeOperationToolName(toolName);
  const toolCall = {
    id: callId,
    type: "function",
    function: {
      name: safeToolName,
      arguments: JSON.stringify(args),
    },
  };

  ensureRuntimePlanStep(plan, toolName);
  addMessage({
    role: "assistant",
    content: "",
    tool_calls: [toolCall],
    meta: { iteration: 0, type: "preflight" },
  });

  const startedAt = Date.now();
  agentState.status = "executing";
  syncAgentStatus({ step: `前置执行: ${toolName}`, lastToolCall: toolName });

  try {
    const result = await executeToolWithTimeout(toolName, args, ctx);
    settleRuntimePlanStep(plan, toolName, !!result?.success, result?.message);
    addMessage({
      role: "tool",
      tool_call_id: callId,
      tool_name: toolName,
      content: JSON.stringify(result),
      meta: {
        iteration: 0,
        type: "preflight",
        toolArgs: args,
        toolResult: result,
        duration: Date.now() - startedAt,
      },
    });
    return result;
  } catch (error: any) {
    const errorResult = { success: false, message: error.message };
    settleRuntimePlanStep(plan, toolName, false, error.message);
    addMessage({
      role: "tool",
      tool_call_id: callId,
      tool_name: toolName,
      content: JSON.stringify(errorResult),
      meta: {
        iteration: 0,
        type: "preflight",
        toolArgs: args,
        toolResult: errorResult,
        duration: Date.now() - startedAt,
      },
    });
    return errorResult;
  } finally {
    agentState.status = "thinking";
  }
}

async function runAgentLoop(
  userMessage: string,
  options: RunAgentLoopOptions = {},
) {
  const maxIterations = 10;
  const ctx = createDesignOperationContext();
  const allowInteraction = options.allowInteraction !== false;
  const deliveryHandledExternally =
    options.deliveryHandledExternally === true;
  const allowCanvasAnalysis =
    options.allowCanvasAnalysis ?? shouldAllowCanvasAnalysis(userMessage);
  let iteration = 0;
  const allowPostArtworkContinuation = shouldContinueAfterArtwork(userMessage);
  let completedArtwork = false;
  let automaticDeliveryCompleted = false;

  // 添加用户消息
  addMessage({ role: "user", content: userMessage });

  // 1. 本地生成可执行计划，避免额外的 Planner 模型请求。
  const executionPlan = buildExecutionPlan(userMessage);
  const searchQueries = executionPlan.searchQueries;
  let explicitCanvasSize = executionPlan.shouldPreflightSize
    ? executionPlan.explicitCanvasSize
    : null;
  const completedPreflightOperations = new Set<string>();
  const excludedPreflightOperations = new Set<string>();

  agentState.plan = executionPlan.plan;
  const plan = agentState.plan;
  if (plan) {
    addMessage({
      role: "assistant",
      content: `📋 计划：${plan.goal}（${plan.steps.length} 步）`,
      meta: { plan, type: "plan" },
    });
  }

  // 2. 确定性前置操作直接执行，不再各消耗一轮模型调用。
  if (executionPlan.isNewDesign) {
    clearAgentDesignProvenance(canvasStickerOptions.value);
    const result = await executePreflightOperation(
      "canvas.clear",
      {},
      ctx,
      plan,
    );
    if (result.success) {
      completedPreflightOperations.add("canvas.clear");
      excludedPreflightOperations.add("canvas.clear");
    }
  }

  if (explicitCanvasSize) {
    const result = await executePreflightOperation(
      "canvas.setSize",
      {
        ...explicitCanvasSize,
        typographyDensity: executionPlan.typographyDensity,
      },
      ctx,
      plan,
    );
    if (result.success) {
      completedPreflightOperations.add("canvas.setSize");
      excludedPreflightOperations.add("canvas.setSize");
      excludedPreflightOperations.add("canvas.smartSize");
      excludedPreflightOperations.add("canvas.setSizeByPreset");
    }
  }

  const excludeOperations = [
    ...(options.excludeOperations || []),
    ...excludedPreflightOperations,
    ...(!allowCanvasAnalysis ? CANVAS_ANALYSIS_OPERATIONS : []),
  ];
  const allTools = buildAITools({
    includeResources: true,
    resourceTools: resourceService.tools,
    includeInteractions: allowInteraction,
    excludeOperations,
  });

  const needsDesignKnowledge = !!plan?.steps.some((step) =>
    ["canvas.addHtml", "canvas.addDiagram", "canvas.addChart"].includes(
      step.action,
    ),
  );

  // 3. 只加载真正会注入提示词的设计知识。
  const knowledgePrompt = needsDesignKnowledge
    ? await withTimeout(
        buildKnowledgePrompt(searchQueries.styles),
        AI_TIMEOUTS.knowledge,
        "知识检索",
      ).catch((error) => {
        console.warn(
          "[Agent] Knowledge prompt timeout/failure, skipped:",
          error,
        );
        return "";
      })
    : "";

  const preflightSummary = completedPreflightOperations.size
    ? `\n\n## 运行时已完成的前置操作\n${Array.from(completedPreflightOperations)
        .map((action) => `- ${action}`)
        .join("\n")}\n这些操作已经成功完成，不要重复调用，直接继续剩余计划。`
    : "";

  const requiredDeliveryActions = getIncompleteDeliveryActions(plan);
  const deliverySummary = requiredDeliveryActions.length
    ? `\n\n## 必须完成的交付步骤\n${requiredDeliveryActions
        .map((action) => `- ${action}`)
        .join(
          "\n",
        )}\n用户已明确要求这些步骤。完成设计和必要检查后必须执行，执行成功前禁止调用 ask_choice 或 request_feedback。`
    : "";

  // 4. 构建高信号消息列表。
  const systemPrompt =
    buildSystemPrompt() +
    "\n" +
    knowledgePrompt +
    preflightSummary +
    deliverySummary +
    buildSearchContext() +
    getBatchProgress() +
    (allowInteraction
      ? ""
      : deliveryHandledExternally
        ? "\n\n## 自动制作模式\n- 当前任务不能等待用户反馈，也不要调用 ask_choice 或 request_feedback\n- 如果信息不足，请基于当前提示词和可用资源自行判断\n- 只完成当前画布设计，完成后直接结束；评估和保存由外层流水线负责"
        : "\n\n## 自动制作模式\n- 当前任务不能等待用户反馈，也不要调用 ask_choice 或 request_feedback\n- 如果信息不足，请基于当前提示词和可用资源自行判断\n- 必须完成用户明确要求的设计、检查和保存步骤\n- 保存成功后直接结束，不要请求用户确认、评价或反馈");

  const messagesForLLM: any[] = [
    { role: "system", content: systemPrompt },
    ...agentState.messages.map(toLLMMessage),
  ];

  for (let i = 0; i < maxIterations; i++) {
    // 检查是否被外部中断（如用户点击清空）
    if (isAgentStopped()) {
      console.log("[Agent] 被中断，退出循环");
      failRemainingPlan(plan, "任务已被用户中断");
      return;
    }
    iteration = i + 1;
    console.log(`[Agent] Iteration ${iteration}`);
    emit({ type: "iteration", data: { iteration, maxIterations } });
    syncAgentStatus({
      step: `第 ${iteration}/${maxIterations} 轮推理`,
      iteration,
    });

    // 进度反思（每 3 轮）
    if (plan && iteration > 1 && iteration % 3 === 0) {
      const progress = getPlanProgress(plan);
      messagesForLLM.push({
        role: "system",
        content: `[进度反思] 目标：${plan.goal}\n进度：${progress.settled}/${progress.total}，失败 ${progress.failed}\n请评估进展，决定是继续执行、调整方向还是已完成。`,
      });
    }

    // 上下文压缩（消息过多时）
    if (messagesForLLM.length > 14) {
      const systemMsgs = messagesForLLM.filter((m) => m.role === "system");
      const recentMsgs = messagesForLLM.slice(-8);
      const oldMsgs = messagesForLLM.slice(systemMsgs.length, -8);

      const summary = oldMsgs
        .map((m) => {
          if (
            m.role === "user" &&
            String(m.content || "").startsWith("[工具结果]")
          ) {
            return String(m.content || "").replace("[工具结果] ", "");
          }
          if (m.role === "tool") {
            return String(m.content || "").slice(0, 500);
          }
          return "";
        })
        .filter(Boolean)
        .join(" → ");

      messagesForLLM.length = 0;
      messagesForLLM.push(...systemMsgs);
      if (summary) {
        messagesForLLM.push({
          role: "system",
          content: `[历史摘要] 已完成: ${summary}`,
        });
      }
      messagesForLLM.push(...recentMsgs);
    }

    // 调用 LLM
    let response: any;
    const llmStartTime = Date.now();
    try {
      response = await directChat({
        messages: sanitizeToolProtocolMessages(messagesForLLM),
        tools: allTools,
        timeoutMs: AI_TIMEOUTS.chat,
      });
    } catch (error: any) {
      console.error("[Agent] LLM error:", error);
      failRemainingPlan(plan, `模型调用失败: ${error.message}`);
      addMessage({
        role: "assistant",
        content: `抱歉，出现了错误：${error.message}`,
        meta: { iteration, duration: Date.now() - llmStartTime },
      });
      return;
    }
    const llmDuration = Date.now() - llmStartTime;

    if (agentState.status === "idle") {
      failRemainingPlan(plan, "任务已被用户中断");
      return;
    }

    // 解析响应
    const parsed = parseChatResponse(response);

    if (!parsed) {
      console.error("[Agent] No message in response:", response);
      failRemainingPlan(plan, "无法解析模型响应");
      addMessage({
        role: "assistant",
        content: "抱歉，无法解析响应。",
        meta: { iteration, llmResponse: response },
      });
      return;
    }

    const content = parsed.content;
    const toolCalls = parsed.tool_calls || [];
    let assistantToolCallsAppended = false;
    const appendAssistantToolCalls = () => {
      if (assistantToolCallsAppended) return;
      messagesForLLM.push({
        role: "assistant",
        content: content || "",
        tool_calls: toolCalls,
      });
      assistantToolCallsAppended = true;
    };

    // 添加助手消息（包含调试信息）
    if (content || toolCalls.length > 0) {
      addMessage({
        role: "assistant",
        content,
        tool_calls: toolCalls.length > 0 ? toolCalls : undefined,
        meta: {
          iteration,
          duration: llmDuration,
          llmResponse: { content, tool_calls: toolCalls },
        },
      });
    }

    // 如果没有工具调用，结束
    if (toolCalls.length === 0) {
      console.log("[Agent] No tool calls, ending loop");
      failRemainingPlan(plan, "模型未继续执行剩余步骤");
      return;
    }

    // 执行工具调用
    agentState.status = "executing";

    for (const call of toolCalls) {
      if (automaticDeliveryCompleted) break;
      if (isAgentStopped()) {
        failRemainingPlan(plan, "任务已被用户中断");
        return;
      }
      const rawArgs = call.function.arguments;
      let args: any;

      if (typeof rawArgs === "string") {
        try {
          args = JSON.parse(rawArgs);
        } catch {
          console.warn(
            "[Agent] JSON parse failed, trying recovery:",
            String(rawArgs).slice(0, 200),
          );
          args = safeParseToolArgs(String(rawArgs));
        }
      } else {
        args = rawArgs;
      }

      const toolName = resolveAIToolName(call.function.name);
      const planAction = getPlanActionForTool(toolName, args);
      const isInteractionTool = INTERACTION_TOOL_NAMES.includes(
        call.function.name,
      );
      const pendingDeliveryActions = getIncompleteDeliveryActions(plan);
      if (!isInteractionTool || pendingDeliveryActions.length === 0) {
        ensureRuntimePlanStep(plan, planAction);
      }
      console.log("[Agent] Executing tool:", toolName, args);

      // 检查是否是交互工具
      if (isInteractionTool) {
        if (pendingDeliveryActions.length > 0) {
          const blockedResponse = `用户已明确要求完成 ${pendingDeliveryActions.join(", ")}。请先执行这些交付步骤，成功后再请求反馈。`;
          appendAssistantToolCalls();
          messagesForLLM.push({
            role: "tool",
            tool_call_id: call.id,
            content: blockedResponse,
          });
          addMessage({
            role: "tool",
            tool_call_id: call.id,
            tool_name: call.function.name,
            content: blockedResponse,
            meta: { iteration, toolArgs: args, type: "delivery-blocked" },
          });
          agentState.status = "thinking";
          agentState.pendingInteraction = null;
          continue;
        }

        if (!allowInteraction) {
          const autoResponse =
            "自动制作模式不等待用户反馈。请直接基于当前需求完成设计；如果画面已经完成，请结束本轮。";
          appendAssistantToolCalls();
          messagesForLLM.push({
            role: "tool",
            tool_call_id: call.id,
            content: autoResponse,
          });
          addMessage({
            role: "tool",
            tool_call_id: call.id,
            tool_name: call.function.name,
            content: autoResponse,
            meta: { iteration, toolArgs: args },
          });
          settleRuntimePlanStep(
            plan,
            planAction,
            true,
            "自动制作模式已跳过等待用户反馈",
          );
          agentState.status = "thinking";
          agentState.pendingInteraction = null;
          continue;
        }

        agentState.status = "waiting_user";
        agentState.pendingInteraction = {
          type: call.function.name,
          question: args.question,
          options: args.options,
        };
        emit({ type: "interaction", data: agentState.pendingInteraction });

        // 等待用户输入
        const userResponse = await waitForUserInput();
        console.log("[Agent] User response:", userResponse);

        appendAssistantToolCalls();
        messagesForLLM.push({
          role: "tool",
          tool_call_id: call.id,
          content: `用户反馈：${userResponse}`,
        });
        addMessage({
          role: "tool",
          tool_call_id: call.id,
          tool_name: call.function.name,
          content: `用户反馈：${userResponse}`,
          meta: { iteration, toolArgs: args },
        });
        settleRuntimePlanStep(plan, planAction, true, "用户已提交反馈");

        agentState.status = "thinking";
        agentState.pendingInteraction = null;

        // 继续循环
        continue;
      }

      // 执行普通工具
      const toolStartTime = Date.now();
      syncAgentStatus({
        step: `执行工具: ${toolName}`,
        lastToolCall: toolName,
      });
      try {
        let result;

        // 检查是否是资源工具
        if (isResourceToolName(toolName)) {
          // 检查是否是重复搜索
          const duplicate = isDuplicateSearch(toolName, args);
          if (duplicate) {
            const searchLabel = args.query || args.request || "";
            console.log(
              `[Agent] 跳过重复搜索: ${toolName}("${searchLabel}") (第${duplicate.iteration}轮已搜索)`,
            );
            result = {
              success: true,
              data: duplicate.cachedData || [],
              total: duplicate.resultCount,
              query: searchLabel,
              message: `此搜索在第${duplicate.iteration}轮已执行过，找到${duplicate.resultCount}个结果。以下是缓存的结果：`,
            };
          } else {
            result = await executeToolWithTimeout(toolName, args, ctx);
            // 记录搜索结果（含数据缓存）
            const resultCount = getResourceResultCount(result);
            recordSearch(toolName, args, resultCount, iteration, result?.data);
          }
        } else if (
          deliveryHandledExternally &&
          AUTO_BATCH_BLOCKED_OPERATIONS.includes(toolName)
        ) {
          result = {
            success: false,
            message:
              "自动制作单张设计阶段不能调用批量、保存或导出工具。请只完成当前画布设计，保存由外层流水线处理。",
          };
        } else {
          if (explicitCanvasSize) {
            if (
              toolName === "canvas.smartSize" ||
              toolName === "canvas.setSizeByPreset"
            ) {
              // 拦截：用户已明确指定尺寸时，smartSize/setSizeByPreset 绝对禁止
              result = {
                success: false,
                message:
                  `⛔ 用户已明确指定画布尺寸 ${explicitCanvasSize.width}×${explicitCanvasSize.height} ${explicitCanvasSize.unit}，` +
                  `${toolName} 已被禁止。该尺寸是绝对约束，不可覆盖。请直接进行下一步操作。`,
                data: {
                  width: explicitCanvasSize.width,
                  height: explicitCanvasSize.height,
                  unit: explicitCanvasSize.unit,
                  blockedByExplicitSize: true,
                },
              };
            } else {
              // canvas.setSize 强制使用用户指定的尺寸
              if (toolName === "canvas.setSize") {
                args = {
                  ...args,
                  width: explicitCanvasSize.width,
                  height: explicitCanvasSize.height,
                  unit: explicitCanvasSize.unit,
                  typographyDensity: executionPlan.typographyDensity,
                };
              }
              // 在执行工具前，先直接设置画布尺寸（绕过操作系统的可能问题）
              if (
                toolName === "canvas.setSize" ||
                toolName === "canvas.addHtml" ||
                toolName === "canvas.addChild"
              ) {
                ctx.setCanvasSize(
                  explicitCanvasSize.width,
                  explicitCanvasSize.height,
                  explicitCanvasSize.unit,
                );
              }
              result = await executeToolWithTimeout(toolName, args, ctx);
              // 如果是画布尺寸设置工具，且用户明确指定了尺寸，则更新 explicitCanvasSize
              if (
                result?.success &&
                (toolName === "canvas.setSize" ||
                  toolName === "canvas.smartSize" ||
                  toolName === "canvas.setSizeByPreset")
              ) {
                explicitCanvasSize = {
                  width: args.width,
                  height: args.height,
                  unit: args.unit || "px",
                };
              }
            }
          } else {
            result = await executeToolWithTimeout(toolName, args, ctx);
          }
        }

        const toolDuration = Date.now() - toolStartTime;
        console.log("[Agent] Tool result:", result);

        if (result?.success) {
          syncAgentDesignProvenanceAfterTool(toolName, args, userMessage);
        }

        // 尺寸强制矫正：用户指定明确尺寸时，每次工具执行后都强制确保画布尺寸正确
        // 不管工具是否修改了尺寸，都重新设置一次（防止任何路径的尺寸篡改）
        if (explicitCanvasSize) {
          const current = ctx.getCanvasSize();
          if (
            current.width !== explicitCanvasSize.width ||
            current.height !== explicitCanvasSize.height
          ) {
            console.warn(
              `[Agent] 画布尺寸被篡改 ${current.width}×${current.height} → 矫正为 ${explicitCanvasSize.width}×${explicitCanvasSize.height}`,
            );
          }
          // 每次都强制设置，不管当前尺寸是否正确
          ctx.setCanvasSize(
            explicitCanvasSize.width,
            explicitCanvasSize.height,
            explicitCanvasSize.unit,
          );
        }

        // 如果是保存操作，更新任务进度
        let progressHint = "";
        if (toolName === "canvas.updateAndSaveSticker" && result?.success) {
          const progress = completeBatchItem();
          if (progress.hint) {
            progressHint = `\n\n[任务进度] ${progress.hint}`;
          }
        }

        const planStepSucceeded = didToolCompletePlanStep(toolName, result);
        settleRuntimePlanStep(
          plan,
          planAction,
          planStepSucceeded,
          getToolPlanResult(toolName, result),
        );
        if (
          !allowInteraction &&
          !deliveryHandledExternally &&
          toolName === "canvas.updateAndSaveSticker" &&
          result?.success &&
          getIncompleteDeliveryActions(plan).length === 0
        ) {
          automaticDeliveryCompleted = true;
        }

        addMessage({
          role: "tool",
          tool_call_id: call.id,
          tool_name: toolName,
          content: JSON.stringify(result) + progressHint,
          meta: {
            iteration,
            toolArgs: args,
            toolResult: result,
            duration: toolDuration,
          },
        });

        const translatedResult = translateToolResult(toolName, args, result);
        appendAssistantToolCalls();
        messagesForLLM.push({
          role: "tool",
          tool_call_id: call.id,
          content: `${translatedResult}${progressHint}`,
        });

        if (
          result?.success &&
          (toolName === "canvas.addHtml" ||
            (toolName === "canvas.addChild" && args?.type === "html")) &&
          !allowPostArtworkContinuation
        ) {
          completedArtwork = true;
        }
      } catch (error: any) {
        console.error("[Agent] Tool error:", error);
        const errorResult = { success: false, error: error.message };
        settleRuntimePlanStep(plan, planAction, false, error.message);

        addMessage({
          role: "tool",
          tool_call_id: call.id,
          tool_name: toolName,
          content: JSON.stringify(errorResult),
          meta: {
            iteration,
            toolArgs: args,
            toolResult: errorResult,
            duration: Date.now() - toolStartTime,
          },
        });

        appendAssistantToolCalls();
        messagesForLLM.push({
          role: "tool",
          tool_call_id: call.id,
          content: `❌ ${toolName} 执行失败: ${error.message}`,
        });
      }
    }

    if (isAgentStopped()) {
      failRemainingPlan(plan, "任务已被用户中断");
      return;
    }

    if (automaticDeliveryCompleted) {
      addMessage({
        role: "assistant",
        content: "自动制作已完成并保存到素材库。",
        meta: { iteration, type: "automatic-delivery-complete" },
      });
      return;
    }

    if (completedArtwork) {
      console.log(
        "[Agent] HTML artwork completed, stopping to avoid over-iteration",
      );
      failRemainingPlan(plan, "作品已完成，未执行的计划步骤已跳过");
      addMessage({
        role: "assistant",
        content: allowInteraction
          ? "已完成当前设计。如需继续优化、分析或保存，请告诉我。"
          : "已完成当前设计。",
        meta: { iteration, type: "artwork-complete" },
      });
      return;
    }

    // 视觉自检（每 4 轮）
    if (
      allowCanvasAnalysis &&
      allowPostArtworkContinuation &&
      iteration % 4 === 0 &&
      iteration > 0
    ) {
      try {
        const screenshot = await captureCanvasForAI();
        const quickEval = await directChat({
          messages: [
            {
              role: "system",
              content:
                "用一句话评价这个设计，格式：评分(X/10) + 主要问题或优点",
            },
            {
              role: "user",
              content: [{ type: "image_url", image_url: { url: screenshot } }],
            },
          ],
          temperature: 0.3,
          maxTokens: 100,
          timeoutMs: AI_TIMEOUTS.quickEvaluate,
        });
        const evalContent = parseChatResponse(quickEval);
        if (evalContent?.content) {
          messagesForLLM.push({
            role: "system",
            content: `[视觉自检] ${evalContent.content}`,
          });
          addMessage({
            role: "assistant",
            content: `👁️ ${evalContent.content}`,
            meta: { iteration, type: "visual-check" },
          });
        }
      } catch (e) {
        console.warn("[Agent] 视觉检查跳过:", e);
      }
    }

    agentState.status = "thinking";
  }

  // 超过最大迭代次数
  console.warn("[Agent] Max iterations reached");
  failRemainingPlan(plan, "达到最大推理轮次");
  addMessage({
    role: "assistant",
    content: "已完成当前任务。如需继续，请告诉我。",
    meta: { iteration },
  });
}

// ============ 视觉评估（手动触发，仅评估不修改） ============

async function runVisualEvaluate(): Promise<VisualEvaluation | null> {
  console.log("[Agent] 启动视觉评估...");

  const evaluation = await evaluateCanvasVisual();
  if (!evaluation) {
    console.log("[Agent] 视觉评估失败或画布为空");
    return null;
  }

  // 显示评估结果
  addMessage({
    role: "assistant",
    content: [
      `**视觉评估 - 评分: ${evaluation.score}/10**`,
      evaluation.strengths.length > 0
        ? `优点: ${evaluation.strengths.join("、")}`
        : "",
      evaluation.weaknesses.length > 0
        ? `不足: ${evaluation.weaknesses.join("、")}`
        : "",
      evaluation.suggestions.length > 0
        ? `建议: ${evaluation.suggestions.join("、")}`
        : "",
    ]
      .filter(Boolean)
      .join("\n"),
    meta: { iteration: 0 },
  });

  return evaluation;
}

// ============ 图片分析流程 ============

async function runImageAnalysisLoop(userMessage: string, imageBase64: string) {
  const maxIterations = 10;
  const ctx = createDesignOperationContext();
  const allTools = buildAITools({
    includeResources: true,
    resourceTools: resourceService.tools,
  });
  let iteration = 0;

  // 添加用户消息（带图片标记）
  addMessage({
    role: "user",
    content: `${userMessage}\n[已上传参考图片]`,
    meta: { hasImage: true },
  });

  // 构建包含图片的消息
  const messagesForLLM: any[] = [
    { role: "system", content: buildImageAnalysisPrompt() },
    {
      role: "user",
      content: [
        { type: "text", text: userMessage },
        {
          type: "image_url",
          image_url: {
            url: imageBase64,
            detail: "high",
          },
        },
      ],
    },
  ];

  // 第一步：让 AI 分析图片
  console.log("[Agent] 开始图片分析...");
  let analysisResponse: any;
  const analysisStartTime = Date.now();

  try {
    analysisResponse = await directChat({
      messages: messagesForLLM,
      tools: allTools,
      maxTokens: 4096,
      timeoutMs: AI_TIMEOUTS.chat,
    });
  } catch (error: any) {
    console.error("[Agent] 图片分析失败:", error);
    addMessage({
      role: "assistant",
      content: `图片分析失败：${error.message}`,
      meta: { iteration: 1, duration: Date.now() - analysisStartTime },
    });
    return;
  }

  const analysisDuration = Date.now() - analysisStartTime;
  iteration = 1;

  // 解析分析响应
  const parsed = parseChatResponse(analysisResponse);

  if (!parsed) {
    console.error("[Agent] 无法解析图片分析响应:", analysisResponse);
    addMessage({
      role: "assistant",
      content: "抱歉，无法解析图片分析结果。",
      meta: { iteration, llmResponse: analysisResponse },
    });
    return;
  }

  const analysisContent = parsed.content;
  const toolCalls = parsed.tool_calls || [];

  // 添加分析结果消息
  addMessage({
    role: "assistant",
    content: analysisContent,
    tool_calls: toolCalls.length > 0 ? toolCalls : undefined,
    meta: {
      iteration,
      duration: analysisDuration,
      llmResponse: { content: analysisContent, tool_calls: toolCalls },
    },
  });

  // 如果有工具调用，执行它们
  if (toolCalls.length > 0) {
    agentState.status = "executing";

    for (const call of toolCalls) {
      const rawArgs = call.function.arguments;
      let args: any;
      if (typeof rawArgs === "string") {
        try {
          args = JSON.parse(rawArgs);
        } catch {
          args = safeParseToolArgs(String(rawArgs));
        }
      } else {
        args = rawArgs;
      }

      const toolName = resolveAIToolName(call.function.name);
      console.log("[Agent] 执行工具:", toolName, args);

      // 检查是否是交互工具
      if (INTERACTION_TOOL_NAMES.includes(call.function.name)) {
        agentState.status = "waiting_user";
        agentState.pendingInteraction = {
          type: call.function.name,
          question: args.question,
          options: args.options,
        };
        emit({ type: "interaction", data: agentState.pendingInteraction });

        const userResponse = await waitForUserInput();
        console.log("[Agent] 用户响应:", userResponse);

        // 继续执行剩余工具
        agentState.status = "executing";
        agentState.pendingInteraction = null;
        continue;
      }

      // 执行普通工具
      const toolStartTime = Date.now();
      try {
        let result;

        result = await executeToolWithTimeout(toolName, args, ctx);

        const toolDuration = Date.now() - toolStartTime;
        console.log("[Agent] 工具结果:", result);

        if (result?.success) {
          syncAgentDesignProvenanceAfterTool(toolName, args, userMessage);
        }

        addMessage({
          role: "tool",
          tool_call_id: call.id,
          tool_name: toolName,
          content: JSON.stringify(result),
          meta: {
            iteration,
            toolArgs: args,
            toolResult: result,
            duration: toolDuration,
          },
        });
      } catch (error: any) {
        console.error("[Agent] 工具错误:", error);
        const errorResult = { success: false, error: error.message };

        addMessage({
          role: "tool",
          tool_call_id: call.id,
          tool_name: toolName,
          content: JSON.stringify(errorResult),
          meta: {
            iteration,
            toolArgs: args,
            toolResult: errorResult,
            duration: Date.now() - toolStartTime,
          },
        });
      }
    }
  }

  // 添加完成消息
  addMessage({
    role: "assistant",
    content: "已完成图片分析和设计创建。你可以继续调整或告诉我需要修改的地方。",
    meta: { iteration: iteration + 1 },
  });
}

function waitForUserInput(): Promise<string> {
  return new Promise((resolve) => {
    waitForUserInputPromise = { resolve };
  });
}

// ============ 自动评估 ============

interface EvaluationResult {
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  shouldIterate: boolean;
}

async function runAutoEvaluation(): Promise<EvaluationResult | null> {
  console.log("[Agent] 开始自动评估...");

  try {
    const imageBase64 = await captureCanvasForAI();
    const stateSummary = getCanvasStateSummary();

    const response = await directChat({
      messages: [
        {
          role: "system",
          content:
            "你是一个专业的设计评审专家。评估设计作品的质量，只输出 JSON。",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `评估这个设计的质量。

画布状态：
${stateSummary}

严格按 JSON 格式输出：
{
  "score": 综合分数(1-10整数),
  "strengths": ["优点1", "优点2"],
  "weaknesses": ["不足1", "不足2"],
  "suggestions": ["具体改进建议1", "具体改进建议2"],
  "shouldIterate": true/false
}`,
            },
            {
              type: "image_url",
              image_url: { url: imageBase64, detail: "high" },
            },
          ],
        },
      ],
      temperature: 0.3,
      timeoutMs: AI_TIMEOUTS.quickEvaluate,
    });

    let resultText = extractContent(response);

    let evaluation = extractJSON(resultText);

    if (!evaluation) {
      console.warn("[Agent] 无法解析评估结果");
      return null;
    }

    const result: EvaluationResult = {
      score: evaluation.score || 5,
      strengths: evaluation.strengths || [],
      weaknesses: evaluation.weaknesses || [],
      suggestions: evaluation.suggestions || [],
      shouldIterate:
        evaluation.shouldIterate !== false && (evaluation.score || 5) < 6,
    };

    console.log("[Agent] 评估结果:", result);
    return result;
  } catch (error: any) {
    console.error("[Agent] 自动评估失败:", error);
    return null;
  }
}

async function runAutoImprove(suggestions: string[]): Promise<void> {
  const ctx = createDesignOperationContext();

  for (const suggestion of suggestions.slice(0, 2)) {
    try {
      const result = await executeToolWithTimeout(
        "canvas.evaluateDesign",
        { criteria: suggestion },
        ctx,
      );
      console.log("[Agent] 自动改进结果:", result);
    } catch (error: any) {
      console.error("[Agent] 自动改进失败:", error);
    }
  }
}

// ============ 自测流程 ============

async function runSelfTest(): Promise<void> {
  const maxRounds = 1;
  let round = 0;

  addMessage({
    role: "assistant",
    content: "开始自测：截图 → 评估。默认不自动多轮改稿，避免过度设计。",
    meta: { iteration: 0 },
  });

  while (round < maxRounds) {
    round++;
    console.log(`[SelfTest] 第 ${round} 轮评估`);

    // 等待渲染
    await new Promise((resolve) => setTimeout(resolve, 500));

    const evaluation = await runAutoEvaluation();
    if (!evaluation) {
      addMessage({
        role: "assistant",
        content: `第 ${round} 轮评估失败，无法获取评估结果。`,
        meta: { iteration: round },
      });
      break;
    }

    // 添加评估消息
    const evalMsg = [
      `**第 ${round} 轮评估 - 评分: ${evaluation.score}/10**`,
      "",
      evaluation.strengths.length > 0
        ? `优点: ${evaluation.strengths.join("、")}`
        : "",
      evaluation.weaknesses.length > 0
        ? `不足: ${evaluation.weaknesses.join("、")}`
        : "",
      evaluation.suggestions.length > 0
        ? `建议: ${evaluation.suggestions.join("、")}`
        : "",
    ]
      .filter(Boolean)
      .join("\n");

    addMessage({
      role: "assistant",
      content: evalMsg,
      meta: { iteration: round },
    });

    // 如果分数够高或不需要迭代，结束
    if (evaluation.score >= 8 || !evaluation.shouldIterate) {
      addMessage({
        role: "assistant",
        content: `自测完成！最终评分: ${evaluation.score}/10${evaluation.score >= 8 ? "，质量达标。" : ""}`,
        meta: { iteration: round },
      });
      break;
    }

    // 需要迭代优化，调用 Agent 让 AI 自动改进
    addMessage({
      role: "assistant",
      content: `评分 ${evaluation.score}/10 未达标，自动优化中...`,
      meta: { iteration: round },
    });

    // 用 LLM 生成改进指令并执行
    try {
      const improveResponse = await directChat({
        messages: [
          {
            role: "system",
            content: buildSystemPrompt(),
          },
          {
            role: "user",
            content: `当前设计评分 ${evaluation.score}/10，有以下问题：
${evaluation.weaknesses.map((w, i) => `${i + 1}. ${w}`).join("\n")}

改进建议：
${evaluation.suggestions.map((s, i) => `${i + 1}. ${s}`).join("\n")}

请使用工具改进设计。只执行最关键的 1-2 个改进操作。`,
          },
        ],
        tools: buildAITools({
          includeResources: true,
          resourceTools: resourceService.tools,
        }),
        timeoutMs: AI_TIMEOUTS.chat,
      });

      // 解析并执行改进操作
      const msg = parseChatResponse(improveResponse);

      if (msg?.tool_calls && msg.tool_calls.length > 0) {
        const ctx = createDesignOperationContext();
        for (const call of msg.tool_calls) {
          const rawArgs = call.function.arguments;
          let args: any;
          if (typeof rawArgs === "string") {
            try {
              args = JSON.parse(rawArgs);
            } catch {
              args = safeParseToolArgs(String(rawArgs));
            }
          } else {
            args = rawArgs;
          }

          const toolName = resolveAIToolName(call.function.name);

          try {
            await executeToolWithTimeout(toolName, args, ctx);
          } catch (err) {
            console.error("[SelfTest] 改进操作失败:", err);
          }
        }
      }
    } catch (error: any) {
      console.error("[SelfTest] 改进流程失败:", error);
      break;
    }
  }

  if (round >= maxRounds) {
    addMessage({
      role: "assistant",
      content: `自测完成，共 ${maxRounds} 轮迭代。`,
      meta: { iteration: round },
    });
  }
}

// ============ 测试套件 ============

interface SuiteTestCase {
  category: string;
  prompt: string;
}

const TEST_CASES: SuiteTestCase[] = [
  {
    category: "基础文字",
    prompt: "先清空画布，然后添加一个写着 HELLO 的红色大字，居中显示",
  },
  {
    category: "背景设置",
    prompt: "先清空画布，然后把画布背景设为深蓝到紫色的渐变",
  },
  {
    category: "形状添加",
    prompt: "先清空画布，然后添加一个红色圆形和一个蓝色矩形",
  },
  {
    category: "多元素组合",
    prompt:
      "先清空画布，然后创建一个简约名片：深色背景、白色标题、副标题、装饰线条",
  },
  {
    category: "图片搜索添加",
    prompt: "先清空画布，搜索猫咪图片，然后把搜到的一张图片添加到画布上",
  },
  {
    category: "多图拼贴",
    prompt: "先清空画布，搜索花朵和风景图片各3张，用 HTML Grid 做一个 2x2 拼图",
  },
  {
    category: "渐变文字",
    prompt: "先清空画布，添加一个大标题，文字用渐变填充效果",
  },
  {
    category: "发光效果",
    prompt: "先清空画布，深色背景，添加一个有霓虹发光效果的文字",
  },
];

function runOneTest(
  tc: SuiteTestCase,
  idx: number,
): Promise<{
  pass: boolean;
  elements: number;
  score: number;
  detail: string;
}> {
  return new Promise((resolve) => {
    const t0 = Date.now();
    const maxMs = 90_000;

    // 清空状态
    agentState.messages.length = 0;
    agentState.searchHistory.length = 0;
    agentState.plan = null;
    agentState.pendingInteraction = null;
    resourceService.clearSearchCache();

    // 监控交互请求，自动回复
    const interactionGuard = setInterval(() => {
      if (agentState.status === "waiting_user" && waitForUserInputPromise) {
        waitForUserInputPromise.resolve("直接执行，不要问我");
        waitForUserInputPromise = null;
      }
    }, 500);

    const timeout = setTimeout(() => {
      clearInterval(interactionGuard);
      resolve({
        pass: false,
        elements: 0,
        score: 0,
        detail: `超时（${maxMs / 1000}s）`,
      });
    }, maxMs);

    runAgentLoop(tc.prompt)
      .then(() => {
        clearTimeout(timeout);
        clearInterval(interactionGuard);

        const ctx = createDesignOperationContext();
        const allChildren = ctx.getCanvasChildren();
        const elements = Math.max(0, allChildren.length - 1);

        const toolMsgs = agentState.messages.filter((m) => m.role === "tool");
        const toolCount = toolMsgs.length;
        const errCount = toolMsgs.filter((m) => {
          try {
            return JSON.parse(m.content).success === false;
          } catch {
            return false;
          }
        }).length;

        const pass = elements > 0 && errCount === 0;
        const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
        const detail = `${elements} 元素, ${toolCount} 工具, ${errCount} 错误, ${elapsed}s`;

        resolve({
          pass,
          elements,
          score: pass ? 1 : 0,
          detail,
        });
      })
      .catch((e: any) => {
        clearTimeout(timeout);
        clearInterval(interactionGuard);
        resolve({
          pass: false,
          elements: 0,
          score: 0,
          detail: `异常: ${e?.message || "未知错误"}`,
        });
      });
  });
}

async function runTestSuite(): Promise<string> {
  const total = TEST_CASES.length;
  addMessage({
    role: "assistant",
    content: `🧪 测试套件启动：${total} 个用例\n\n${TEST_CASES.map((t, i) => `${i + 1}. [${t.category}] ${t.prompt}`).join("\n")}`,
  });

  const results: Array<{
    category: string;
    prompt: string;
    pass: boolean;
    elements: number;
    score: number;
    detail: string;
  }> = [];

  for (let i = 0; i < total; i++) {
    const tc = TEST_CASES[i];
    addMessage({
      role: "assistant",
      content: `⏳ [${i + 1}/${total}] ${tc.category}...`,
    });

    const r = await runOneTest(tc, i);

    addMessage({
      role: "assistant",
      content: `${r.pass ? "✅" : "❌"} [${tc.category}] ${r.detail}`,
    });

    results.push({ ...tc, ...r });

    // 测试间隔，等待渲染稳定
    await new Promise((res) => setTimeout(res, 1500));
  }

  // 生成报告
  const categories = [...new Set(results.map((r) => r.category))];
  const catStats = categories.map((cat) => {
    const rs = results.filter((r) => r.category === cat);
    const passed = rs.filter((r) => r.pass).length;
    return {
      name: cat,
      passed,
      total: rs.length,
      ok: passed === rs.length,
    };
  });

  const passCount = results.filter((r) => r.pass).length;
  const failItems = results
    .filter((r) => !r.pass)
    .map((r) => `- [${r.category}] ${r.prompt}\n  → ${r.detail}`);

  const lines = [
    `## 🧪 测试报告`,
    ``,
    `**通过率**: ${passCount}/${total} (${Math.round((passCount / total) * 100)}%)`,
    ``,
    `### 分类结果`,
    ...catStats.map(
      (c) => `${c.ok ? "✅" : "❌"} ${c.name}: ${c.passed}/${c.total}`,
    ),
    ``,
  ];

  if (failItems.length > 0) {
    lines.push(`### 失败用例`, ...failItems, ``);
  }

  if (passCount < total) {
    lines.push(`### 改进建议`);
    const weakCats = catStats.filter((c) => !c.ok).map((c) => c.name);
    if (weakCats.includes("图片搜索添加") || weakCats.includes("多图拼贴")) {
      lines.push(
        `- **图片/拼贴类**：检查 resource.searchSticker 的 URL 是否正确传递给 canvas.addImage 或 htmlBindings`,
      );
    }
    if (weakCats.includes("渐变文字") || weakCats.includes("发光效果")) {
      lines.push(
        `- **CSS 特效类**：检查 design-tips 知识库是否被正确注入，Agent 是否使用了正确的 CSS 语法`,
      );
    }
    if (weakCats.includes("多元素组合")) {
      lines.push(`- **组合类**：检查 Agent 的规划能力是否能正确分解多步任务`);
    }
    if (
      weakCats.includes("基础文字") ||
      weakCats.includes("背景设置") ||
      weakCats.includes("形状添加")
    ) {
      lines.push(
        `- **基础类**：检查 canvas.addChild / canvas.setBackgroundColor 等基本工具是否正常`,
      );
    }
  }

  lines.push(``, `*测试时间: ${new Date().toLocaleString()}*`);

  const report = lines.join("\n");
  addMessage({ role: "assistant", content: report });
  return report;
}

// ============ 导出 ============

export const designAgent = {
  state: agentState,

  isProcessing: computed(
    () => agentState.status === "thinking" || agentState.status === "executing",
  ),

  isWaitingForUser: computed(() => agentState.status === "waiting_user"),

  currentPlan: computed(() => agentState.plan),

  onEvent(listener: (event: any) => void) {
    eventListeners.push(listener);
    return () => {
      const index = eventListeners.indexOf(listener);
      if (index > -1) eventListeners.splice(index, 1);
    };
  },

  async chat(
    userMessage: string,
    options: RunAgentLoopOptions = {},
  ): Promise<void> {
    // 如果 agent 在等待用户响应，将输入作为交互响应
    if (agentState.status === "waiting_user") {
      console.log("[Agent] Submitting user response:", userMessage);
      this.submitUserResponse(userMessage);
      return;
    }

    // 如果 agent 在处理中，忽略输入
    if (agentState.status !== "idle") {
      console.warn("[Agent] Agent is busy, status:", agentState.status);
      return;
    }

    agentState.status = "thinking";
    agentState.error = null;
    syncAgentStatus({
      userInput: userMessage,
      startedAt: new Date().toISOString(),
    });

    try {
      await runAgentLoop(userMessage, options);
    } catch (error: any) {
      console.error("[Agent] Error:", error);
      agentState.error = error.message || "未知错误";
      addMessage({
        role: "assistant",
        content: `抱歉，出现了错误：${error.message}`,
      });
    } finally {
      agentState.status = "idle";
      syncAgentStatus({
        step: "完成",
        userInput: undefined,
        lastToolCall: undefined,
        lastError: undefined,
      });
      emit({ type: "done", data: null });
    }
  },

  async chatWithImage(userMessage: string, imageBase64: string): Promise<void> {
    // 如果 agent 在处理中，忽略
    if (agentState.status !== "idle") {
      console.warn("[Agent] Agent is busy, status:", agentState.status);
      return;
    }

    agentState.status = "thinking";
    agentState.error = null;

    try {
      await runImageAnalysisLoop(userMessage, imageBase64);
    } catch (error: any) {
      console.error("[Agent] Error:", error);
      agentState.error = error.message || "未知错误";
      addMessage({
        role: "assistant",
        content: `抱歉，出现了错误：${error.message}`,
      });
    } finally {
      agentState.status = "idle";
      emit({ type: "done", data: null });
    }
  },

  submitUserResponse(response: string) {
    if (waitForUserInputPromise) {
      waitForUserInputPromise.resolve(response);
      waitForUserInputPromise = null;
    }
  },

  async evaluate(): Promise<VisualEvaluation | null> {
    if (agentState.status !== "idle") {
      console.warn("[Agent] Agent is busy, status:", agentState.status);
      return null;
    }

    agentState.status = "thinking";

    try {
      return await runVisualEvaluate();
    } catch (error: any) {
      console.error("[Agent] Evaluate error:", error);
      return null;
    } finally {
      agentState.status = "idle";
      emit({ type: "done", data: null });
    }
  },

  async selfTest(): Promise<void> {
    if (agentState.status !== "idle") {
      console.warn("[Agent] Agent is busy, status:", agentState.status);
      return;
    }

    agentState.status = "thinking";
    agentState.error = null;

    try {
      await runSelfTest();
    } catch (error: any) {
      console.error("[Agent] SelfTest error:", error);
      agentState.error = error.message || "自测失败";
      addMessage({ role: "assistant", content: `自测失败：${error.message}` });
    } finally {
      agentState.status = "idle";
      emit({ type: "done", data: null });
    }
  },

  async autoEvaluate(): Promise<EvaluationResult | null> {
    if (agentState.status !== "idle") {
      console.warn("[Agent] Agent is busy, status:", agentState.status);
      return null;
    }

    agentState.status = "thinking";

    try {
      return await runAutoEvaluation();
    } catch (error: any) {
      console.error("[Agent] AutoEvaluate error:", error);
      return null;
    } finally {
      agentState.status = "idle";
    }
  },

  async runTestSuite(): Promise<string> {
    if (agentState.status !== "idle") {
      console.warn("[Agent] Agent is busy, status:", agentState.status);
      return "Agent 正忙";
    }
    agentState.status = "thinking";
    agentState.error = null;
    try {
      return await runTestSuite();
    } catch (error: any) {
      console.error("[Agent] TestSuite error:", error);
      agentState.error = error.message || "测试套件失败";
      addMessage({
        role: "assistant",
        content: `测试套件失败：${error.message}`,
      });
      return `失败: ${error.message}`;
    } finally {
      agentState.status = "idle";
      emit({ type: "done", data: null });
    }
  },

  /**
   * 批量引擎专用：直接运行 agent 循环，由调用方管理生命周期
   * - 每次调用会清空上一轮消息和搜索缓存
   * - 调用方负责在调用前/后检查暂停/停止状态
   */
  async _runBatchItem(userMessage: string): Promise<void> {
    agentState.status = "thinking";
    agentState.error = null;
    agentState.messages.length = 0;
    agentState.searchHistory.length = 0;
    agentState.plan = null;
    agentState.pendingInteraction = null;
    agentState.batchTask = null;
    resourceService.clearSearchCache();

    try {
      await runAgentLoop(userMessage, {
        allowInteraction: false,
        allowCanvasAnalysis: false,
        deliveryHandledExternally: true,
        excludeOperations: AUTO_BATCH_BLOCKED_OPERATIONS,
      });
    } catch (error: any) {
      console.error("[BatchItem] Error:", error);
      agentState.error = error.message || "未知错误";
    } finally {
      agentState.status = "idle";
      emit({ type: "done", data: null });
    }
  },

  clearMessages() {
    // 终止所有进行中的操作
    agentState.status = "idle";
    agentState.error = null;
    agentState.pendingInteraction = null;
    agentState.plan = null;
    agentState.batchTask = null;

    // 解除等待中的用户输入 Promise，防止循环卡住
    if (waitForUserInputPromise) {
      waitForUserInputPromise.resolve("[已中断]");
      waitForUserInputPromise = null;
    }

    // 清空消息和缓存
    agentState.messages.length = 0;
    clearPersistedConversation();
    agentState.searchHistory.length = 0;
    resourceService.clearSearchCache();
    syncAgentStatus({
      step: undefined,
      userInput: undefined,
      plan: undefined,
      lastToolCall: undefined,
      lastError: undefined,
    });
  },

  /**
   * 停止当前处理，但保留对话消息（区别于 clearMessages）
   */
  stop() {
    agentState.status = "idle";
    agentState.error = null;
    agentState.pendingInteraction = null;
    agentState.plan = null;
    agentState.batchTask = null;

    // 解除等待中的用户输入 Promise，防止循环卡住
    if (waitForUserInputPromise) {
      waitForUserInputPromise.resolve("[已中断]");
      waitForUserInputPromise = null;
    }

    persistConversation();
    syncAgentStatus({
      step: undefined,
      userInput: undefined,
      plan: undefined,
      lastToolCall: undefined,
      lastError: undefined,
    });
  },
};
