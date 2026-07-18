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
import { compositionPatternsKnowledge } from "./composition-patterns";
import { iterationTechniquesKnowledge } from "./iteration-techniques";
import { glassEffectsKnowledge } from "./css-glass-effects";
import { decorationsKnowledge } from "./css-decorations";
import { buttonsKnowledge } from "./css-buttons";
import { gridLayoutsKnowledge } from "./css-grid-layouts";
import { textEffectsKnowledge } from "./css-text-effects";
import { clippathShapesKnowledge } from "./css-clippath-shapes";
import { pseudoElementsKnowledge } from "./css-pseudo-elements";
import { advancedCompositionsKnowledge } from "./css-compositions-advanced";
import { backgroundPatternsKnowledge } from "./css-background-patterns";
import { merchandisePrintKnowledge } from "./merchandise-print";
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
  compositionPatternsKnowledge,
  iterationTechniquesKnowledge,
  glassEffectsKnowledge,
  decorationsKnowledge,
  buttonsKnowledge,
  gridLayoutsKnowledge,
  textEffectsKnowledge,
  clippathShapesKnowledge,
  pseudoElementsKnowledge,
  advancedCompositionsKnowledge,
  backgroundPatternsKnowledge,
  fontBindingKnowledge,
  imageBindingKnowledge,
  merchandisePrintKnowledge,
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
