import type { OperationResult } from "@/operations";

export interface AgentMessage {
  id: string;
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  timestamp: number;
  tool_calls?: AgentToolCall[];
  tool_call_id?: string;
  tool_name?: string;
  loading?: boolean;
  error?: string;
}

export interface AgentToolCall {
  id: string;
  type: "function";
  function: {
    name: string;
    arguments: string | Record<string, any>;
  };
}

export interface AgentToolResult {
  tool_call_id: string;
  tool_name: string;
  result: OperationResult;
}

export interface AgentInteraction {
  type: "ask_choice" | "request_feedback" | "confirm_action";
  question: string;
  options?: string[];
}

export interface AgentState {
  status: "idle" | "thinking" | "executing" | "waiting_user";
  messages: AgentMessage[];
  pendingInteraction: AgentInteraction | null;
  error: string | null;
}

export interface AgentConfig {
  model?: string;
  keyId?: number | null;
  temperature?: number;
  maxIterations?: number;
}

export interface AgentEvent {
  type:
    | "message"
    | "tool_call"
    | "tool_result"
    | "interaction"
    | "error"
    | "done";
  data: any;
}
