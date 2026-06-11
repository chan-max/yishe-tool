import { registerOperation } from "../registry";

registerOperation({
  id: "element.setTextColor",
  name: "设置文字颜色",
  description:
    "设置文字元素的颜色。仅对 text 类型元素有效，HTML 元素请用 canvas.addChild 的 htmlContent 直接设置 color。",
  group: "文字",
  params: [
    {
      name: "id",
      label: "元素 ID",
      type: "string",
      required: true,
      placeholder: "文字元素的 ID",
    },
    {
      name: "color",
      label: "颜色",
      type: "color",
      required: true,
      placeholder: "#ff0000",
    },
  ],
  execute(params, ctx) {
    const { id, color } = params;
    const child = ctx.findChildById(id);
    if (!child) return { success: false, message: `未找到 ID 为 ${id} 的元素` };
    if (child.type !== "text")
      return { success: false, message: `元素 ${id} 不是文字类型` };
    ctx.setChildProperty(id, "fontColor", color);
    return {
      success: true,
      message: `已将文字颜色设置为 ${color}`,
      data: { id, color },
    };
  },
});

registerOperation({
  id: "element.setTextFontSize",
  name: "设置文字字号",
  description:
    "设置文字元素的字号。仅对 text 类型有效。推荐：标题 200-400px，副标题 120-200px，正文 80-140px，注释 60-80px。",
  group: "文字",
  params: [
    {
      name: "id",
      label: "元素 ID",
      type: "string",
      required: true,
      placeholder: "文字元素的 ID",
    },
    {
      name: "fontSize",
      label: "字号",
      type: "number",
      required: true,
      min: 1,
      max: 2000,
      placeholder: "160",
    },
  ],
  execute(params, ctx) {
    const { id, fontSize } = params;
    const child = ctx.findChildById(id);
    if (!child) return { success: false, message: `未找到 ID 为 ${id} 的元素` };
    if (child.type !== "text")
      return { success: false, message: `元素 ${id} 不是文字类型` };
    ctx.setChildProperty(id, "fontSize", fontSize);
    return {
      success: true,
      message: `已将字号设置为 ${fontSize}`,
      data: { id, fontSize },
    };
  },
});

registerOperation({
  id: "element.setTextFontWeight",
  name: "设置文字粗细",
  description:
    "设置文字粗细。仅对 text 类型有效。标题推荐 700-900，正文推荐 400-500。",
  group: "文字",
  params: [
    {
      name: "id",
      label: "元素 ID",
      type: "string",
      required: true,
      placeholder: "文字元素的 ID",
    },
    {
      name: "fontWeight",
      label: "粗细",
      type: "select",
      required: true,
      options: [
        { label: "正常", value: "normal" },
        { label: "加粗", value: "bold" },
        { label: "100", value: "100" },
        { label: "200", value: "200" },
        { label: "300", value: "300" },
        { label: "400", value: "400" },
        { label: "500", value: "500" },
        { label: "600", value: "600" },
        { label: "700", value: "700" },
        { label: "800", value: "800" },
        { label: "900", value: "900" },
      ],
    },
  ],
  execute(params, ctx) {
    const { id, fontWeight } = params;
    const child = ctx.findChildById(id);
    if (!child) return { success: false, message: `未找到 ID 为 ${id} 的元素` };
    if (child.type !== "text")
      return { success: false, message: `元素 ${id} 不是文字类型` };
    ctx.setChildProperty(id, "fontWeight", fontWeight);
    return {
      success: true,
      message: `已将文字粗细设置为 ${fontWeight}`,
      data: { id, fontWeight },
    };
  },
});
