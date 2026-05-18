import { AIMessage } from "@langchain/core/messages";
import type { AgentState } from "../state";

// ============ 错误处理节点 ============

export async function errorNode(state: AgentState): Promise<Partial<AgentState>> {
  console.log("[Agent] Error node", { error: state.error });

  // 创建错误消息
  const errorMessage = new AIMessage({
    content: `抱歉，处理过程中出现了错误：${state.error || "未知错误"}

请稍后重试，或者换个方式描述你的需求。`,
  });

  return {
    messages: [errorMessage],
    status: "idle",
    currentNode: "end",
    error: null,
  };
}

// ============ 等待用户节点 ============

export async function waitUserNode(state: AgentState): Promise<Partial<AgentState>> {
  console.log("[Agent] Wait user node");
  return {
    status: "waiting_user",
    currentNode: "wait_user",
  };
}

// ============ 处理用户响应节点 ============

export async function processUserResponseNode(state: AgentState): Promise<Partial<AgentState>> {
  console.log("[Agent] Process user response", { userResponse: state.userResponse });

  if (!state.userResponse) {
    return { error: "未收到用户响应" };
  }

  const userMessage = new AIMessage({
    content: `[用户选择] ${state.userResponse}`,
  });

  return {
    messages: [userMessage],
    pendingInteraction: null,
    userResponse: null,
    status: "thinking",
    currentNode: "think",
  };
}
