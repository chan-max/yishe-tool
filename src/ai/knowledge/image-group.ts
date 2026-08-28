import type { KnowledgeItem } from "./types";

export const imageGroupKnowledge: KnowledgeItem = {
  triggers: [
    "组图",
    "套图",
    "正反面",
    "前后面",
    "前后页",
    "多页设计",
    "image group",
    "image set",
  ],
  priority: "core",
  category: "workflow",
  content: `## 组图制作流程

组图是多张独立设计按顺序组成的一个结果。请求制作组图本身就表示需要保存每张图片并最终创建组图，不需要再询问用户是否保存。

### 必须遵守
1. 【视觉高度一致性】：整组所有成员必须强制共享相同的画布尺寸（高宽）、完全相同的背景色彩/渐变/底图、相同的字体名称/颜色与边框圆角，绝对禁止在同组不同成员之间随意变更色彩、字体或构图风格。
2. 保存组图成员贴纸时，避免因文字高矮笔画差异被自动裁切为不同物理高度（需设置 autoTrim: false 或使用统一裁剪框）。
3. 一次只制作一张。名片组图默认制作 2 张：第 1 张正面，第 2 张背面；对联组图制作 2 张：第 1 张上联，第 2 张下联。
4. 每张完成后调用 canvas.updateAndSaveSticker，记录返回的 customStickerId。
5. 制作下一张前调用 canvas.clear，再按同一视觉规范创建新页面。
6. 所有成员都保存成功后，先使用 material.importCustomStickerToLibrary 将每个 customStickerId 复制到 sticker 素材库，再调用 material.createImageGroup({ name, stickerIds, description })。
7. stickerIds 的数组顺序就是组图显示顺序，无需额外的成员角色字段。
8. 任意成员保存失败时不要创建半成品组图，应先修复失败步骤。

### 名片正反面示例
- 正面：完成设计 -> canvas.updateAndSaveSticker -> 得到第 1 个 customStickerId
- canvas.clear
- 背面：完成设计 -> canvas.updateAndSaveSticker -> 得到第 2 个 customStickerId
- 分别调用 material.importCustomStickerToLibrary 得到 stickerId 后，再调用 material.createImageGroup({ name: "客户名片正反面", stickerIds: ["第1个stickerId", "第2个stickerId"] })

只有 material.createImageGroup 成功后，组图任务才算完成。`,
};
