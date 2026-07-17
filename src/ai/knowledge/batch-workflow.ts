import type { KnowledgeItem } from "./types";

export const batchWorkflowKnowledge: KnowledgeItem = {
  triggers: [
    "批量",
    "多个",
    "几个",
    "bunch",
    "batch",
    "一批",
    "连续",
    "startBatchTask",
  ],

  content: `## 连续制作能力

当用户要求连续制作多张贴纸或素材时，可以按一张一张的方式推进：创建当前设计、保存、清空画布，再继续下一张。

可用工具：
- canvas.startBatchTask({ total, description })：需要工具内进度提示时使用
- canvas.updateAndSaveSticker({ name, description, keywords })：保存当前画布
- canvas.getBatchProgress()：查看工具内批量进度

建议流程：
1. 明确这一批的数量、主题和风格差异
2. 每张生成前保持画布干净，除非用户要求基于上一张迭代
3. 保存时给出可检索的 name / description / keywords
4. 某张素材不合适时，可以换方向继续，不要机械重复失败方案`,
};
