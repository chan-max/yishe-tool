import { END } from "@langchain/langgraph";
import type { AgentState } from "../state";

// ============ 条件路由 ============

export function routeAfterPlan(state: AgentState): string {
  return "think";
}

export function routeAfterThink(state: AgentState): string {
  if (state.error) {
    return "error";
  }

  if (state.toolCalls.length > 0) {
    return "execute";
  }

  const lastMessage = state.messages[state.messages.length - 1];
  if (lastMessage && lastMessage._getType() === "ai") {
    const aiMsg = lastMessage as any;
    if (aiMsg.tool_calls && aiMsg.tool_calls.length > 0) {
      return "execute";
    }
  }

  return END;
}

export function routeAfterExecute(state: AgentState): string {
  if (state.status === "waiting_user") {
    return "wait_user";
  }
  return "verify";
}

export function routeAfterVerify(_state: AgentState): string {
  return "evaluate";
}

export function routeAfterEvaluate(state: AgentState): string {
  if (state.evaluateResult?.shouldIterate) {
    return "iterate";
  }
  return END;
}

export function routeAfterIterate(_state: AgentState): string {
  return "think";
}
