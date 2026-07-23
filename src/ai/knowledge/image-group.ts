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
1. 先确定整组共用的尺寸、配色、字体、品牌元素和排版语言，所有成员保持视觉一致。
2. 一次只制作一张。名片组图默认制作 2 张：第 1 张正面，第 2 张背面。
3. 每张完成后调用 canvas.updateAndSaveSticker，记录返回的 stickerId。
4. 制作下一张前调用 canvas.clear，再按同一视觉规范创建新页面。
5. 所有成员都保存成功后，调用 material.createImageGroup({ name, stickerIds, description })。
6. stickerIds 的数组顺序就是组图显示顺序，无需额外的成员角色字段。
7. 任意成员保存失败时不要创建半成品组图，应先修复失败步骤。

### 名片正反面示例
- 正面：完成设计 -> canvas.updateAndSaveSticker -> 得到第 1 个 stickerId
- canvas.clear
- 背面：完成设计 -> canvas.updateAndSaveSticker -> 得到第 2 个 stickerId
- material.createImageGroup({ name: "客户名片正反面", stickerIds: ["第1个ID", "第2个ID"] })

只有 material.createImageGroup 成功后，组图任务才算完成。`,
};
