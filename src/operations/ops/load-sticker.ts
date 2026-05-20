import { registerOperation } from "../registry";
import { getStickerById } from "@/api";
import { canvasStickerOptions } from "@/components/design/layout/canvas";

registerOperation({
  id: "canvas.loadSticker",
  name: "加载贴纸到画布",
  description: `从素材库加载一个已有的贴纸到画布上。

两种模式：
1. 可二次编辑的贴纸（isCustom=true）：会加载完整的元素树，可以修改文字、颜色、布局等。适用于"参考这个设计"、"基于这个改一个"。
2. 普通贴纸（isCustom=false）：作为一张图片加载到画布上，不能编辑内部元素。

加载后可用的工具：
- canvas.getState — 查看加载后的元素结构（配色、字体、布局等）
- element.setStyle / setTextContent 等 — 修改元素
- canvas.addChild — 添加新元素进行混搭

配合 resource.searchImage 使用：先搜索图库找到贴纸，获取 id，再用此工具加载。`,
  group: "贴纸",
  params: [
    {
      name: "stickerId",
      label: "贴纸ID",
      type: "string",
      required: true,
      description: "贴纸的唯一标识，从 resource.searchImage 返回结果的 id 字段获取",
    },
  ],
  async execute(params, ctx) {
    const { stickerId } = params;

    const sticker = await getStickerById(stickerId) as any;

    if (!sticker) {
      return {
        success: false,
        message: `未找到 ID 为 ${stickerId} 的贴纸`,
      };
    }

    const metaData = sticker.meta?.data;

    if (metaData) {
      // 可二次编辑的贴纸：加载完整元素树
      const deepCopy = JSON.parse(JSON.stringify(metaData));
      canvasStickerOptions.value = deepCopy;

      const children = deepCopy?.children || [];
      const elementCount = Math.max(0, children.length - 1); // 减掉 canvas 自身
      const elementTypes = children.slice(1).map((c: any) => c.type).join(", ");

      return {
        success: true,
        message: `已加载贴纸「${sticker.name || "未命名"}」到画布（可编辑，${elementCount} 个元素：${elementTypes}）`,
        data: {
          stickerId,
          name: sticker.name,
          description: sticker.description,
          editable: true,
          elementCount,
          elementTypes,
        },
      };
    }

    // 普通贴纸：作为图片添加
    if (sticker.url) {
      const extraOptions: Record<string, any> = {
        imageInfo: { url: sticker.url },
        width: { value: 100, unit: "vw" },
        height: { value: 100, unit: "vh" },
        position: {
          center: true,
          verticalCenter: true,
          horizontalCenter: true,
        },
      };
      const elementId = ctx.addCanvasChild("image", extraOptions);

      return {
        success: true,
        message: `已将贴纸「${sticker.name || "未命名"}」作为图片加载到画布`,
        data: {
          stickerId,
          name: sticker.name,
          description: sticker.description,
          editable: false,
          elementId,
        },
      };
    }

    return {
      success: false,
      message: `贴纸「${sticker.name || "未命名"}」没有可用的设计数据或图片地址`,
    };
  },
});
