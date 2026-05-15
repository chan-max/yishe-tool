import { aiChat } from "@/ai/api";
import { DESIGN_TOOL_FEATURE_CODES } from "@/ai/feature-codes";

export interface AiD3Result {
  code: string;
  raw: string;
  usage?: any;
}

const SYSTEM_PROMPT = `你是 D3.js 数据可视化代码生成助手。用户会用自然语言描述想要的图表，你需要输出完整的 D3.js 代码。

规则：
1. 只输出可执行的 JavaScript 代码，不要解释，不要 markdown，不要代码围栏
2. 代码中可用变量：d3 (D3.js 库), container (DOM 容器元素), width (容器宽度), height (容器高度)
3. 使用 d3.select(container) 开始操作
4. 代码应该创建 SVG 元素并绘制图表
5. 使用现代 D3.js v7 语法
6. 代码应该完整可运行，不要省略
7. 每次只输出一个代码块`;

function extractCode(text: string): string {
  // Remove code fences if present
  const block = text.match(/```(?:javascript|js)?\s*\r?\n([\s\S]*?)```/);
  const cleaned = (block ? block[1] : text).trim();

  // If the code looks like valid JS (contains d3 or function), return it
  if (cleaned.includes("d3") || cleaned.includes("function") || cleaned.includes("const") || cleaned.includes("let")) {
    return cleaned;
  }

  return cleaned;
}

function getResponseContent(response: any): { raw: string; usage?: any } {
  const data = response?.data ?? response;
  if (typeof data === "string") {
    return { raw: data };
  }

  const choice = data?.choices?.[0];
  const content = choice?.message?.content ?? choice?.text ?? "";
  return {
    raw: typeof content === "string" ? content : JSON.stringify(content),
    usage: data?.usage,
  };
}

export async function generateD3Code(
  prompt: string,
  currentCode?: string,
): Promise<AiD3Result> {
  const currentCodeText = currentCode
    ? `\n\n当前已有代码，可参考或替换：\n\`\`\`javascript\n${currentCode}\n\`\`\``
    : "";

  const response = await aiChat({
    featureCode: DESIGN_TOOL_FEATURE_CODES.chat,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: `用户需求：${prompt}${currentCodeText}` },
    ],
    temperature: 0.3,
    maxTokens: 2000,
  });

  const { raw, usage } = getResponseContent(response);
  if (!raw) {
    throw new Error("AI 未返回内容");
  }

  const code = extractCode(raw);
  if (!code) {
    throw new Error("AI 未返回有效的代码");
  }

  return { code, raw, usage };
}

export const aiD3Service = {
  generateD3Code,
};
