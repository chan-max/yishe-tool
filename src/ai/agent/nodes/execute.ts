import { ToolMessage } from "@langchain/core/messages";
import type { AgentState, PlanStep } from "../state";
import {
  executeOperation,
  createDesignOperationContext,
} from "@/operations";
import { INTERACTION_TOOL_NAMES, resolveAIToolName } from "../../shared/tools";

// ============ 执行节点 ============

export async function executeNode(state: AgentState): Promise<Partial<AgentState>> {
  console.log("[Agent] Execute node", { toolCalls: state.toolCalls });

  const ctx = createDesignOperationContext();
  const newMessages: any[] = [];
  const toolResults: Record<string, any> = {};

  for (const call of state.toolCalls) {
    const args = typeof call.function.arguments === "string"
      ? JSON.parse(call.function.arguments)
      : call.function.arguments;
    const toolName = resolveAIToolName(call.function.name);

    // 检查是否是交互工具
    if (INTERACTION_TOOL_NAMES.includes(call.function.name)) {
      return {
        pendingInteraction: {
          type: call.function.name,
          question: args.question,
          options: args.options,
        },
        status: "waiting_user",
        currentNode: "wait_user",
      };
    }

    try {
      // 执行工具
      const result = await executeOperation(toolName, args, ctx);
      toolResults[toolName] = result;

      const toolMessage = new ToolMessage({
        content: JSON.stringify(result),
        tool_call_id: call.id,
        name: call.function.name,
      });
      newMessages.push(toolMessage);

      // 更新计划步骤状态
      if (state.plan) {
        const updatedSteps = [...state.plan.steps];
        const currentStep = updatedSteps[state.plan.currentStepIndex];
        if (currentStep) {
          currentStep.status = result.success ? "completed" : "failed";
          currentStep.result = result;
        }

        return {
          messages: newMessages,
          toolCalls: [],
          toolResults,
          plan: {
            ...state.plan,
            steps: updatedSteps,
            currentStepIndex: state.plan.currentStepIndex + 1,
          },
          status: "verifying",
          currentNode: "verify",
        };
      }

      return {
        messages: newMessages,
        toolCalls: [],
        toolResults,
        status: "verifying",
        currentNode: "verify",
        iteration: state.iteration + 1,
      };
    } catch (error: any) {
      console.error("[Agent] Execute error:", error);
      toolResults[toolName] = { success: false, error: error.message };

      const toolMessage = new ToolMessage({
        content: JSON.stringify({ success: false, error: error.message }),
        tool_call_id: call.id,
        name: call.function.name,
      });
      newMessages.push(toolMessage);

      // 更新计划步骤为失败
      if (state.plan) {
        const updatedSteps = [...state.plan.steps];
        const currentStep = updatedSteps[state.plan.currentStepIndex];
        if (currentStep) {
          currentStep.status = "failed";
          currentStep.error = error.message;
        }

        return {
          messages: newMessages,
          toolCalls: [],
          toolResults,
          plan: {
            ...state.plan,
            steps: updatedSteps,
          },
          status: "verifying",
          currentNode: "verify",
        };
      }

      return {
        messages: newMessages,
        toolCalls: [],
        toolResults,
        status: "verifying",
        currentNode: "verify",
        iteration: state.iteration + 1,
      };
    }
  }

  // 没有工具调用
  return {
    status: "verifying",
    currentNode: "verify",
    iteration: state.iteration + 1,
  };
}
