import { StateGraph, START, END } from "@langchain/langgraph";
import { AgentStateAnnotation } from "./state";
import {
  planNode,
  thinkNode,
  executeNode,
  verifyNode,
  evaluateNode,
  iterateNode,
  errorNode,
  waitUserNode,
  processUserResponseNode,
} from "./nodes";
import {
  routeAfterPlan,
  routeAfterThink,
  routeAfterExecute,
  routeAfterVerify,
  routeAfterEvaluate,
  routeAfterIterate,
  routeAfterWaitUser,
  routeAfterProcessUserResponse,
  routeAfterError,
} from "./edges/routing";

// ============ 创建 Agent 状态图 ============

export function createDesignAgentGraph() {
  const workflow = new StateGraph(AgentStateAnnotation)
    // 添加节点（避免与状态属性名冲突）
    .addNode("planStep", planNode)
    .addNode("thinkStep", thinkNode)
    .addNode("executeStep", executeNode)
    .addNode("verifyStep", verifyNode)
    .addNode("evaluateStep", evaluateNode)
    .addNode("iterateStep", iterateNode)
    .addNode("errorStep", errorNode)
    .addNode("waitUserStep", waitUserNode)
    .addNode("processUserStep", processUserResponseNode)

    // 定义边
    .addEdge(START, "planStep")

    // 条件路由
    .addConditionalEdges("planStep", routeAfterPlan, {
      think: "thinkStep",
    })
    .addConditionalEdges("thinkStep", routeAfterThink, {
      execute: "executeStep",
      error: "errorStep",
      [END]: END,
    })
    .addConditionalEdges("executeStep", routeAfterExecute, {
      verify: "verifyStep",
      wait_user: "waitUserStep",
    })
    .addConditionalEdges("verifyStep", routeAfterVerify, {
      evaluate: "evaluateStep",
    })
    .addConditionalEdges("evaluateStep", routeAfterEvaluate, {
      iterate: "iterateStep",
      [END]: END,
    })
    .addConditionalEdges("iterateStep", routeAfterIterate, {
      think: "thinkStep",
    })
    .addConditionalEdges("waitUserStep", routeAfterWaitUser, {
      process_user_response: "processUserStep",
    })
    .addConditionalEdges("processUserStep", routeAfterProcessUserResponse, {
      think: "thinkStep",
    })
    .addConditionalEdges("errorStep", routeAfterError, {
      [END]: END,
    });

  return workflow.compile();
}

// ============ 状态图可视化 ============

/*
状态图流程：

                    ┌─────────┐
                    │  START  │
                    └────┬────┘
                         │
                         ▼
                    ┌──────────┐
                    │ planStep │
                    └────┬─────┘
                         │
                         ▼
                    ┌──────────┐     ┌───────────┐
                    │thinkStep │────►│ errorStep │
                    └────┬─────┘     └─────┬─────┘
                         │                 │
                         ▼                 ▼
                    ┌──────────┐         END
                    │executeStep│
                    └────┬─────┘
                         │
              ┌──────────┴──────────┐
              │                     │
              ▼                     ▼
        ┌───────────┐        ┌───────────┐
        │verifyStep │        │waitUserStep│
        └─────┬─────┘        └─────┬─────┘
              │                    │
              ▼                    ▼
        ┌─────────────┐    ┌─────────────┐
        │evaluateStep │    │processUserStep│
        └──────┬──────┘    └───────┬──────┘
               │                   │
               ├──►END             │
               │                   │
               ▼                   │
        ┌─────────────┐            │
        │iterateStep  │            │
        └──────┬──────┘            │
               │                   │
               └─────────┬─────────┘
                         │
                         ▼
                    ┌──────────┐
                    │thinkStep │ (循环)
                    └──────────┘
*/
