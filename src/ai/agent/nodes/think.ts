import { AIMessage } from "@langchain/core/messages";
import type { AgentState } from "../state";
import { buildSystemPrompt } from "../../prompts/system";
import { directChat } from "../../direct-client";
import { buildAITools } from "../../shared/tools";
import { parseChatResponse } from "../../shared/response-parser";

// ============ 思考节点 ============

export async function thinkNode(state: AgentState): Promise<Partial<AgentState>> {
  console.log("[Agent] Think node", { iteration: state.iteration });

  const allTools = buildAITools();

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
    const message = parseChatResponse(response);

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
