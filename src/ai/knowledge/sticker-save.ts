import type { KnowledgeItem } from "./types";

export const stickerSaveKnowledge: KnowledgeItem = {
  triggers: ["保存", "素材库", "导出", "贴纸", "save", "updateAndSaveSticker", "图库"],

  content: `## 保存贴纸到素材库

### 简单保存（自动生成名称和描述）
canvas.updateAndSaveSticker({})  ← 系统会自动分析画布生成 name、description、keywords

### 指定名称保存
canvas.updateAndSaveSticker({ name: "促销标签", description: "...", keywords: "促销,红色" })

### 返回结果
{ name, description, keywords, url, aiGenerated }
- url: 贴纸的图片地址，可直接用于后续展示

### 规则
- 可以不提供 name，系统会用 AI 自动分析生成
- 保存前确保画布已渲染完成
- 批量保存参考"批量创建流程"`,
};
