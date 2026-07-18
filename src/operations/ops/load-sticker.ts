import { registerOperation } from "../registry";
import { getStickerById } from "@/api";
import { canvasStickerOptions } from "@/components/design/layout/canvas";
import { restoreAgentDesignProvenance } from "@/ai/design-provenance";

registerOperation({
  id: "canvas.loadSticker",
  name: "加载贴纸到画布",
  description: `从素材库加载一个或多个贴纸到画布上。

支持两种调用方式：
1. 单个加载：stickerId 传字符串，如 canvas.loadSticker({ stickerId: "xxx" })
2. 批量加载：stickerId 传数组，如 canvas.loadSticker({ stickerId: ["id_a", "id_b"] })

单个加载时：
- 可二次编辑的贴纸（isCustom=true）：会加载完整的元素树，可以修改文字、颜色、布局等。
- 普通贴纸（isCustom=false）：作为一张图片加载到画布上。

批量加载时：
- 所有贴纸都作为图片元素添加到画布，可逐个调整位置和大小。
- 返回每个贴纸的信息，包含是否可编辑的标记。

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
      description: "贴纸ID，支持单个字符串或字符串数组。单个: \"xxx\"，多个: [\"id_a\", \"id_b\"]",
    },
  ],
  async execute(params, ctx) {
    const { stickerId } = params;

    // 单个加载（保持原有行为）
    if (typeof stickerId === "string") {
      return await loadSingleSticker(stickerId, ctx);
    }

    // 批量加载
    if (Array.isArray(stickerId) && stickerId.length > 0) {
      const results: any[] = [];
      const errors: string[] = [];

      for (const id of stickerId) {
        const result = await loadSingleSticker(id, ctx);
        if (result.success) {
          results.push(result.data);
        } else {
          errors.push(result.message);
        }
      }

      if (results.length === 0) {
        return {
          success: false,
          message: `所有贴纸加载失败：${errors.join("；")}`,
        };
      }

      const names = results.map((r: any) => `「${r.name || "未命名"}」`).join("、");
      const editableCount = results.filter((r: any) => r.editable).length;

      return {
        success: true,
        message: `已加载 ${results.length} 个贴纸到画布：${names}${editableCount > 0 ? `（其中 ${editableCount} 个可编辑）` : ""}`,
        data: {
          loaded: results,
          failed: errors.length > 0 ? errors : undefined,
          total: stickerId.length,
          successCount: results.length,
        },
      };
    }

    return {
      success: false,
      message: "stickerId 参数无效，请传入字符串或字符串数组",
    };
  },
});

async function loadSingleSticker(stickerId: string, ctx: any) {
  const sticker = await getStickerById(stickerId) as any;

  if (!sticker) {
    return {
      success: false,
      message: `未找到 ID 为 ${stickerId} 的贴纸`,
    };
  }

  const metaData = sticker.meta?.data;

  // 单个加载时，可编辑贴纸加载元素树
  if (metaData) {
    const deepCopy = JSON.parse(JSON.stringify(metaData));
    canvasStickerOptions.value = deepCopy;
    restoreAgentDesignProvenance(canvasStickerOptions.value, sticker.meta);

    const children = deepCopy?.children || [];
    const elementCount = Math.max(0, children.length - 1);
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
}
