import type { KnowledgeItem } from "./types";

export const stickerSaveKnowledge: KnowledgeItem = {
  triggers: [
    "保存",
    "素材库",
    "导出",
    "贴纸",
    "save",
    "updateAndSaveSticker",
    "图库",
    "文件夹",
  ],

  content: `## 保存贴纸到素材库

### Agent 作品直接保存
canvas.updateAndSaveSticker({})
- 系统根据原始设计提示词自动补齐 name、description、keywords
- meta 中会以 data、prompt、promptHistory、source 平级保存画布数据和提示词历史

### 指定名称保存
canvas.updateAndSaveSticker({ name: "促销标签", description: "...", keywords: "促销,红色" })

### 保存到指定文件夹
canvas.updateAndSaveSticker({ folderId: "文件夹的UUID" })

### 保存到文件夹 + 指定信息
canvas.updateAndSaveSticker({ name: "促销标签", description: "...", keywords: "促销,红色", folderId: "文件夹UUID" })

### 返回结果
{ name, description, keywords, url, aiGenerated, metadataGenerationSource, source, prompt, promptHistoryCount }
- url: 贴纸的图片地址，可直接用于后续展示
- metadataGenerationSource: provided / prompt / vision / canvas-fallback
- promptHistoryCount: 当前作品累计记录的提示词版本数
- 如果未提供 folderId，贴纸会保存到根目录（无文件夹）

### 规则
- Agent 制作的贴纸可以不提供 name、description、keywords，系统会根据提示词自动生成缺失项
- 手动作品只有显式传入 autoGenerateMeta: true 时才使用视觉分析生成缺失项
- 提示词仅在成功执行修改画布的工具后记录；保存操作本身不会新增提示词历史
- folderId 必须是有效的文件夹 UUID，如果不确定文件夹 ID 可以先询问用户
- 保存前确保画布已渲染完成
- 批量保存参考"批量创建流程"`,
};
