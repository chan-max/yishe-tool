import { HumanMessage } from "@langchain/core/messages";
import type { AgentState } from "../state";

// ============ 迭代节点 ============

export async function iterateNode(state: AgentState): Promise<Partial<AgentState>> {
  console.log("[Agent] Iterate node", {
    iteration: state.iteration,
    maxIterations: state.maxIterations,
    evaluateResult: state.evaluateResult,
  });

  // 检查是否超过最大迭代次数
  if (state.iteration >= state.maxIterations) {
    console.log("[Agent] Max iterations reached, stopping");
    return {
      status: "done",
      currentNode: "end",
    };
  }

  // 检查评估结果
  if (!state.evaluateResult || !state.evaluateResult.shouldIterate) {
    console.log("[Agent] No need to iterate");
    return {
      status: "done",
      currentNode: "end",
    };
  }

  // 构建迭代提示
  const iterationPrompt = buildIterationPrompt(state);

  // 添加迭代消息
  const iterationMessage = new HumanMessage({ content: iterationPrompt });

  console.log("[Agent] Iterating with focus:", state.evaluateResult.iterationFocus);

  return {
    messages: [iterationMessage],
    plan: null, // 清空计划，重新规划
    verifyResult: null,
    evaluateResult: null,
    status: "thinking",
    currentNode: "think",
    iteration: state.iteration + 1,
  };
}

// ============ 辅助函数 ============

function buildIterationPrompt(state: AgentState): string {
  const { evaluateResult } = state;

  if (!evaluateResult) {
    return "继续优化设计";
  }

  let prompt = "根据评估结果优化设计：\n\n";

  if (evaluateResult.strengths.length > 0) {
    prompt += "## 优点（保持）\n";
    evaluateResult.strengths.forEach((s) => {
      prompt += `- ${s}\n`;
    });
    prompt += "\n";
  }

  if (evaluateResult.weaknesses.length > 0) {
    prompt += "## 不足（改进）\n";
    evaluateResult.weaknesses.forEach((w) => {
      prompt += `- ${w}\n`;
    });
    prompt += "\n";
  }

  if (evaluateResult.suggestions.length > 0) {
    prompt += "## 建议\n";
    evaluateResult.suggestions.forEach((s) => {
      prompt += `- ${s}\n`;
    });
    prompt += "\n";
  }

  if (evaluateResult.iterationFocus) {
    prompt += `## 优化重点\n${evaluateResult.iterationFocus}\n`;
  }

  prompt += `\n当前分数：${evaluateResult.score}/10\n`;
  prompt += "请针对性地进行优化。";

  return prompt;
}
