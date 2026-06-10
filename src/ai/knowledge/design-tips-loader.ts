import type { KnowledgeItem } from "./types";

// Vite 自动导入：扫描 design-tips 目录下所有 .md 文件
const tipModules = import.meta.glob("../../design-tips/**/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

// ============ Frontmatter 解析 ============

interface TipFrontmatter {
  title: string;
  triggers: string[];
  priority: "core" | "important" | "optional";
  category?: string;
  tokens?: number;
}

function parseFrontmatter(raw: string): { frontmatter: TipFrontmatter; content: string } {
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
  if (!match) {
    return {
      frontmatter: { title: "未命名", triggers: [], priority: "optional" },
      content: raw.trim(),
    };
  }

  const fmText = match[1];
  const content = match[2].trim();

  const fm: Record<string, string> = {};
  for (const line of fmText.split("\n")) {
    const sep = line.indexOf(":");
    if (sep > 0) {
      const key = line.slice(0, sep).trim();
      const val = line.slice(sep + 1).trim();
      fm[key] = val;
    }
  }

  return {
    frontmatter: {
      title: fm.title || "未命名",
      triggers: fm.triggers
        ? fm.triggers.split(/[,，]/).map((s) => s.trim()).filter(Boolean)
        : [],
      priority: (fm.priority as TipFrontmatter["priority"]) || "optional",
      category: fm.category,
      tokens: fm.tokens ? Number(fm.tokens) : undefined,
    },
    content,
  };
}

// ============ 估算 token ============

function estimateTokens(text: string): number {
  const chineseChars = (text.match(/[\u4e00-\u9fff]/g) || []).length;
  const otherChars = text.length - chineseChars;
  return Math.ceil(chineseChars / 1.5 + otherChars / 4);
}

// ============ 从文件路径提取分类 ============

function extractCategory(filePath: string): string {
  // 路径格式: ../../design-tips/effects/neon-glow.md
  const parts = filePath.replace("../../design-tips/", "").split("/");
  return parts.length > 1 ? parts[0] : "general";
}

// ============ 加载并生成 KnowledgeItem ============

interface LoadedTip {
  filePath: string;
  frontmatter: TipFrontmatter;
  content: string;
  category: string;
  tokens: number;
}

function loadAllTips(): LoadedTip[] {
  const tips: LoadedTip[] = [];

  for (const [filePath, rawContent] of Object.entries(tipModules)) {
    if (!rawContent || typeof rawContent !== "string") continue;

    const { frontmatter, content } = parseFrontmatter(rawContent);
    const category = frontmatter.category || extractCategory(filePath);
    const tokens = frontmatter.tokens || estimateTokens(content);

    tips.push({ filePath, frontmatter, content, category, tokens });
  }

  return tips;
}

// 按目录分组，每个目录生成一个 KnowledgeItem
function groupTipsToKnowledgeItems(tips: LoadedTip[]): KnowledgeItem[] {
  const groups = new Map<string, LoadedTip[]>();

  for (const tip of tips) {
    const key = tip.category;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(tip);
  }

  const items: KnowledgeItem[] = [];

  for (const [category, groupTips] of groups) {
    // 合并所有触发词（去重）
    const triggerSet = new Set<string>();
    for (const tip of groupTips) {
      for (const t of tip.frontmatter.triggers) {
        triggerSet.add(t);
      }
    }

    // 取最高优先级
    const priorities = groupTips.map((t) => t.frontmatter.priority);
    const priority = priorities.includes("core")
      ? "core"
      : priorities.includes("important")
        ? "important"
        : "optional";

    // 拼接内容，每个技巧之间用分隔线
    const headerMap: Record<string, string> = {
      effects: "## CSS 视觉效果速查",
      text: "## CSS 文字特效速查",
      patterns: "## CSS 图案纹理速查",
      cases: "## 设计案例参考",
      general: "## 设计技巧",
    };
    const header = headerMap[category] || `## ${category}`;

    const contentParts = groupTips.map(
      (tip) => `#### ${tip.frontmatter.title}\n${tip.content}`
    );
    const content = [header, ...contentParts].join("\n\n");

    items.push({
      triggers: Array.from(triggerSet),
      priority,
      category: `design-tips-${category}`,
      tokens: estimateTokens(content),
      content,
    });
  }

  return items;
}

// ============ 导出 ============

const allTips = loadAllTips();
export const designTipsKnowledge: KnowledgeItem[] = groupTipsToKnowledgeItems(allTips);

// 调试用：获取已加载的技巧列表
export function getLoadedTipNames(): string[] {
  return allTips.map((t) => `${t.category}/${t.frontmatter.title}`);
}

export function getDesignTipsStats() {
  return {
    totalFiles: allTips.length,
    categories: Array.from(new Set(allTips.map((t) => t.category))),
    totalTokens: allTips.reduce((sum, t) => sum + t.tokens, 0),
  };
}
