import { registerOperation } from "../registry";

registerOperation({
  id: "element.setBackgroundColor",
  name: "设置元素背景色",
  description:
    "设置元素背景颜色，支持 #hex、rgb、linear-gradient 等 CSS 颜色。适用于 rect、ellipse、text 等形状元素。禁止纯黑 #000000 和纯白 #ffffff。",
  group: "样式",
  params: [
    {
      name: "id",
      label: "元素 ID",
      type: "string",
      required: true,
      placeholder: "元素 ID",
      description: "目标元素的唯一标识符",
    },
    {
      name: "color",
      label: "背景颜色",
      type: "color",
      required: true,
      placeholder: "#ff0000",
      description: "背景颜色（CSS 颜色格式）",
    },
  ],
  execute(params, ctx) {
    const { id, color } = params;
    const child = ctx.findChildById(id);
    if (!child) {
      return { success: false, message: `未找到 ID 为 ${id} 的元素` };
    }

    // 根据元素类型设置不同的属性
    if (child.type === "rect" || child.type === "ellipse") {
      ctx.setChildProperty(id, "fill", color);
    } else if (child.type === "text") {
      // 文字元素的背景色
      ctx.setChildProperty(id, "backgroundColor", color);
    } else {
      // 通用背景色
      ctx.setChildProperty(id, "backgroundColor", color);
    }

    const childType = child.type || "unknown";
    return {
      success: true,
      message: `已设置 ${childType} 元素 (${id}) 背景色: ${color}`,
      data: { id, type: childType, color },
    };
  },
});
