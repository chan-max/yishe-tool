import { aiChat } from "@/ai/api";
import { DESIGN_TOOL_FEATURE_CODES } from "@/ai/feature-codes";

export interface AiRoundTextResult {
  text: string;
  raw: string;
  usage?: any;
}

const SYSTEM_PROMPT = `你是创意文字生成助手。用户会描述想要的文字风格或主题，你只需要输出适合环形排列展示的短文字内容。

规则：
1. 只输出文字内容，不要解释，不要 markdown
2. 文字要简短有力，适合环形排列展示，通常 4-20 个字为宜
3. 可以是：座右铭、品牌标语、节日祝福、个性签名、图案装饰文字等
4. 如果用户要求多行，用换行符分隔每行
5. 保持文字的韵律感和视觉美感
6. 每行文字长度尽量相近，让环形排列更美观`;

function extractText(raw: string): string {
  // Remove code fences if present
  const block = raw.match(/```[\w]*\s*\r?\n([\s\S]*?)```/);
  const cleaned = (block ? block[1] : raw).trim();

  // Remove surrounding quotes if present
  if (
    (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
    (cleaned.startsWith("'") && cleaned.endsWith("'"))
  ) {
    return cleaned.slice(1, -1);
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

export async function generateRoundText(
  prompt: string,
  currentText?: string,
): Promise<AiRoundTextResult> {
  const currentTextText = currentText
    ? `\n\n当前已有文字，可参考或替换：\n${currentText}`
    : "";

  const response = await aiChat({
    featureCode: DESIGN_TOOL_FEATURE_CODES.chat,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: `用户需求：${prompt}${currentTextText}` },
    ],
    temperature: 0.7,
    maxTokens: 500,
  });

  const { raw, usage } = getResponseContent(response);
  if (!raw) {
    throw new Error("AI 未返回内容");
  }

  const text = extractText(raw);
  if (!text) {
    throw new Error("AI 未返回有效文字");
  }

  return { text, raw, usage };
}

export const aiRoundTextService = {
  generateRoundText,
};
