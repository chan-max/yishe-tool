export interface KnowledgeItem {
  triggers: string[];
  content: string;
  /** 优先级：core=始终注入, important=高相关时注入, optional=低优先级 */
  priority?: "core" | "important" | "optional";
  /** 预估 token 数量（用于预算控制） */
  tokens?: number;
  /** 分类标签，用于去重和分组 */
  category?: string;
}
