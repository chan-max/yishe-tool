import type { KnowledgeItem } from "./types";

export const batchWorkflowKnowledge: KnowledgeItem = {
  triggers: ["批量", "多个", "几个", "bunch", "batch", "一批", "连续", "startBatchTask"],

  content: `## 批量创建流程

**【强制规则】第一步必须调用 canvas.startBatchTask！**

以创建 3 个素材为例：
1. canvas.startBatchTask({ total: 3, description: "创建3个素材" })
2. canvas.addHtml({ htmlContent: "..." }) — 创建设计
3. canvas.updateAndSaveSticker() — 系统提示 "已完成 1/3"
4. canvas.clear()
5. canvas.addHtml({ htmlContent: "..." }) — 下一个设计
6. canvas.updateAndSaveSticker() — 系统提示 "已完成 2/3"
7. canvas.clear()
8. canvas.addHtml({ htmlContent: "..." }) — 最后一个设计
9. canvas.updateAndSaveSticker() — 系统提示 "全部完成！"

规则：
- 每完成一个必须 canvas.clear 清空画布再开始下一个
- 必须完成指定数量，未完成就停止 = 任务失败
- 系统会在每次 save 后自动提示进度，按提示继续即可`,
};
