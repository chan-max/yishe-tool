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

function matchTriggers(userInput: string, triggers: string[]): boolean {
  const lower = userInput.toLowerCase();
  return triggers.some((t) => lower.includes(t.toLowerCase()));
}

export function buildKnowledgePrompt(userInput: string): string {
  const selected = allKnowledge.filter((k) =>
    k.triggers.some((t) => userInput.includes(t))
  );

  if (selected.length === 0) return "";

  const layers = [baseAlways.content];

  for (const k of selected) {
    layers.push(k.content);
  }

  return layers.join("\n");
}
