import { reactive, computed } from "vue";
import { directChat } from "../direct-client";
import {
  getOperationTools,
  executeOperation,
  createDesignOperationContext,
} from "@/operations";
import { canvasStickerOptions } from "@/components/design/layout/canvas";
import { buildSystemPrompt, buildImageAnalysisPrompt } from "../prompts/system";
import { resourceService } from "../services/resource";

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

// ============ 工具定义 ============

const interactionTools = ["ask_choice", "request_feedback"];
const resourceToolNames = ["resource.searchFont", "resource.searchImage"];

function getTools() {
  const tools = getOperationTools();
  return [
    ...tools.map((t) => ({
      type: "function" as const,
      function: {
        name: t.name,
        description: t.description,
        parameters: t.input_schema,
      },
    })),
    ...resourceService.tools,
    {
      type: "function" as const,
      function: {
        name: "ask_choice",
        description: "向用户提问，让用户做选择。当有多种设计方向、需要用户决策时使用。",
        parameters: {
          type: "object",
          properties: {
            question: { type: "string", description: "要问用户的问题" },
            options: {
              type: "array",
              items: { type: "string" },
              description: "选项列表（可选）",
            },
          },
          required: ["question"],
        },
      },
    },
    {
      type: "function" as const,
      function: {
        name: "request_feedback",
        description: "展示当前效果，请求用户反馈。当完成一个步骤后，询问用户是否满意。",
        parameters: {
          type: "object",
          properties: {
            question: { type: "string", description: "想问用户什么" },
          },
          required: ["question"],
        },
      },
    },
  ];
}

// ============ Agent 状态 ============

const agentState = reactive({
  status: "idle" as "idle" | "thinking" | "executing" | "waiting_user" | "done",
  messages: [] as AgentMessage[],
  pendingInteraction: null as AgentInteraction | null,
  error: null as string | null,
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

// ============ Agent 循环 ============

async function runAgentLoop(userMessage: string) {
  const maxIterations = 10;
  const ctx = createDesignOperationContext();
  const allTools = getTools();
  let iteration = 0;

  // 添加用户消息
  addMessage({ role: "user", content: userMessage });

  // 构建消息列表
  const messagesForLLM: any[] = [
    { role: "system", content: buildSystemPrompt() },
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
    let message: any = null;
    const res = response as any;

    if (res?.choices?.[0]?.message) {
      message = res.choices[0].message;
    } else if (res?.data?.choices?.[0]?.message) {
      message = res.data.choices[0].message;
    } else if (typeof res?.data === "string") {
      message = { content: res.data };
    } else if (res?.content || res?.tool_calls) {
      message = res;
    }

    if (!message) {
      console.error("[Agent] No message in response:", response);
      addMessage({ 
        role: "assistant", 
        content: "抱歉，无法解析响应。",
        meta: { iteration, llmResponse: response }
      });
      return;
    }

    const content = message.content || "";
    const toolCalls = message.tool_calls || [];

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
      const args = typeof call.function.arguments === "string"
        ? JSON.parse(call.function.arguments)
        : call.function.arguments;

      console.log("[Agent] Executing tool:", call.function.name, args);

      // 检查是否是交互工具
      if (interactionTools.includes(call.function.name)) {
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
          result = await resourceService.executeTool(call.function.name, args);
        } else {
          result = await executeOperation(call.function.name, args, ctx);
        }
        
        const toolDuration = Date.now() - toolStartTime;
        console.log("[Agent] Tool result:", result);

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

        messagesForLLM.push(
          { role: "assistant", content, tool_calls: toolCalls },
          { role: "user", content: `[工具结果] ${call.function.name}: ${JSON.stringify(result)}` },
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

// ============ 图片分析流程 ============

async function runImageAnalysisLoop(userMessage: string, imageBase64: string) {
  const maxIterations = 10;
  const ctx = createDesignOperationContext();
  const allTools = getTools();
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
  let analysisMessage: any = null;
  const res = analysisResponse as any;

  if (res?.choices?.[0]?.message) {
    analysisMessage = res.choices[0].message;
  } else if (res?.data?.choices?.[0]?.message) {
    analysisMessage = res.data.choices[0].message;
  } else if (res?.content || res?.tool_calls) {
    analysisMessage = res;
  }

  if (!analysisMessage) {
    console.error("[Agent] 无法解析图片分析响应:", analysisResponse);
    addMessage({ 
      role: "assistant", 
      content: "抱歉，无法解析图片分析结果。",
      meta: { iteration, llmResponse: analysisResponse }
    });
    return;
  }

  const analysisContent = analysisMessage.content || "";
  const toolCalls = analysisMessage.tool_calls || [];

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
      const args = typeof call.function.arguments === "string"
        ? JSON.parse(call.function.arguments)
        : call.function.arguments;

      console.log("[Agent] 执行工具:", call.function.name, args);

      // 检查是否是交互工具
      if (interactionTools.includes(call.function.name)) {
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

  clearMessages() {
    agentState.messages.length = 0;
    agentState.error = null;
    agentState.pendingInteraction = null;
    agentState.status = "idle";
  },
};
