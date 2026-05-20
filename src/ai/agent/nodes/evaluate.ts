import type { AgentState, EvaluateResult } from "../state";
import { canvasStickerOptions } from "@/components/design/layout/canvas";
import { directChat } from "../../direct-client";
import { extractContent, extractJSON } from "../../shared/response-parser";

// ============ 评估节点 ============

export async function evaluateNode(state: AgentState): Promise<Partial<AgentState>> {
  console.log("[Agent] Evaluate node");

  // 如果验证失败，跳过评估
  if (state.verifyResult && !state.verifyResult.passed) {
    return {
      evaluateResult: {
        score: 0,
        strengths: [],
        weaknesses: state.verifyResult.checks
          .filter((c) => !c.passed)
          .map((c) => c.message),
        suggestions: ["修复验证失败的项目"],
        shouldIterate: true,
        iterationFocus: "修复错误",
      },
      status: "iterating",
      currentNode: "iterate",
    };
  }

  // 获取画布状态
  const canvasState = getCanvasSummary();

  // 如果画布没有元素，跳过评估
  if (canvasState.elementCount === 0) {
    return {
      evaluateResult: {
        score: 5,
        strengths: [],
        weaknesses: [],
        suggestions: [],
        shouldIterate: false,
      },
      status: "done",
      currentNode: "end",
    };
  }

  try {
    // 使用 AI 评估设计
    const response = await directChat({
      messages: [
        {
          role: "system",
          content: `你是一个专业的设计评估专家。评估设计作品的质量，给出分数和建议。
只输出 JSON，不要其他内容。`,
        },
        {
          role: "user",
          content: `评估以下设计：

${JSON.stringify(canvasState, null, 2)}

评估维度：
1. 配色方案 (1-10)
2. 排版层级 (1-10)
3. 构图布局 (1-10)
4. 视觉平衡 (1-10)
5. 整体美感 (1-10)

输出格式：
{
  "score": 综合分数,
  "strengths": ["优点"],
  "weaknesses": ["不足"],
  "suggestions": ["建议"],
  "shouldIterate": true/false,
  "iterationFocus": "优化重点"
}`,
        },
      ],
      temperature: 0.3,
    });

    const content = extractContent(response);
    const evaluation = extractJSON(content);

    if (!evaluation) {
      return {
        evaluateResult: {
          score: 5,
          strengths: [],
          weaknesses: [],
          suggestions: [],
          shouldIterate: false,
        },
        status: "done",
        currentNode: "end",
      };
    }

    const evaluateResult: EvaluateResult = {
      score: evaluation.score || 5,
      strengths: evaluation.strengths || [],
      weaknesses: evaluation.weaknesses || [],
      suggestions: evaluation.suggestions || [],
      shouldIterate: evaluation.shouldIterate || false,
      iterationFocus: evaluation.iterationFocus,
    };

    console.log("[Agent] Evaluate result:", evaluateResult);

    return {
      evaluateResult,
      status: evaluateResult.shouldIterate ? "iterating" : "done",
      currentNode: evaluateResult.shouldIterate ? "iterate" : "end",
    };
  } catch (error: any) {
    console.error("[Agent] Evaluate error:", error);
    return {
      evaluateResult: {
        score: 5,
        strengths: [],
        weaknesses: [],
        suggestions: [],
        shouldIterate: false,
      },
      status: "done",
      currentNode: "end",
    };
  }
}

function getCanvasSummary() {
  const children = canvasStickerOptions.value.children;
  const mainCanvas = children[0];
  return {
    width: mainCanvas?.width || 500,
    height: mainCanvas?.height || 500,
    elementCount: children.length - 1,
    elements: children.slice(1).map((c: any) => ({
      id: c.id,
      type: c.type,
      content: c.content || c.text || "",
    })),
  };
}
