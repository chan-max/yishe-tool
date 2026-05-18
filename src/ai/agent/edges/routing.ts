import { END } from "@langchain/langgraph";
import type { AgentState } from "../state";

// ============ 条件路由 ============

/**
 * 从 plan 节点出发的路由
 */
export function routeAfterPlan(state: AgentState): string {
  return "think";
}

/**
 * 从 think 节点出发的路由
 */
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

/**
 * 从 execute 节点出发的路由
 */
export function routeAfterExecute(state: AgentState): string {
  if (state.status === "waiting_user") {
    return "wait_user";
  }
  return "verify";
}

/**
 * 从 verify 节点出发的路由
 */
export function routeAfterVerify(state: AgentState): string {
  return "evaluate";
}

/**
 * 从 evaluate 节点出发的路由
 */
export function routeAfterEvaluate(state: AgentState): string {
  if (state.evaluateResult?.shouldIterate) {
    return "iterate";
  }
  return END;
}

/**
 * 从 iterate 节点出发的路由
 */
export function routeAfterIterate(state: AgentState): string {
  return "think";
}

/**
 * 从 wait_user 节点出发的路由
 */
export function routeAfterWaitUser(state: AgentState): string {
  return "process_user_response";
}

/**
 * 从 process_user_response 节点出发的路由
 */
export function routeAfterProcessUserResponse(state: AgentState): string {
  return "think";
}

/**
 * 从 error 节点出发的路由
 */
export function routeAfterError(state: AgentState): string {
  return END;
}
