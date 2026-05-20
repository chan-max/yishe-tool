import { StateGraph, START, END, MemorySaver, Command } from "@langchain/langgraph";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { reactive, computed } from "vue";
import type { AgentState } from "./state";
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
} from "./nodes";
import {
  routeAfterPlan,
  routeAfterThink,
  routeAfterExecute,
  routeAfterVerify,
  routeAfterEvaluate,
  routeAfterIterate,
} from "./edges/routing";

// ============ 构建状态图 ============

function buildGraph() {
  return new StateGraph(AgentStateAnnotation)
    .addNode("plan", planNode)
    .addNode("think", thinkNode)
    .addNode("execute", executeNode)
    .addNode("verify", verifyNode)
    .addNode("evaluate", evaluateNode)
    .addNode("iterate", iterateNode)
    .addNode("error", errorNode)
    .addNode("wait_user", waitUserNode)

    .addEdge(START, "plan")

    .addConditionalEdges("plan", routeAfterPlan, {
      think: "think",
    })
    .addConditionalEdges("think", routeAfterThink, {
      execute: "execute",
      error: "error",
      [END]: END,
    })
    .addConditionalEdges("execute", routeAfterExecute, {
      verify: "verify",
      wait_user: "wait_user",
    })
    .addConditionalEdges("verify", routeAfterVerify, {
      evaluate: "evaluate",
    })
    .addConditionalEdges("evaluate", routeAfterEvaluate, {
      iterate: "iterate",
      [END]: END,
    })
    .addConditionalEdges("iterate", routeAfterIterate, {
      think: "think",
    })
    .addConditionalEdges("wait_user", afterWaitUser, {
      think: "think",
    })
    .addConditionalEdges("error", afterError, {
      [END]: END,
    })

    .compile({ checkpointer: new MemorySaver() });
}

function afterWaitUser(_state: AgentState): string {
  return "think";
}

function afterError(_state: AgentState): string {
  return END;
}

/*
状态图流程：

                    ┌─────────┐
                    │  START  │
                    └────┬────┘
                         │
                         ▼
                    ┌──────────┐
                    │   plan   │
                    └────┬─────┘
                         │
                         ▼
                    ┌──────────┐     ┌───────────┐
                    │  think   │────►│   error   │
                    └────┬─────┘     └─────┬─────┘
                         │                 │
                         ▼                 ▼
                    ┌──────────┐          END
                    │ execute  │
                    └────┬─────┘
                         │
              ┌──────────┴──────────┐
              │                     │
              ▼                     ▼
        ┌───────────┐        ┌───────────┐
        │  verify   │        │ wait_user │ (interrupt → resume → think)
        └─────┬─────┘        └───────────┘
              │
              ▼
        ┌─────────────┐
        │  evaluate   │
        └──────┬──────┘
               ├──► END
               │
               ▼
        ┌─────────────┐
        │  iterate    │
        └──────┬──────┘
               │
               ▼
        ┌──────────┐
        │  think   │ (循环)
        └──────────┘
*/

// ============ Agent 包装器 ============

interface AgentMessage {
  id: string;
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  timestamp: number;
  tool_calls?: any[];
  tool_call_id?: string;
  tool_name?: string;
}

