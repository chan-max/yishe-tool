import { registerOperation } from "../registry";

registerOperation({
  id: "canvas.setBackgroundColor",
  name: "设置背景颜色",
  description:
    "设置画布背景颜色。支持 #hex、rgb()、rgba()、linear-gradient() 等 CSS 颜色。推荐用渐变色（如 linear-gradient(135deg,#667eea,#764ba2)）做背景更美观。禁止用纯黑 #000000 和纯白 #ffffff。",
  group: "画布",
  params: [
    {
      name: "color",
      label: "颜色",
      type: "color",
      required: true,
      placeholder: "#ff0000 或 rgba(255,0,0,0.5)",
      description: "CSS 颜色值",
    },
  ],
  execute(params, ctx) {
    const { color } = params;
    ctx.setCanvasBackgroundColor(color);
    return { success: true, message: `背景已设置为 ${color}`, data: { color } };
  },
});
