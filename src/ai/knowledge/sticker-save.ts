import type { KnowledgeItem } from "./types";

export const stickerSaveKnowledge: KnowledgeItem = {
  triggers: ["保存", "素材库", "导出", "贴纸", "save", "updateAndSaveSticker", "图库", "文件夹"],

  content: `## 保存贴纸到素材库

### 简单保存（自动生成名称和描述，保存到根目录）
canvas.updateAndSaveSticker({})  ← 系统会自动分析画布生成 name、description、keywords

### 指定名称保存
canvas.updateAndSaveSticker({ name: "促销标签", description: "...", keywords: "促销,红色" })

### 保存到指定文件夹
canvas.updateAndSaveSticker({ folderId: "文件夹的UUID" })

### 保存到文件夹 + 指定信息
canvas.updateAndSaveSticker({ name: "促销标签", description: "...", keywords: "促销,红色", folderId: "文件夹UUID" })

### 返回结果
{ name, description, keywords, url, aiGenerated, folderId }
- url: 贴纸的图片地址，可直接用于后续展示
- 如果未提供 folderId，贴纸会保存到根目录（无文件夹）

### 规则
- 可以不提供 name，系统会用 AI 自动分析生成
- folderId 必须是有效的文件夹 UUID，如果不确定文件夹 ID 可以先询问用户
- 保存前确保画布已渲染完成
- 批量保存参考"批量创建流程"`,
};
