// ========== 知识条目类型 ==========
export type { KnowledgeItem } from "./types";
import type { KnowledgeItem } from "./types";

// ========== 组合器：根据用户输入选择相关知识层 ==========

import {
  allKnowledgeItems,
  baseAlwaysKnowledge,
  builtInKnowledgeItems,
  markdownSkillKnowledgeItems,
} from "./registry";
import { searchDesignKnowledge } from "@/api";
import { syncLocalTipsToBackend } from "./design-tips-loader";

const allKnowledge: KnowledgeItem[] = allKnowledgeItems;
const baseAlways = baseAlwaysKnowledge; // base 永远注入

// ========== Token 预算配置 ==========
const MAX_KNOWLEDGE_TOKENS = 3500; // 知识层最大 token 预算
const VECTOR_SEARCH_LIMIT = 5; // 向量搜索返回的最大结果数

// ========== 工具函数 ==========

/** 估算文本 token 数（中文约 1.5 字/token，英文约 4 字符/token） */
function estimateTokens(text: string): number {
  const chineseChars = (text.match(/[一-鿿]/g) || []).length;
  const otherChars = text.length - chineseChars;
  return Math.ceil(chineseChars / 1.5 + otherChars / 4);
}

/** 计算知识项与用户输入的相关性分数 */
function calcRelevance(item: KnowledgeItem, userInput: string): number {
  const lower = userInput.toLowerCase();
  let score = 0;

  for (const trigger of item.triggers) {
    const t = trigger.toLowerCase();
    if (lower.includes(t)) {
      // 完全匹配得分更高
      score += t.length * 2;
      // 开头匹配加分
      if (lower.startsWith(t)) score += 10;
    }
  }

  // 优先级加权
  const priorityWeight = { core: 100, important: 50, optional: 10 };
  score += priorityWeight[item.priority || "optional"];

  return score;
}

// ========== 向量库搜索 ==========

interface VectorSearchResult {
  id: string;
  title: string;
  content: string;
  category?: string;
  tags?: string[];
  score?: number;
}

function normalizeVectorSearchResult(raw: any): VectorSearchResult | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  // 后端已回填 MySQL 的格式
  if (raw.id && raw.content) {
    return {
      id: String(raw.id),
      title: raw.title || "未命名知识",
      content: raw.content,
      category: raw.category,
      tags: raw.tags,
      score: raw.score,
    };
  }

  // 兼容原始向量搜索结果（payload 通常不含完整 content）
  if (raw.sourceId) {
    const payload = raw.payload || {};
    return {
      id: String(raw.sourceId),
      title: payload.title || "未命名知识",
      content: payload.content || payload.summary || "",
      category: payload.category,
      tags: payload.tags,
      score: raw.score,
    };
  }

  return null;
}

/**
 * 从向量库搜索相关知识
 * 失败时返回空数组，不影响主流程
 */
async function fetchVectorKnowledge(query: string): Promise<KnowledgeItem[]> {
  try {
    const results = await searchDesignKnowledge({
      query,
      limit: VECTOR_SEARCH_LIMIT,
    });

    if (!Array.isArray(results) || results.length === 0) {
      return [];
    }

    return results
      .map(normalizeVectorSearchResult)
      .filter((item): item is VectorSearchResult => !!item && !!item.content)
      .map((item) => ({
        triggers: [item.title, ...(item.tags || [])],
        content: `【知识库】${item.title}\n${item.content}`,
        priority: "important" as const,
        tokens: estimateTokens(item.content),
        category: item.category,
      }));
  } catch (error) {
    console.warn("[Knowledge] Vector search failed, using local knowledge only:", error);
    return [];
  }
}

// ========== 渐进式知识注入 ==========

export async function buildKnowledgePrompt(userInput: string): Promise<string> {
  // 静默触发本地技巧同步（如增删改 Markdown），确保 Qdrant 数据库数据闭环
  void syncLocalTipsToBackend();

  const vectorItems = await fetchVectorKnowledge(userInput);

  let totalTokens = estimateTokens(baseAlways.content);
  const layers = [baseAlways.content];

  // 1. 向量语义匹配结果优先注入（已按相关性召回，不依赖触发词）
  for (const item of vectorItems) {
    const tokens = item.tokens || estimateTokens(item.content);
    if (totalTokens + tokens > MAX_KNOWLEDGE_TOKENS) {
      break;
    }
    layers.push(item.content);
    totalTokens += tokens;
  }

  // 2. 本地知识按触发词匹配，填充剩余 token 预算
  const matched = allKnowledge
    .map((item) => ({
      item,
      score: calcRelevance(item, userInput),
      tokens: item.tokens || estimateTokens(item.content),
    }))
    .filter((k) => k.score > 10)
    .sort((a, b) => b.score - a.score);

  for (const entry of matched) {
    if (entry.item.priority === "core") {
      if (!layers.includes(entry.item.content)) {
        layers.push(entry.item.content);
        totalTokens += entry.tokens;
      }
      continue;
    }

    if (totalTokens + entry.tokens <= MAX_KNOWLEDGE_TOKENS) {
      if (!layers.includes(entry.item.content)) {
        layers.push(entry.item.content);
        totalTokens += entry.tokens;
      }
    }
  }

  return layers.join("\n");
}

// ========== 获取匹配的知识分类（用于调试/展示） ==========

export function getMatchedCategories(userInput: string): string[] {
  return allKnowledge
    .filter((k) => k.triggers.some((t) => userInput.includes(t)))
    .map((k) => k.category || "未分类")
    .filter((v, i, a) => a.indexOf(v) === i); // 去重
}

export function getKnowledgeRegistryStats() {
  return {
    builtIn: builtInKnowledgeItems.length,
    markdownSkills: markdownSkillKnowledgeItems.length,
    total: allKnowledge.length,
    categories: allKnowledge
      .map((item) => item.category || "未分类")
      .filter((v, i, a) => a.indexOf(v) === i),
  };
}
