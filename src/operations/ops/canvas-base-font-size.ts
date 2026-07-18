import { registerOperation } from "../registry";
import {
  applyCanvasBaseFontSize,
  type CanvasTypographyDensity,
} from "../canvas-typography";

registerOperation({
  id: "canvas.setBaseFontSize",
  name: "设置画布基础字号",
  description:
    "设置 HTML 设计继承的画布基础字号。未传 fontSize 时按画布短边和内容密度自动计算；后续 HTML 文字优先用 em 定义层级。",
  group: "画布",
  params: [
    {
      name: "fontSize",
      label: "基础字号",
      type: "number",
      min: 4,
      max: 500,
      description:
        "可选的明确基础字号（px）。不传则自动计算：密集长文约短边 1.2%，标准排版约 1.6%，标题展示约 2%。",
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
  ],
  execute(params, ctx) {
    const size = ctx.getCanvasSize();
    const typography = applyCanvasBaseFontSize(ctx, {
      ...size,
      density: params.typographyDensity as CanvasTypographyDensity,
      fontSize: params.fontSize,
    });

    return {
      success: true,
      message: `画布基础字号已设置为 ${typography.baseFontSize}px（${typography.typographyDensityLabel}）。HTML 相对字号：主视觉 ${typography.typeScale.hero}、主标题 ${typography.typeScale.title}、核心文字 ${typography.typeScale.primaryText}、副标题 ${typography.typeScale.subtitle}、正文 ${typography.typeScale.body}、说明 ${typography.typeScale.caption}。`,
      data: typography,
    };
  },
});
