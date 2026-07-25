import { baseKnowledge } from "./base";
import { htmlElementsKnowledge } from "./html-elements";
import { fontBindingKnowledge } from "./font-binding";
import { imageBindingKnowledge } from "./image-binding";
import { batchWorkflowKnowledge } from "./batch-workflow";
import { templateModeKnowledge } from "./template-mode";
import { stickerSaveKnowledge } from "./sticker-save";
import { imageGroupKnowledge } from "./image-group";
import { remixKnowledge } from "./remix";
import { customKnowledgeItems } from "./custom-specs";
import { designTipsKnowledge } from "./design-tips-loader";
import { merchandisePrintKnowledge } from "./merchandise-print";
import type { KnowledgeItem } from "./types";

/**
 * Tool agent skills registry.
 *
 * The client layer ONLY owns core tool protocols, canvas component bindings,
 * and essential workflow constraints. All aesthetic design rules, CSS tricks,
 * and style templates are stored in backend DB / vector search.
 */

export const baseAlwaysKnowledge = baseKnowledge;

export const builtInKnowledgeItems: KnowledgeItem[] = [
  htmlElementsKnowledge,
  fontBindingKnowledge,
  imageBindingKnowledge,
  merchandisePrintKnowledge,
  batchWorkflowKnowledge,
  templateModeKnowledge,
  stickerSaveKnowledge,
  imageGroupKnowledge,
  remixKnowledge,
  ...customKnowledgeItems,
];

export const markdownSkillKnowledgeItems: KnowledgeItem[] = designTipsKnowledge;

export const allKnowledgeItems: KnowledgeItem[] = [
  ...builtInKnowledgeItems,
  ...markdownSkillKnowledgeItems,
];

