import { AIMessage } from "@langchain/core/messages";
import type { AgentState } from "../state";
import { buildSystemPrompt } from "../../prompts/system";
import { directChat } from "../../direct-client";
import { getOperationTools } from "@/operations";

// ============ 思考节点 ============

export async function thinkNode(state: AgentState): Promise<Partial<AgentState>> {
  console.log("[Agent] Think node", { iteration: state.iteration });

  const tools = getOperationTools();
  const allTools = [
    ...tools.map((t) => ({
      type: "function" as const,
      function: {
        name: t.name,
        description: t.description,
        parameters: t.input_schema,
      },
    })),
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

  // 构建消息列表
  const messagesForLLM = [
    { role: "system" as const, content: buildSystemPrompt() },
    ...state.messages.map((m) => ({
      role: (m._getType() === "human" ? "user" :
            m._getType() === "ai" ? "assistant" : "user") as "user" | "assistant",
      content: m.content as string,
      ...((m as any).tool_calls ? { tool_calls: (m as any).tool_calls } : {}),
    })),
  ];

  // 如果有计划，添加计划上下文
  if (state.plan) {
    const currentStep = state.plan.steps[state.plan.currentStepIndex];
    if (currentStep) {
      messagesForLLM.push({
        role: "system" as const,
        content: `当前执行计划：
目标：${state.plan.goal}
当前步骤：${currentStep.action}
步骤说明：${currentStep.description}
进度：${state.plan.currentStepIndex + 1}/${state.plan.steps.length}`,
      });
    }
  }

  try {
    const response = await directChat({
      messages: messagesForLLM,
      tools: allTools,
    });

    // 解析响应
    const message = parseResponse(response);

    if (!message) {
      return {
        error: "无法解析 LLM 响应",
        status: "error",
        currentNode: "error",
      };
    }

    const aiMessage = new AIMessage({
      content: message.content || "",
      tool_calls: message.tool_calls || [],
    });

    return {
      messages: [aiMessage],
      toolCalls: message.tool_calls || [],
      status: "executing",
      currentNode: "execute",
    };
  } catch (error: any) {
    console.error("[Agent] Think error:", error);
    return {
      error: error.message || "LLM 调用失败",
      status: "error",
      currentNode: "error",
    };
  }
}

// ============ 辅助函数 ============

function parseResponse(response: any): any {
  const res = response as any;

  if (res?.choices?.[0]?.message) {
    return res.choices[0].message;
  }
  if (res?.data?.choices?.[0]?.message) {
    return res.data.choices[0].message;
  }
  if (typeof res?.data === "string") {
    return { content: res.data };
  }
  if (res?.content || res?.tool_calls) {
    return res;
  }
  return null;
}
