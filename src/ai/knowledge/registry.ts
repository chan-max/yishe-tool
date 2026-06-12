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
import {
  styleTemplatesKnowledge,
  layoutPatternsKnowledge,
  commonMistakesKnowledge,
  fontPairingKnowledge,
} from "./style-templates";
import { designTipsKnowledge } from "./design-tips-loader";
import type { KnowledgeItem } from "./types";

/**
 * Tool agent skills registry.
 *
 * This layer is the right place for small local skills: CSS techniques,
 * font usage rules, htmlBindings conventions, image resource usage, and
 * workflow constraints. WebSocket only syncs state/control; it should not own
 * these agent capabilities.
 */

export const baseAlwaysKnowledge = baseKnowledge;

export const builtInKnowledgeItems: KnowledgeItem[] = [
  htmlElementsKnowledge,
  fontBindingKnowledge,
  imageBindingKnowledge,
  batchWorkflowKnowledge,
  templateModeKnowledge,
  designRulesKnowledge,
  stickerSaveKnowledge,
  remixKnowledge,
  styleTemplatesKnowledge,
  layoutPatternsKnowledge,
  commonMistakesKnowledge,
  fontPairingKnowledge,
  ...customKnowledgeItems,
];

export const markdownSkillKnowledgeItems: KnowledgeItem[] = designTipsKnowledge;

export const allKnowledgeItems: KnowledgeItem[] = [
  ...builtInKnowledgeItems,
  ...markdownSkillKnowledgeItems,
];

