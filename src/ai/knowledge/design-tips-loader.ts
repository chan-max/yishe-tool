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
      techniques: "## CSS 技巧速查",
      shapes: "## CSS 形状技巧速查",
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

import {
  createDesignKnowledge,
  updateDesignKnowledge,
  getDesignKnowledgePage,
} from "../../api";

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

let isSyncing = false;
let isSynced = false;

/**
 * 自动将本地 design-tips/*.md 设计技巧同步到后端 MySQL 并生成向量索引
 */
export async function syncLocalTipsToBackend(): Promise<void> {
  if (isSynced || isSyncing) return;
  isSyncing = true;
  console.log("[SHAVI] 开始同步本地设计技巧到向量数据库...");

  try {
    // 1. 获取后端已有的数据分页列表，加载前 100 条
    const res = await getDesignKnowledgePage({ currentPage: 1, pageSize: 100 }).catch(() => null);
    if (!res) {
      console.warn("[SHAVI] 自动同步跳过：接口未授权或后端服务离线");
      isSyncing = false;
      return;
    }

    const dbItems = Array.isArray((res as any).list) ? (res as any).list : [];
    
    // 建立 filePath -> dbItem 映射，用于识别是新增还是更新
    const dbMap = new Map<string, any>();
    for (const item of dbItems) {
      const filePath = item.extras?.filePath;
      if (filePath) {
        dbMap.set(filePath, item);
      }
    }

    // 2. 遍历本地所有 md 技巧并比对
    for (const tip of allTips) {
      // 提取相对路径，如 "effects/neon-glow.md"
      const relativePath = tip.filePath.replace("../../design-tips/", "");
      const dbItem = dbMap.get(relativePath);

      const payload = {
        title: tip.frontmatter.title,
        content: tip.content,
        category: "css-trick",
        tags: tip.frontmatter.triggers,
        isPublic: true,
        extras: {
          fromLocalTips: true,
          filePath: relativePath,
          tokens: tip.tokens,
        },
      };

      if (!dbItem) {
        // 数据库中没有，执行新建
        console.log(`[SHAVI] 检测到本地新增设计技巧，正在同步至数据库: ${relativePath}`);
        await createDesignKnowledge(payload).catch((err) => {
          console.warn(`[SHAVI] 新建本地设计技巧失败 ${relativePath}:`, err);
        });
      } else {
        // 数据库中有，检查内容是否改变，有改变则执行更新
        if (dbItem.content !== tip.content || dbItem.title !== tip.frontmatter.title) {
          console.log(`[SHAVI] 检测到本地设计技巧内容变更，正在更新至数据库: ${relativePath}`);
          await updateDesignKnowledge({
            id: dbItem.id,
            ...payload,
          }).catch((err) => {
            console.warn(`[SHAVI] 更新本地设计技巧失败 ${relativePath}:`, err);
          });
        }
      }
    }
    isSynced = true;
    console.log("[SHAVI] 本地设计技巧数据库同步校验完成");
  } catch (error) {
    console.warn("[SHAVI] 同步本地设计技巧失败:", error);
  } finally {
    isSyncing = false;
  }
}
