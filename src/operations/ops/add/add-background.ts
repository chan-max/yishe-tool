import { registerOperation } from "../../registry";

registerOperation({
  id: "canvas.addBackground",
  name: "添加背景",
  description: "向画布添加一个背景元素，可设置背景颜色",
  group: "添加元素",
  params: [
    {
      name: "backgroundColor",
      label: "背景颜色",
      type: "color",
      default: "#000000",
      description: "背景颜色",
    },
    {
      name: "width",
      label: "宽度",
      type: "number",
      default: 100,
      min: 1,
      max: 10000,
      description: "宽度（vw 百分比，100=满画布宽度）",
    },
    {
      name: "height",
      label: "高度",
      type: "number",
      default: 100,
      min: 1,
      max: 10000,
      description: "高度（vh 百分比，100=满画布高度）",
    },
  ],
  execute(params, ctx) {
    const { backgroundColor, width, height } = params;

    const extraOptions: Record<string, any> = {};

    if (backgroundColor !== undefined) {
      const isGradient = backgroundColor.includes("gradient");
      extraOptions.backgroundColor = {
        color: backgroundColor,
        type: isGradient ? "gradient" : "pure",
      };
    }
    if (width !== undefined) {
      extraOptions.width = { value: width, unit: "vw" };
    }
    if (height !== undefined) {
      extraOptions.height = { value: height, unit: "vh" };
    }

    const id = ctx.addCanvasChild("background", extraOptions);
    return {
      success: true,
      message: `已添加背景元素，颜色 ${backgroundColor || "#000"}`,
      data: { id, type: "background" },
    };
  },
});
