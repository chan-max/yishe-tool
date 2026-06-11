import { registerOperation } from "../registry";

registerOperation({
  id: "element.setBorder",
  name: "设置边框",
  description:
    "设置元素边框。常见用法：细边框(1-2px solid)、装饰边框(3-6px)、强调边框(配合主色)。HTML 元素通常用 CSS border 属性实现更灵活。",
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
      name: "borderWidth",
      label: "边框宽度",
      type: "number",
      required: true,
      min: 0,
      max: 100,
      placeholder: "2",
      description: "边框宽度（px），推荐 1-4px",
    },
    {
      name: "borderColor",
      label: "边框颜色",
      type: "color",
      required: true,
      placeholder: "#000000",
      description: "边框颜色",
    },
    {
      name: "borderStyle",
      label: "边框样式",
      type: "select",
      default: "solid",
      options: [
        { label: "实线", value: "solid" },
        { label: "虚线", value: "dashed" },
        { label: "点线", value: "dotted" },
        { label: "双线", value: "double" },
        { label: "无边框", value: "none" },
      ],
      description: "边框样式",
    },
  ],
  execute(params, ctx) {
    const { id, borderWidth, borderColor, borderStyle = "solid" } = params;
    const child = ctx.findChildById(id);
    if (!child) {
      return { success: false, message: `未找到 ID 为 ${id} 的元素` };
    }

    ctx.setChildProperty(id, "border", {
      width: borderWidth,
      color: borderColor,
      style: borderStyle,
    });

    const childType = child.type || "unknown";
    return {
      success: true,
      message: `已设置 ${childType} 元素 (${id}) 边框: ${borderWidth}px ${borderStyle} ${borderColor}`,
      data: { id, type: childType, borderWidth, borderColor, borderStyle },
    };
  },
});

registerOperation({
  id: "element.removeBorder",
  name: "移除边框",
  description: "移除元素的边框",
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
  ],
  execute(params, ctx) {
    const { id } = params;
    const child = ctx.findChildById(id);
    if (!child) {
      return { success: false, message: `未找到 ID 为 ${id} 的元素` };
    }

    ctx.setChildProperty(id, "border", null);

    return {
      success: true,
      message: `已移除元素 ${id} 的边框`,
      data: { id },
    };
  },
});
