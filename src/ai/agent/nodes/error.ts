import { AIMessage } from "@langchain/core/messages";
import { interrupt } from "@langchain/langgraph";
import type { AgentState } from "../state";

// ============ 错误处理节点 ============

export async function errorNode(state: AgentState): Promise<Partial<AgentState>> {
  console.log("[Agent] Error node", { error: state.error });

  const errorMessage = new AIMessage({
    content: `抱歉，处理过程中出现了错误：${state.error || "未知错误"}

请稍后重试，或者换个方式描述你的需求。`,
  });

  return {
    messages: [errorMessage],
    status: "done",
    currentNode: "end",
    error: null,
  };
}

// ============ 等待用户节点 ============

export async function waitUserNode(state: AgentState): Promise<Partial<AgentState>> {
  console.log("[Agent] Wait user node", { pendingInteraction: state.pendingInteraction });

  const userResponse = interrupt({
    type: "waiting_user",
    data: state.pendingInteraction,
  });

  console.log("[Agent] User response:", userResponse);

  const userMessage = new AIMessage({
    content: `[用户选择] ${userResponse}`,
  });

  return {
    messages: [userMessage],
    pendingInteraction: null,
    status: "thinking",
    currentNode: "think",
  };
}
