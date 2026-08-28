import { registerOperation } from "../registry";
import { getCustomSticker } from "@/api";
import {
  canvasStickerOptions,
  currentEditingCustomStickerId,
  currentEditingCustomStickerFolderId,
} from "@/components/design/layout/canvas";
import { restoreAgentDesignProvenance } from "@/ai/design-provenance";

registerOperation({
  id: "canvas.loadCustomSticker",
  name: "加载自定义贴纸到画布",
  description: "从自定义贴纸模块加载一份 1s 设计作品及其完整可编辑画布数据。",
  group: "贴纸",
  params: [{ name: "customStickerId", label: "自定义贴纸ID", type: "string", required: true }],
  async execute(params) {
    const item: any = await getCustomSticker(String(params.customStickerId));
    const canvasData = item?.meta?.data;
    if (!canvasData) {
      return { success: false, message: "该自定义贴纸没有可编辑的画布数据" };
    }
    canvasStickerOptions.value = JSON.parse(JSON.stringify(canvasData));
    restoreAgentDesignProvenance(canvasStickerOptions.value, item.meta);
    currentEditingCustomStickerId.value = item.id;
    currentEditingCustomStickerFolderId.value = item.folderId || null;
    return {
      success: true,
      message: `已加载自定义贴纸「${item.name || "未命名"}」，保存将更新原作品`,
      data: { customStickerId: item.id, name: item.name, editable: true },
    };
  },
});