interface AgentInteraction {
  type: string;
  question: string;
  options?: string[];
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function stateToMessages(state: AgentState): AgentMessage[] {
  const msgs: AgentMessage[] = [];

  for (const m of state.messages) {
    const type = m._getType();
    if (type === "human") {
      msgs.push({
        id: generateId(),
        role: "user",
        content: typeof m.content === "string" ? m.content : JSON.stringify(m.content),
        timestamp: Date.now(),
      });
    } else if (type === "ai") {
      const aiMsg = m as AIMessage;
      msgs.push({
        id: generateId(),
        role: "assistant",
        content: typeof aiMsg.content === "string" ? aiMsg.content : "",
        timestamp: Date.now(),
        tool_calls: (aiMsg as any).tool_calls,
      });
    } else if (type === "tool") {
      msgs.push({
        id: generateId(),
        role: "tool",
        content: typeof m.content === "string" ? m.content : JSON.stringify(m.content),
        timestamp: Date.now(),
        tool_call_id: (m as any).tool_call_id,
        tool_name: (m as any).name,
      });
    }
  }

  return msgs;
}

export function createGraphAgent() {
  const graph = buildGraph();
  const threadId = `thread-${Date.now()}`;

  let waitForUserInputPromise: { resolve: (value: string) => void } | null = null;
  const eventListeners: ((event: any) => void)[] = [];

  const agentState = reactive({
    status: "idle" as "idle" | "thinking" | "executing" | "waiting_user" | "done",
    messages: [] as AgentMessage[],
    pendingInteraction: null as AgentInteraction | null,
    error: null as string | null,
  });

  function emit(event: any) {
    eventListeners.forEach((listener) => listener(event));
  }

  function waitForUserInput(): Promise<string> {
    return new Promise((resolve) => {
      waitForUserInputPromise = { resolve };
    });
  }

  async function run(userMessage: string) {
    agentState.status = "thinking";
    agentState.error = null;

    const initialState: Partial<AgentState> = {
      messages: [new HumanMessage({ content: userMessage })],
      userInput: userMessage,
      iteration: 0,
    };

    const config = { configurable: { thread_id: threadId } };

    try {
      let result = await graph.invoke(initialState, config);

      // 处理 interrupt（用户交互）
      while ((result as any).__interrupt__) {
        const interruptData = (result as any).__interrupt__;
        const firstInterrupt = Array.isArray(interruptData) ? interruptData[0] : interruptData;
        const value = firstInterrupt?.value ?? firstInterrupt;

        const interaction: AgentInteraction = {
          type: "ask_choice",
          question: value?.data?.question || value?.question || "请选择",
          options: value?.data?.options || value?.options,
        };

        agentState.status = "waiting_user";
        agentState.pendingInteraction = interaction;
        emit({ type: "interaction", data: interaction });

        const userResponse = await waitForUserInput();
        console.log("[GraphAgent] User response:", userResponse);

        agentState.status = "thinking";
        agentState.pendingInteraction = null;

        result = await graph.invoke(
          new Command({ resume: userResponse }),
          config
        );
      }

      // 提取消息到 UI 状态
      const extractedState = result as AgentState;
      agentState.messages = stateToMessages(extractedState);

      if (extractedState.error) {
        agentState.error = extractedState.error;
      }

      agentState.status = "idle";
      emit({ type: "done", data: null });
    } catch (error: any) {
      console.error("[GraphAgent] Error:", error);
      agentState.error = error.message || "未知错误";
      agentState.status = "idle";
      emit({ type: "error", data: error.message });
    }
  }

  return {
    state: agentState,

    isProcessing: computed(
      () => agentState.status === "thinking" || agentState.status === "executing"
    ),

    isWaitingForUser: computed(() => agentState.status === "waiting_user"),

    onEvent(listener: (event: any) => void) {
      eventListeners.push(listener);
      return () => {
        const index = eventListeners.indexOf(listener);
        if (index > -1) eventListeners.splice(index, 1);
      };
    },

    async chat(userMessage: string): Promise<void> {
      if (agentState.status !== "idle") {
        console.warn("[GraphAgent] Agent is busy, status:", agentState.status);
        return;
      }
      await run(userMessage);
    },

    submitUserResponse(response: string) {
      if (waitForUserInputPromise) {
        waitForUserInputPromise.resolve(response);
        waitForUserInputPromise = null;
      }
    },

    clearMessages() {
      agentState.messages.length = 0;
      agentState.error = null;
      agentState.pendingInteraction = null;
      agentState.status = "idle";
    },
  };
}

export { buildGraph };
