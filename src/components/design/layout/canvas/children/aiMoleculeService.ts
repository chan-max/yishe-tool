import { aiChat } from "@/ai/api";
import { DESIGN_TOOL_FEATURE_CODES } from "@/ai/feature-codes";

export interface AiMoleculeResult {
  smiles: string;
  raw: string;
  usage?: any;
}

const SYSTEM_PROMPT = `你是分子结构 SMILES 生成助手。用户会用自然语言描述一个分子或化合物，你只需要输出对应的 SMILES 字符串。

规则：
1. 只输出 SMILES 字符串，不要解释，不要 markdown，不要代码围栏
2. 输出 canonical SMILES 或通用公认的标准 SMILES
3. 如果用户描述的是常见化合物（如阿司匹林、苯、水、乙醇等），直接输出其标准 SMILES
4. 如果用户直接给出了 SMILES，原样返回
5. 不确定时输出最常见、最标准的 SMILES 形式
6. 每次只输出一个 SMILES 字符串`;

function extractSmiles(text: string): string {
  // Remove code fences if present
  const block = text.match(/```(?:[\w#+.-]+)?\s*\r?\n([\s\S]*?)```/);
  const cleaned = (block ? block[1] : text).trim();

  // Take the first non-empty line that looks like a SMILES
  const lines = cleaned
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  for (const line of lines) {
    // SMILES typically contain C, N, O, S, P, etc. and don't contain spaces (unless it's a complex SMILES)
    if (line && !line.startsWith("#") && !line.startsWith("//")) {
      return line;
    }
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

export async function generateMoleculeSmiles(
  prompt: string,
  currentSource?: string,
): Promise<AiMoleculeResult> {
  const currentSourceText = currentSource
    ? `\n\n当前已有 SMILES，可参考或替换：\n${currentSource}`
    : "";

  const response = await aiChat({
    featureCode: DESIGN_TOOL_FEATURE_CODES.chat,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: `用户需求：${prompt}${currentSourceText}` },
    ],
    temperature: 0.2,
    maxTokens: 500,
  });

  const { raw, usage } = getResponseContent(response);
  if (!raw) {
    throw new Error("AI 未返回内容");
  }

  const smiles = extractSmiles(raw);
  if (!smiles) {
    throw new Error("AI 未返回有效的 SMILES");
  }

  return { smiles, raw, usage };
}

export const aiMoleculeService = {
  generateMoleculeSmiles,
};
