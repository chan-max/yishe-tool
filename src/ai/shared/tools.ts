import { getOperationTools } from "@/operations";

export const INTERACTION_TOOL_NAMES = ["ask_choice", "request_feedback"] as const;

const askChoiceDef = {
  type: "function" as const,
  function: {
    name: "ask_choice",
    description: "向用户提问，让用户做选择。当有多种设计方向、需要用户决策时使用。",
    parameters: {
      type: "object" as const,
      properties: {
        question: { type: "string" as const, description: "要问用户的问题" },
        options: {
          type: "array" as const,
          items: { type: "string" as const },
          description: "选项列表（可选）",
        },
      },
      required: ["question"],
    },
  },
};

const requestFeedbackDef = {
  type: "function" as const,
  function: {
    name: "request_feedback",
    description: "展示当前效果，请求用户反馈。当完成一个步骤后，询问用户是否满意。",
    parameters: {
      type: "object" as const,
      properties: {
        question: { type: "string" as const, description: "想问用户什么" },
      },
      required: ["question"],
    },
  },
};

export const INTERACTION_TOOL_DEFS = [askChoiceDef, requestFeedbackDef];

export function buildAITools(options?: {
  includeResources?: boolean;
  resourceTools?: any[];
}): any[] {
  const opTools = getOperationTools().map((t) => ({
    type: "function" as const,
    function: {
      name: t.name,
      description: t.description,
      parameters: t.input_schema,
    },
  }));

  const tools = [...opTools];

  if (options?.includeResources && options?.resourceTools) {
    tools.push(...options.resourceTools);
  }

  tools.push(...INTERACTION_TOOL_DEFS);

  return tools;
}
