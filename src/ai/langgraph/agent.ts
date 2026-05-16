import { reactive, ref, computed } from "vue";
import { aiChat } from "@/ai/api";
import { directChat } from "@/ai/direct-client";
import {
  getOperationTools,
  executeOperation,
  createDesignOperationContext,
} from "@/operations";
import { canvasStickerOptions } from "@/components/design/layout/canvas";
import type {
  AgentMessage,
  AgentState,
  AgentInteraction,
  AgentConfig,
  AgentEvent,
} from "./types";

// 是否使用前端直接调用（默认 true）
const USE_DIRECT_CALL = true;

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function getCanvasSummary() {
  const children = canvasStickerOptions.value.children;
  const mainCanvas = children[0];
  return {
    width: mainCanvas?.width || 500,
    height: mainCanvas?.height || 500,
    elementCount: children.length - 1,
    elements: children.slice(1).map((c: any) => ({
      id: c.id,
      type: c.type,
      content: c.content || c.text || "",
    })),
  };
}

function buildSystemPrompt(): string {
  const canvasState = getCanvasSummary();

  return `你是一个设计协作助手，运行在一个设计工具内部。你可以帮用户创建和修改贴纸设计。

## 当前画布状态
${JSON.stringify(canvasState, null, 2)}

## 你的工作方式

1. **先观察**：了解当前画布有什么元素
2. **再决策**：根据用户需求决定做什么
3. **分步执行**：一次只调用一个工具
4. **及时反馈**：告诉用户你做了什么
5. **主动询问**：有疑问时用 ask_choice 问用户

## 交互工具

当需要用户做选择时，使用 ask_choice 工具：
- 问颜色选择
- 问布局偏好
- 问风格方向

当需要用户反馈时，使用 request_feedback 工具：
- 展示当前效果，询问是否满意

## 设计建议

- 元素默认居中，不指定位置就是居中
- 字号单位是 px，160 是正常大小，300+ 是标题大小
- 颜色用 CSS 格式，如 #ff0000
- 使用 zIndex 控制层级：背景 zIndex=0，文字 zIndex=1+

## 视觉分析

当用户问"现在图是什么"、"分析一下设计"、"看看效果"时，使用 canvas.analyze 工具。
这个工具会截取当前画布并用 AI 视觉分析设计内容。
`;
}

const interactionTools = ["ask_choice", "request_feedback"];

// 全局响应式状态
const agentState = reactive<AgentState>({
  status: "idle",
  messages: [],
  pendingInteraction: null,
  error: null,
});

let waitForUserInputPromise: { resolve: (value: string) => void } | null = null;
const eventListeners: ((event: AgentEvent) => void)[] = [];

function emit(event: AgentEvent) {
  eventListeners.forEach((listener) => listener(event));
}

function addMessage(msg: Partial<AgentMessage>): AgentMessage {
  const message: AgentMessage = {
    id: generateId(),
    timestamp: Date.now(),
    ...msg,
  } as AgentMessage;
  agentState.messages.push(message);
  console.log("[Agent] Message added:", message);
  emit({ type: "message", data: message });
  return message;
}

