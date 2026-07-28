/**
 * 设计提示词 - 类型定义
 */

export type DesignPromptCategory =
  | "system"
  | "style"
  | "technique"
  | "workflow"
  | "template"
  | "custom";

export interface DesignPromptItem {
  id: string;
  userId: string;
  title: string;
  content: string;
  category: DesignPromptCategory;
  tags: string[];
  isFavorite: boolean;
  usageCount: number;
  createTime: string;
  updateTime: string;
}

export interface CreateDesignPromptParams {
  title: string;
  content: string;
  category?: DesignPromptCategory;
  tags?: string[];
}

export interface UpdateDesignPromptParams {
  id: string;
  title?: string;
  content?: string;
  category?: DesignPromptCategory;
  tags?: string[];
  isFavorite?: boolean;
}

export interface QueryDesignPromptParams {
  currentPage?: number;
  pageSize?: number;
  category?: DesignPromptCategory;
  keyword?: string;
  isFavorite?: boolean;
}

export interface DesignPromptPageResponse {
  list: DesignPromptItem[];
  total: number;
  currentPage: number;
  pageSize: number;
}
