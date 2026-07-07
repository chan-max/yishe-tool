import { registerOperation } from "../registry";
import { getFontById } from "@/api";
import { fetchFontFace } from "@/components/design/layout/canvas/operate/fontFamily/index.ts";

registerOperation({
  id: "canvas.loadFont",
  name: "加载字体到画布",
  description: `从素材库加载一个或多个字体到画布，使其可通过 font_xxx 的 font-family 名称使用。

支持两种调用方式：
1. 单个加载：fontId 传字符串，如 canvas.loadFont({ fontId: "xxx" })
2. 批量加载：fontId 传数组，如 canvas.loadFont({ fontId: ["id_a", "id_b"] })

加载后，字体可通过 font-family: font_xxx 在 CSS 中使用。

配合 resource.searchFont 使用：先搜索字体库找到字体，获取 id，再用此工具加载。`,
  group: "字体",
  params: [
    {
      name: "fontId",
      label: "字体ID",
      type: "string",
      required: true,
      description: "字体ID，支持单个字符串或字符串数组。单个: \"xxx\"，多个: [\"id_a\", \"id_b\"]",
    },
  ],
  async execute(params, ctx) {
    const { fontId } = params;

    // 单个加载
    if (typeof fontId === "string") {
      return await loadSingleFont(fontId);
    }

    // 批量加载
    if (Array.isArray(fontId) && fontId.length > 0) {
      const results: any[] = [];
      const errors: string[] = [];

      for (const id of fontId) {
        const result = await loadSingleFont(id);
        if (result.success) {
          results.push(result.data);
        } else {
          errors.push(result.message);
        }
      }

      if (results.length === 0) {
        return {
          success: false,
          message: `所有字体加载失败：${errors.join("；")}`,
        };
      }

      const names = results.map((r: any) => `「${r.name || "未命名"}」`).join("、");

      return {
        success: true,
        message: `已加载 ${results.length} 个字体到画布：${names}`,
        data: {
          loaded: results,
          failed: errors.length > 0 ? errors : undefined,
          total: fontId.length,
          successCount: results.length,
        },
      };
    }

    return {
      success: false,
      message: "fontId 参数无效，请传入字符串或字符串数组",
    };
  },
});

async function loadSingleFont(fontId: string) {
  try {
    const font = await getFontById(fontId) as any;

    if (!font) {
      return {
        success: false,
        message: `未找到 ID 为 ${fontId} 的字体`,
      };
    }

    if (!font.url) {
      return {
        success: false,
        message: `字体「${font.name || "未命名"}」没有可用的资源地址`,
      };
    }

    await fetchFontFace({
      url: font.url,
      id: font.id,
      name: font.name,
    });

    return {
      success: true,
      message: `已加载字体「${font.name || "未命名"}」，可通过 font_${font.id} 使用`,
      data: {
        fontId: font.id,
        name: font.name,
        fontFamily: `font_${font.id}`,
        description: font.description,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: `字体加载失败：${error.message || "未知错误"}`,
    };
  }
}