async function runAgentLoop() {
  const maxIterations = 10;
  const ctx = createDesignOperationContext();

  const tools = getOperationTools();
  const allTools = [
    ...tools.map((t) => ({
      type: "function",
      function: {
        name: t.name,
        description: t.description,
        parameters: t.input_schema,
      },
    })),
    {
      type: "function",
      function: {
        name: "ask_choice",
        description:
          "向用户提问，让用户做选择。当有多种设计方向、需要用户决策时使用。",
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
      type: "function",
      function: {
        name: "request_feedback",
        description:
          "展示当前效果，请求用户反馈。当完成一个步骤后，询问用户是否满意。",
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

  const messagesForLLM: any[] = [
    { role: "system", content: buildSystemPrompt() },
    ...agentState.messages
      .filter((m) => m.role !== "tool")
      .map((m) => ({
        role: m.role,
        content: m.content,
        ...(m.tool_calls ? { tool_calls: m.tool_calls } : {}),
      })),
  ];

  for (let i = 0; i < maxIterations; i++) {
    console.log(`[Agent] Iteration ${i + 1}`);

    let response: any;

    if (USE_DIRECT_CALL) {
      // 前端直接调用大模型
      response = await directChat({
        messages: messagesForLLM,
        tools: allTools,
      });
    } else {
      // 通过服务端调用
      response = await aiChat({
        featureCode: "design_agent",
        messages: messagesForLLM,
        tools: allTools,
      });
    }

    console.log("[Agent] Raw response:", response);

    // 兼容多种返回格式
    let message: any = null;
    const res = response as any;

    // 格式1: { choices: [{ message: {...} }] }
    if (res?.choices?.[0]?.message) {
      message = res.choices[0].message;
    }
    // 格式2: { data: { choices: [{ message: {...} }] } }
    else if (res?.data?.choices?.[0]?.message) {
      message = res.data.choices[0].message;
    }
    // 格式3: { data: "string" } (纯文本)
    else if (typeof res?.data === "string") {
      message = { content: res.data };
    }
    // 格式4: response 本身就是 message
    else if (res?.content || res?.tool_calls) {
      message = res;
    }

    console.log("[Agent] Parsed message:", message);

    if (!message) {
      console.error("[Agent] No message in response, format:", response);
      break;
    }

    const content = message.content || "";
    const toolCalls = message.tool_calls || [];

    console.log("[Agent] Response:", { content, toolCalls });

    if (content || toolCalls.length > 0) {
      addMessage({
        role: "assistant",
        content,
        tool_calls: toolCalls.length > 0 ? toolCalls : undefined,
      });
    }

    if (toolCalls.length === 0) {
      console.log("[Agent] No tool calls, ending loop");
      break;
    }

    agentState.status = "executing";

    for (const call of toolCalls) {
      const args =
        typeof call.function.arguments === "string"
          ? JSON.parse(call.function.arguments)
          : call.function.arguments;

      console.log("[Agent] Executing tool:", call.function.name, args);

      if (interactionTools.includes(call.function.name)) {
        agentState.status = "waiting_user";
        agentState.pendingInteraction = {
          type: call.function.name as any,
          question: args.question,
          options: args.options,
        };
        emit({
          type: "interaction",
          data: agentState.pendingInteraction,
        });

        const userResponse = await waitForUserInput();
        console.log("[Agent] User response:", userResponse);

        messagesForLLM.push(
          { role: "assistant" as const, content, tool_calls: toolCalls },
          { role: "user" as const, content: userResponse },
        );

        agentState.status = "thinking";
        agentState.pendingInteraction = null;

        continue;
      }

      const result = await executeOperation(call.function.name, args, ctx);
      console.log("[Agent] Tool result:", result);

      addMessage({
        role: "tool",
        tool_call_id: call.id,
        tool_name: call.function.name,
        content: JSON.stringify(result),
      });

      messagesForLLM.push(
        { role: "assistant" as const, content, tool_calls: toolCalls },
        {
          role: "user" as const,
          content: `[工具结果] ${call.function.name}: ${JSON.stringify(result)}`,
        },
      );
    }

    agentState.status = "thinking";
  }
}

function waitForUserInput(): Promise<string> {
  return new Promise((resolve) => {
    waitForUserInputPromise = { resolve };
  });
}

// 导出
export const designAgent = {
  state: agentState,

  isProcessing: computed(
    () => agentState.status === "thinking" || agentState.status === "executing",
  ),

  isWaitingForUser: computed(() => agentState.status === "waiting_user"),

  onEvent(listener: (event: AgentEvent) => void) {
    eventListeners.push(listener);
    return () => {
      const index = eventListeners.indexOf(listener);
      if (index > -1) eventListeners.splice(index, 1);
    };
  },

  async chat(userMessage: string): Promise<void> {
    if (agentState.status !== "idle") {
      console.warn("Agent is busy");
      return;
    }

    addMessage({ role: "user", content: userMessage });
    agentState.status = "thinking";
    agentState.error = null;

    try {
      await runAgentLoop();
    } catch (error: any) {
      console.error("Agent error:", error);
      agentState.error = error.message || "未知错误";
      addMessage({
        role: "assistant",
        content: `抱歉，出了点问题：${error.message}`,
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

  clearMessages() {
    agentState.messages.length = 0;
    agentState.error = null;
    agentState.pendingInteraction = null;
    agentState.status = "idle";
  },
};
