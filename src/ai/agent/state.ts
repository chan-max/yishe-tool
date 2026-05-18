import { Annotation, messagesStateReducer } from "@langchain/langgraph";
import { BaseMessage } from "@langchain/core/messages";

// ============ 执行计划 ============

export interface PlanStep {
  id: string;
  action: string;
  description: string;
  tool?: string;
  args?: Record<string, any>;
  status: "pending" | "executing" | "completed" | "failed";
  result?: any;
  error?: string;
}

export interface ExecutionPlan {
  goal: string;
  steps: PlanStep[];
  currentStepIndex: number;
}

// ============ 验证结果 ============

export interface VerifyResult {
  passed: boolean;
  checks: {
    name: string;
    passed: boolean;
    message: string;
  }[];
  summary: string;
}

// ============ 评估结果 ============

export interface EvaluateResult {
  score: number; // 1-10
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  shouldIterate: boolean;
  iterationFocus?: string;
}

// ============ 测试结果 ============

export interface TestResult {
  passed: boolean;
  tests: {
    name: string;
    passed: boolean;
    duration: number;
    error?: string;
  }[];
  summary: string;
}

// ============ Agent 状态 ============

export const AgentStateAnnotation = Annotation.Root({
  // 消息历史
  messages: Annotation<BaseMessage[]>({
    reducer: messagesStateReducer,
    default: () => [],
  }),

  // 用户输入
  userInput: Annotation<string>({
    reducer: (prev, next) => next,
    default: () => "",
  }),

  // 执行计划
  plan: Annotation<ExecutionPlan | null>({
    reducer: (prev, next) => next,
    default: () => null,
  }),

  // 工具调用
  toolCalls: Annotation<any[]>({
    reducer: (prev, next) => next,
    default: () => [],
  }),

  // 工具执行结果
  toolResults: Annotation<Record<string, any>>({
    reducer: (prev, next) => ({ ...prev, ...next }),
    default: () => ({}),
  }),

  // 验证结果
  verifyResult: Annotation<VerifyResult | null>({
    reducer: (prev, next) => next,
    default: () => null,
  }),

  // 评估结果
  evaluateResult: Annotation<EvaluateResult | null>({
    reducer: (prev, next) => next,
    default: () => null,
  }),

  // 测试结果
  testResult: Annotation<TestResult | null>({
    reducer: (prev, next) => next,
    default: () => null,
  }),

  // 交互请求
  pendingInteraction: Annotation<{
    type: string;
    question: string;
    options?: string[];
  } | null>({
    reducer: (prev, next) => next,
    default: () => null,
  }),

  // 用户响应
  userResponse: Annotation<string | null>({
    reducer: (prev, next) => next,
    default: () => null,
  }),

  // 当前节点
  currentNode: Annotation<string>({
    reducer: (prev, next) => next,
    default: () => "start",
  }),

  // 状态
  status: Annotation<"idle" | "planning" | "thinking" | "executing" | "verifying" | "evaluating" | "testing" | "waiting_user" | "iterating" | "done" | "error">({
    reducer: (prev, next) => next,
    default: () => "idle",
  }),

  // 错误信息
  error: Annotation<string | null>({
    reducer: (prev, next) => next,
    default: () => null,
  }),

  // 迭代次数
  iteration: Annotation<number>({
    reducer: (prev, next) => next,
    default: () => 0,
  }),

  // 最大迭代次数
  maxIterations: Annotation<number>({
    reducer: (prev, next) => next,
    default: () => 5,
  }),
});

export type AgentState = typeof AgentStateAnnotation.State;
