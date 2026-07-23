// 导出 Agent 实现
export { designAgent } from "../agent/simple";
export type { RunAgentLoopOptions } from "../agent/simple";
export * from "../agent/task-spec";

// 保留旧的类型导出（兼容）
export type {
  AgentMessage,
  AgentState,
  AgentInteraction,
  AgentConfig,
  AgentEvent,
} from "./types";
