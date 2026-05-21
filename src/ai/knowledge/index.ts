// ========== 知识条目类型 ==========
export type { KnowledgeItem } from "./types";
import type { KnowledgeItem } from "./types";

// ========== 组合器：根据用户输入选择相关知识层 ==========

import { baseKnowledge } from "./base";
import { htmlElementsKnowledge } from "./html-elements";
import { fontBindingKnowledge } from "./font-binding";
import { imageBindingKnowledge } from "./image-binding";
import { batchWorkflowKnowledge } from "./batch-workflow";
import { templateModeKnowledge } from "./template-mode";
import { designRulesKnowledge } from "./design-rules";
import { stickerSaveKnowledge } from "./sticker-save";
import { remixKnowledge } from "./remix";
import { customKnowledgeItems } from "./custom-specs";

const allKnowledge: KnowledgeItem[] = [
  htmlElementsKnowledge,
  fontBindingKnowledge,
  imageBindingKnowledge,
  batchWorkflowKnowledge,
  templateModeKnowledge,
  designRulesKnowledge,
  stickerSaveKnowledge,
  remixKnowledge,
  ...customKnowledgeItems,
];

const baseAlways = baseKnowledge; // base 永远注入

// ========== Token 预算配置 ==========
const MAX_KNOWLEDGE_TOKENS = 2000; // 知识层最大 token 预算

// ========== 工具函数 ==========

/** 估算文本 token 数（中文约 1.5 字/token，英文约 4 字符/token） */
function estimateTokens(text: string): number {
  const chineseChars = (text.match(/[\u4e00-\u9fff]/g) || []).length;
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

// ========== 渐进式知识注入 ==========

export function buildKnowledgePrompt(userInput: string): string {
  // 1. 筛选有触发词匹配的知识项
  const matched = allKnowledge
    .map((item) => ({
      item,
      score: calcRelevance(item, userInput),
      tokens: item.tokens || estimateTokens(item.content),
    }))
    .filter((k) => k.score > 10) // 至少有基础优先级分数
    .sort((a, b) => b.score - a.score); // 按相关性降序

  // 2. 渐进式填充，控制 token 预算
  const selected: typeof matched = [];
  let totalTokens = estimateTokens(baseAlways.content);

  for (const entry of matched) {
    // core 级别始终注入
    if (entry.item.priority === "core") {
      selected.push(entry);
      totalTokens += entry.tokens;
      continue;
    }

    // 其他级别按预算控制
    if (totalTokens + entry.tokens <= MAX_KNOWLEDGE_TOKENS) {
      selected.push(entry);
      totalTokens += entry.tokens;
    }
  }

  // 3. 组装最终 prompt
  const layers = [baseAlways.content];

  for (const { item } of selected) {
    layers.push(item.content);
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
