import { aiChat } from "@/ai/api";
import { DESIGN_TOOL_FEATURE_CODES } from "@/ai/feature-codes";

export interface AiThreeMoleculeResult {
  pdbId: string;
  data: string;
  format: string;
  raw: string;
  usage?: any;
}

const SYSTEM_PROMPT = `你是 3D 分子结构助手。用户会用自然语言描述一个分子或化合物，你需要提供对应的 3D 分子数据。

规则：
1. 如果用户描述的是常见蛋白质或核酸，提供其 PDB ID（如 1BNA、4HHB、1CRN 等）
2. 如果用户想要自定义分子数据，提供 PDB 格式的数据字符串
3. 输出格式为 JSON：{"pdbId": "...", "data": "...", "format": "pdb"}
4. pdbId 和 data 至少提供一个，优先使用 pdbId
5. 如果用户提供的是 PDB ID，直接返回该 ID
6. 不确定时优先使用 PDB 数据库中已知的结构
7. 每次只输出一个 JSON 对象`;

function extractResult(text: string): { pdbId?: string; data?: string; format?: string } {
  // Try to extract JSON from the response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        pdbId: parsed.pdbId || "",
        data: parsed.data || "",
        format: parsed.format || "pdb",
      };
    } catch {
      // Continue with other extraction methods
    }
  }

  // Try to extract PDB ID (typically 4 characters, alphanumeric)
  const pdbIdMatch = text.match(/\b([0-9][A-Z0-9]{3})\b/i);
  if (pdbIdMatch) {
    return { pdbId: pdbIdMatch[1], format: "pdb" };
  }

  // If the text looks like PDB data (starts with HEADER, TITLE, ATOM, etc.)
  if (
    text.includes("HEADER") ||
    text.includes("TITLE") ||
    text.includes("ATOM") ||
    text.includes("HETATM")
  ) {
    return { data: text.trim(), format: "pdb" };
  }

  return {};
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

export async function generateThreeMolecule(
  prompt: string,
  currentPdbId?: string,
  currentData?: string,
): Promise<AiThreeMoleculeResult> {
  const currentText = currentPdbId
    ? `\n\n当前已有 PDB ID：${currentPdbId}`
    : currentData
      ? `\n\n当前已有分子数据`
      : "";

  const response = await aiChat({
    featureCode: DESIGN_TOOL_FEATURE_CODES.chat,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: `用户需求：${prompt}${currentText}` },
    ],
    temperature: 0.2,
    maxTokens: 2000,
  });

  const { raw, usage } = getResponseContent(response);
  if (!raw) {
    throw new Error("AI 未返回内容");
  }

  const result = extractResult(raw);
  if (!result.pdbId && !result.data) {
    throw new Error("AI 未返回有效的分子数据");
  }

  return {
    pdbId: result.pdbId || "",
    data: result.data || "",
    format: result.format || "pdb",
    raw,
    usage,
  };
}

export const aiThreeMoleculeService = {
  generateThreeMolecule,
};
