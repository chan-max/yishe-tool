import { registerOperation } from "../registry";
import {
  applyCanvasBaseFontSize,
  type CanvasTypographyDensity,
} from "../canvas-typography";

registerOperation({
  id: "canvas.setSize",
  name: "设置画布尺寸",
  description:
    '设置画布尺寸，并同步适合 HTML/em 排版的画布基础字号。推荐用 canvas.smartSize 通过自然语言设置尺寸（如 "T恤前胸" "A3海报"）。',
  group: "画布",
  params: [
    {
      name: "width",
      label: "宽度",
      type: "number",
      required: true,
      description: "画布宽度",
      min: 10,
      max: 20000,
    },
    {
      name: "height",
      label: "高度",
      type: "number",
      required: true,
      description: "画布高度",
      min: 10,
      max: 20000,
    },
    {
      name: "unit",
      label: "单位",
      type: "select",
      required: false,
      default: "px",
      description: "尺寸单位",
      options: [
        { label: "px (像素)", value: "px" },
        { label: "mm (毫米)", value: "mm" },
        { label: "cm (厘米)", value: "cm" },
        { label: "in (英寸)", value: "in" },
      ],
    },
    {
      name: "typographyDensity",
      label: "排版密度",
      type: "select",
      default: "balanced",
      options: [
        { label: "密集长文", value: "dense" },
        { label: "标准排版", value: "balanced" },
        { label: "标题展示", value: "display" },
      ],
      description:
        "兰亭序、碑帖、长文选 dense；常规海报选 balanced；单字、标语、艺术字选 display。",
    },
    {
      name: "baseFontSize",
      label: "画布基础字号",
      type: "number",
      min: 4,
      max: 500,
      description:
        "可选的明确基础字号（px）；通常不传，由画布短边和排版密度自动计算。",
    },
  ],
  execute(params, ctx) {
    const {
      width,
      height,
      unit = "px",
      typographyDensity = "balanced",
      baseFontSize,
    } = params;
    const current = ctx.getCanvasSize();
    ctx.setCanvasSize(width, height, unit);
    const typography = applyCanvasBaseFontSize(ctx, {
      width,
      height,
      unit,
      density: typographyDensity as CanvasTypographyDensity,
      fontSize: baseFontSize,
    });
    return {
      success: true,
      message: `画布尺寸已从 ${current.width}×${current.height} ${current.unit} 设置为 ${width}×${height} ${unit}；基础字号 ${typography.baseFontSize}px（${typography.typographyDensityLabel}）`,
      data: { width, height, unit, ...typography },
    };
  },
});
