import { createImageGroup } from "@/api/imageGroup";
import { registerOperation } from "../registry";

function normalizeStickerIds(value: unknown): string[] {
  const ids = Array.isArray(value)
    ? value
    : String(value || "")
        .split(/[,，\n]/)
        .map((item) => item.trim());

  return [...new Set(ids.map((item) => String(item).trim()).filter(Boolean))];
}

registerOperation({
  id: "material.createImageGroup",
  name: "创建组图",
  description:
    "将已经保存到素材库的多张图片按 stickerIds 数组顺序创建为一个组图。必须等所有成员图片保存成功并取得 stickerId 后再调用。",
  group: "组图",
  params: [
    {
      name: "name",
      label: "组图名称",
      type: "string",
      required: true,
      description: "组图名称，例如“张三商务名片正反面”。",
    },
    {
      name: "stickerIds",
      label: "素材 ID",
      type: "array",
      required: true,
      minItems: 2,
      maxItems: 200,
      items: {
        type: "string",
        description: "canvas.updateAndSaveSticker 返回的 stickerId。",
      },
      description:
        "有序素材 ID 数组。第一个 ID 显示为组图第 1 张，第二个显示为第 2 张，以此类推。",
    },
    {
      name: "description",
      label: "组图描述",
      type: "string",
      description: "说明这组图片的共同用途、主题和设计关系。",
    },
    {
      name: "folderId",
      label: "文件夹 ID",
      type: "string",
      description: "可选的组图文件夹 UUID；不提供则保存为未分组。",
    },
  ],
  async execute(params) {
    const name = String(params.name || "").trim();
    const stickerIds = normalizeStickerIds(params.stickerIds);

    if (!name) {
      return { success: false, message: "创建组图需要名称" };
    }
    if (stickerIds.length < 2) {
      return {
        success: false,
        message: "组图至少需要 2 个有效的 stickerId",
      };
    }

    try {
      const group = await createImageGroup({
        name,
        description: String(params.description || "").trim() || undefined,
        folderId: String(params.folderId || "").trim() || undefined,
        meta: {
          source: "yishe-tool-agent",
          createdAt: new Date().toISOString(),
        },
        stickers: stickerIds.map((stickerId, sortOrder) => ({
          stickerId,
          sortOrder,
        })),
      });

      return {
        success: true,
        message: `组图「${group.name}」已创建，共 ${group.stickersCount} 张`,
        data: {
          groupId: group.id,
          name: group.name,
          stickerIds,
          stickersCount: group.stickersCount,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        message: `创建组图失败: ${error?.message || "未知错误"}`,
      };
    }
  },
});
