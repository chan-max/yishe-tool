import { HumanMessage, AIMessage } from "@langchain/core/messages";
import type { AgentState } from "../state";
import { buildPlanPrompt } from "../../prompts/system";
import { directChat } from "../../direct-client";

// ============ 规划节点 ============

export async function planNode(state: AgentState): Promise<Partial<AgentState>> {
  console.log("[Agent] Plan node", { userInput: state.userInput });

  try {
    const response = await directChat({
      messages: [
        { role: "system", content: "你是一个任务规划专家。根据用户需求，制定详细的执行计划。只输出 JSON，不要其他内容。" },
        { role: "user", content: buildPlanPrompt(state.userInput) },
      ],
      temperature: 0.2,
    });

    // 解析响应
    const content = extractContent(response);
    const plan = extractJSON(content);

    if (!plan || !plan.steps) {
      // 如果解析失败，创建简单计划
      return {
        plan: {
          goal: state.userInput,
          steps: [
            {
              id: "step_1",
              action: "执行用户请求",
              description: state.userInput,
              status: "pending",
            },
          ],
          currentStepIndex: 0,
        },
        status: "thinking",
        currentNode: "think",
      };
    }

    // 标记所有步骤为待执行
    plan.steps = plan.steps.map((step: any, index: number) => ({
      ...step,
      id: step.id || `step_${index + 1}`,
      status: "pending",
    }));

    return {
      plan,
      status: "thinking",
      currentNode: "think",
    };
  } catch (error: any) {
    console.error("[Agent] Plan error:", error);
    // 降级到简单模式
    return {
      plan: {
        goal: state.userInput,
        steps: [
          {
            id: "step_1",
            action: "执行用户请求",
            description: state.userInput,
            status: "pending",
          },
        ],
        currentStepIndex: 0,
      },
      status: "thinking",
      currentNode: "think",
    };
  }
}

// ============ 辅助函数 ============

function extractContent(response: any): string {
  const res = response as any;
  if (res?.choices?.[0]?.message?.content) {
    return res.choices[0].message.content;
  }
  if (res?.data?.choices?.[0]?.message?.content) {
    return res.data.choices[0].message.content;
  }
  if (typeof res?.data === "string") {
    return res.data;
  }
  if (res?.content) {
    return res.content;
  }
  return "";
}

function extractJSON(text: string): any {
  // 尝试提取 JSON
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch {
      return null;
    }
  }
  return null;
}
