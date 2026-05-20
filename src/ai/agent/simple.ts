import { reactive, computed } from "vue";
import { directChat } from "../direct-client";
import {
  executeOperation,
  createDesignOperationContext,
} from "@/operations";
import { canvasStickerOptions } from "@/components/design/layout/canvas";
import { buildSystemPrompt, buildImageAnalysisPrompt } from "../prompts/system";
import { resourceService } from "../services/resource";
import { captureCanvasForAI, getCanvasStateSummary } from "../capture";
import { buildAITools, INTERACTION_TOOL_NAMES } from "../shared/tools";
import { parseChatResponse, extractContent, extractJSON } from "../shared/response-parser";
import { evaluateCanvasVisual } from "../visual-evaluate";
import type { VisualEvaluation } from "../visual-evaluate";

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
    iteration?: number;        // 迭代轮次
    toolArgs?: any;            // 工具调用参数
    toolResult?: any;          // 工具执行结果（完整）
    duration?: number;         // 执行耗时（ms）
    llmResponse?: any;         // LLM 原始响应
    hasImage?: boolean;        // 是否包含图片
  };
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
}

// ============ 工具定义 ============

const resourceToolNames = ["resource.searchFont", "resource.searchImage"];

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
});

let waitForUserInputPromise: { resolve: (value: string) => void } | null = null;
const eventListeners: ((event: any) => void)[] = [];

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function emit(event: any) {
  eventListeners.forEach((listener) => listener(event));
}

function addMessage(msg: Partial<AgentMessage>): AgentMessage {
  const message: AgentMessage = {
    id: generateId(),
    timestamp: Date.now(),
    ...msg,
  } as AgentMessage;
  agentState.messages.push(message);
  emit({ type: "message", data: message });
  return message;
}

// ============ 搜索去重 ============

function isDuplicateSearch(toolName: string, args: Record<string, any>): SearchRecord | null {
  const query = (args.query || "").toLowerCase().trim();
  if (!query) return null;

  return agentState.searchHistory.find(
    (r) =>
      r.tool === toolName &&
      r.query.toLowerCase().trim() === query &&
      r.resultCount > 0
  ) || null;
}

