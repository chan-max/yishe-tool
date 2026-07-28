/**
 * 设计提示词模块
 *
 * 纯存储模块，用户可以收藏提示词，方便输入时选择使用。
 */

export type {
  DesignPromptItem,
  CreateDesignPromptParams,
  UpdateDesignPromptParams,
  QueryDesignPromptParams,
  DesignPromptPageResponse,
  DesignPromptCategory,
} from "./types";

export {
  createDesignPrompt,
  updateDesignPrompt,
  deleteDesignPrompt,
  queryDesignPromptPage,
  favoriteDesignPrompt,
  unfavoriteDesignPrompt,
} from "./api";