function recordSearch(toolName: string, args: Record<string, any>, resultCount: number, iteration: number) {
  agentState.searchHistory.push({
    tool: toolName,
    query: args.query || "",
    resultCount,
    iteration,
  });
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

function completeBatchItem(): { current: number; total: number; hint: string; isComplete: boolean } {
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
  if (fixed.trim().endsWith('"') && !fixed.trim().endsWith('}')) {
    fixed = fixed.trimEnd() + "}";
  }

  try {
    return JSON.parse(fixed);
  } catch (e: any) {
    console.warn("[Agent] Failed to recover JSON, returning empty args:", e.message);
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

async function runAgentLoop(userMessage: string) {
  const maxIterations = 10;
  const ctx = createDesignOperationContext();
  const allTools = buildAITools({ includeResources: true, resourceTools: resourceService.tools });
  let iteration = 0;

  // 添加用户消息
  addMessage({ role: "user", content: userMessage });

  // 构建消息列表（注入搜索上下文和任务进度）
  const systemPrompt = buildSystemPrompt() + buildSearchContext() + getBatchProgress();
  const messagesForLLM: any[] = [
    { role: "system", content: systemPrompt },
    ...agentState.messages.map((m) => ({
      role: m.role === "tool" ? "user" : m.role,
      content: m.content,
      ...(m.tool_calls ? { tool_calls: m.tool_calls } : {}),
      ...(m.tool_call_id ? { tool_call_id: m.tool_call_id, name: m.tool_name } : {}),
    })),
  ];

  for (let i = 0; i < maxIterations; i++) {
    iteration = i + 1;
    console.log(`[Agent] Iteration ${iteration}`);
    emit({ type: "iteration", data: { iteration, maxIterations } });

    // 调用 LLM
    let response: any;
    const llmStartTime = Date.now();
    try {
      response = await directChat({
        messages: messagesForLLM,
        tools: allTools,
      });
    } catch (error: any) {
      console.error("[Agent] LLM error:", error);
      addMessage({ 
        role: "assistant", 
        content: `抱歉，出现了错误：${error.message}`,
        meta: { iteration, duration: Date.now() - llmStartTime }
      });
      return;
    }
    const llmDuration = Date.now() - llmStartTime;

    // 解析响应
    const parsed = parseChatResponse(response);

    if (!parsed) {
      console.error("[Agent] No message in response:", response);
      addMessage({ 
        role: "assistant", 
        content: "抱歉，无法解析响应。",
        meta: { iteration, llmResponse: response }
      });
      return;
    }

    const content = parsed.content;
    const toolCalls = parsed.tool_calls || [];

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
      return;
    }

    // 执行工具调用
    agentState.status = "executing";

    for (const call of toolCalls) {
      const rawArgs = call.function.arguments;
      let args: any;

      if (typeof rawArgs === "string") {
        try {
          args = JSON.parse(rawArgs);
        } catch {
          console.warn("[Agent] JSON parse failed, trying recovery:", String(rawArgs).slice(0, 200));
          args = safeParseToolArgs(String(rawArgs));
        }
      } else {
        args = rawArgs;
      }

      console.log("[Agent] Executing tool:", call.function.name, args);

      // 检查是否是交互工具
      if (INTERACTION_TOOL_NAMES.includes(call.function.name)) {
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

        // 添加用户响应到消息列表
        messagesForLLM.push(
          { role: "assistant", content, tool_calls: toolCalls },
          { role: "user", content: userResponse },
        );

        agentState.status = "thinking";
        agentState.pendingInteraction = null;

        // 继续循环
        continue;
      }

      // 执行普通工具
      const toolStartTime = Date.now();
      try {
        let result;
        
        // 检查是否是资源工具
        if (resourceToolNames.includes(call.function.name)) {
          // 检查是否是重复搜索
          const duplicate = isDuplicateSearch(call.function.name, args);
          if (duplicate) {
            console.log(`[Agent] 跳过重复搜索: ${call.function.name}("${args.query}") (第${duplicate.iteration}轮已搜索)`);
            result = {
              success: true,
              data: [],
              total: duplicate.resultCount,
              query: args.query,
              message: `此搜索在第${duplicate.iteration}轮已执行过，找到${duplicate.resultCount}个结果。请使用之前的结果，不要重复搜索。`,
            };
          } else {
            result = await resourceService.executeTool(call.function.name, args);
            // 记录搜索结果
            const resultCount = result?.data?.length || 0;
            recordSearch(call.function.name, args, resultCount, iteration);
          }
        } else {
          result = await executeOperation(call.function.name, args, ctx);
        }
        
        const toolDuration = Date.now() - toolStartTime;
        console.log("[Agent] Tool result:", result);

        // 如果是保存操作，更新任务进度
        let progressHint = "";
        if (call.function.name === "canvas.updateAndSaveSticker" && result?.success) {
          const progress = completeBatchItem();
          if (progress.hint) {
            progressHint = `\n\n[任务进度] ${progress.hint}`;
          }
        }

        addMessage({
          role: "tool",
          tool_call_id: call.id,
          tool_name: call.function.name,
          content: JSON.stringify(result) + progressHint,
          meta: {
            iteration,
            toolArgs: args,
            toolResult: result,
            duration: toolDuration,
          },
        });

        messagesForLLM.push(
          { role: "assistant", content, tool_calls: toolCalls },
          { role: "user", content: `[工具结果] ${call.function.name}: ${JSON.stringify(result)}${progressHint}` },
        );
      } catch (error: any) {
        console.error("[Agent] Tool error:", error);
        const errorResult = { success: false, error: error.message };

        addMessage({
          role: "tool",
          tool_call_id: call.id,
          tool_name: call.function.name,
          content: JSON.stringify(errorResult),
          meta: {
            iteration,
            toolArgs: args,
            toolResult: errorResult,
            duration: Date.now() - toolStartTime,
          },
        });

        messagesForLLM.push(
          { role: "assistant", content, tool_calls: toolCalls },
          { role: "user", content: `[工具结果] ${call.function.name}: ${JSON.stringify(errorResult)}` },
        );
      }
    }

    agentState.status = "thinking";
  }

  // 超过最大迭代次数
  console.warn("[Agent] Max iterations reached");
  addMessage({ 
    role: "assistant", 
    content: "已完成当前任务。如需继续，请告诉我。",
    meta: { iteration }
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
      evaluation.strengths.length > 0 ? `优点: ${evaluation.strengths.join("、")}` : "",
      evaluation.weaknesses.length > 0 ? `不足: ${evaluation.weaknesses.join("、")}` : "",
      evaluation.suggestions.length > 0 ? `建议: ${evaluation.suggestions.join("、")}` : "",
    ].filter(Boolean).join("\n"),
    meta: { iteration: 0 },
  });

  return evaluation;
}

// ============ 图片分析流程 ============

async function runImageAnalysisLoop(userMessage: string, imageBase64: string) {
  const maxIterations = 10;
  const ctx = createDesignOperationContext();
  const allTools = buildAITools({ includeResources: true, resourceTools: resourceService.tools });
  let iteration = 0;

  // 添加用户消息（带图片标记）
  addMessage({ 
    role: "user", 
    content: `${userMessage}\n[已上传参考图片]`,
    meta: { hasImage: true }
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
            detail: "high"
          } 
        }
      ]
    }
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
    });
  } catch (error: any) {
    console.error("[Agent] 图片分析失败:", error);
    addMessage({ 
      role: "assistant", 
      content: `图片分析失败：${error.message}`,
      meta: { iteration: 1, duration: Date.now() - analysisStartTime }
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
      meta: { iteration, llmResponse: analysisResponse }
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
        try { args = JSON.parse(rawArgs); }
        catch { args = safeParseToolArgs(String(rawArgs)); }
      } else {
        args = rawArgs;
      }

      console.log("[Agent] 执行工具:", call.function.name, args);

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
        
        if (resourceToolNames.includes(call.function.name)) {
          result = await resourceService.executeTool(call.function.name, args);
        } else {
          result = await executeOperation(call.function.name, args, ctx);
        }
        
        const toolDuration = Date.now() - toolStartTime;
        console.log("[Agent] 工具结果:", result);

        addMessage({
          role: "tool",
          tool_call_id: call.id,
          tool_name: call.function.name,
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
          tool_name: call.function.name,
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
    meta: { iteration: iteration + 1 }
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
          content: "你是一个专业的设计评审专家。评估设计作品的质量，只输出 JSON。",
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
            { type: "image_url", image_url: { url: imageBase64, detail: "high" } },
          ],
        },
      ],
      temperature: 0.3,
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
      shouldIterate: evaluation.shouldIterate !== false && (evaluation.score || 5) < 8,
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
      const result = await executeOperation(
        "canvas.evaluateDesign",
        { criteria: suggestion },
        ctx
      );
      console.log("[Agent] 自动改进结果:", result);
    } catch (error: any) {
      console.error("[Agent] 自动改进失败:", error);
    }
  }
}

// ============ 自测流程 ============

async function runSelfTest(): Promise<void> {
  const maxRounds = 3;
  let round = 0;

  addMessage({
    role: "assistant",
    content: "开始自测：截图 → 评估 → 迭代优化...",
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
      evaluation.strengths.length > 0 ? `优点: ${evaluation.strengths.join("、")}` : "",
      evaluation.weaknesses.length > 0 ? `不足: ${evaluation.weaknesses.join("、")}` : "",
      evaluation.suggestions.length > 0 ? `建议: ${evaluation.suggestions.join("、")}` : "",
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
        tools: buildAITools({ includeResources: true, resourceTools: resourceService.tools }),
      });

      // 解析并执行改进操作
      const msg = parseChatResponse(improveResponse);

      if (msg?.tool_calls && msg.tool_calls.length > 0) {
        const ctx = createDesignOperationContext();
        for (const call of msg.tool_calls) {
          const rawArgs = call.function.arguments;
          let args: any;
          if (typeof rawArgs === "string") {
            try { args = JSON.parse(rawArgs); }
            catch { args = safeParseToolArgs(String(rawArgs)); }
          } else {
            args = rawArgs;
          }

          try {
            if (resourceToolNames.includes(call.function.name)) {
              await resourceService.executeTool(call.function.name, args);
            } else {
              await executeOperation(call.function.name, args, ctx);
            }
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

// ============ 导出 ============

export const designAgent = {
  state: agentState,

  isProcessing: computed(
    () => agentState.status === "thinking" || agentState.status === "executing"
  ),

  isWaitingForUser: computed(() => agentState.status === "waiting_user"),

  onEvent(listener: (event: any) => void) {
    eventListeners.push(listener);
    return () => {
      const index = eventListeners.indexOf(listener);
      if (index > -1) eventListeners.splice(index, 1);
    };
  },

  async chat(userMessage: string): Promise<void> {
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

    try {
      await runAgentLoop(userMessage);
    } catch (error: any) {
      console.error("[Agent] Error:", error);
      agentState.error = error.message || "未知错误";
      addMessage({ role: "assistant", content: `抱歉，出现了错误：${error.message}` });
    } finally {
      agentState.status = "idle";
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
      addMessage({ role: "assistant", content: `抱歉，出现了错误：${error.message}` });
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

  clearMessages() {
    agentState.messages.length = 0;
    agentState.error = null;
    agentState.pendingInteraction = null;
    agentState.searchHistory.length = 0;
    agentState.status = "idle";
    resourceService.clearSearchCache();
  },
};
