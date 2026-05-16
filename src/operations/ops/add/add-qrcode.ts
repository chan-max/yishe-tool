import { registerOperation } from "../../registry";

registerOperation({
  id: "canvas.addQrcode",
  name: "添加二维码",
  description: "向画布添加一个二维码元素，可设置内容、颜色、尺寸等",
  group: "添加元素",
  params: [
    {
      name: "content",
      label: "二维码内容",
      type: "string",
      required: true,
      placeholder: "https://example.com",
      description: "二维码的内容（URL 或文本）",
    },
    {
      name: "qrCodeColor",
      label: "二维码颜色",
      type: "color",
      default: "#6900ff",
      description: "二维码的点阵颜色",
    },
    {
      name: "backgroundColor",
      label: "背景颜色",
      type: "color",
      default: "#000000",
      description: "二维码背景颜色",
    },
    {
      name: "width",
      label: "宽度",
      type: "number",
      default: 100,
      min: 10,
      max: 2000,
      description: "二维码宽度（px）",
    },
    {
      name: "height",
      label: "高度",
      type: "number",
      default: 100,
      min: 10,
      max: 2000,
      description: "二维码高度（px）",
    },
    {
      name: "dotType",
      label: "点样式",
      type: "select",
      default: "sequare",
      options: [
        { label: "方形", value: "sequare" },
        { label: "圆点", value: "dots" },
        { label: "圆角方形", value: "rounded" },
        { label: "类星型", value: "extra-rounded" },
        { label: "类方形", value: "classy" },
        { label: "圆角类方形", value: "classy-rounded" },
      ],
      description: "二维码点阵样式",
    },
    {
      name: "errorCorrectionLevel",
      label: "容错等级",
      type: "select",
      default: "H",
      options: [
        { label: "低 (7%)", value: "L" },
        { label: "中 (15%)", value: "M" },
        { label: "较高 (25%)", value: "Q" },
        { label: "最高 (30%)", value: "H" },
      ],
      description: "二维码容错级别，越高越容易识别但密度越大",
    },
    {
      name: "center",
      label: "居中",
      type: "boolean",
      default: true,
      description: "是否在画布中居中",
    },
  ],
  execute(params, ctx) {
    const {
      content,
      qrCodeColor,
      backgroundColor,
      width,
      height,
      dotType,
      errorCorrectionLevel,
      center,
    } = params;

    const extraOptions: Record<string, any> = {};

    if (content !== undefined) extraOptions.qrcodeContent = content;
    if (qrCodeColor !== undefined)
      extraOptions.qrCodeColor = { color: qrCodeColor, type: "pure" };
    if (backgroundColor !== undefined) {
      const isGradient = backgroundColor.includes("gradient");
      extraOptions.backgroundColor = {
        color: backgroundColor,
        type: isGradient ? "gradient" : "pure",
      };
    }
    if (width !== undefined) extraOptions.width = { value: width, unit: "px" };
    if (height !== undefined)
      extraOptions.height = { value: height, unit: "px" };
    if (dotType !== undefined) extraOptions.qrcodeDotType = dotType;
    if (errorCorrectionLevel !== undefined)
      extraOptions.errorCorrectionLevel = errorCorrectionLevel;

    if (center !== undefined) {
      extraOptions.position = {
        center,
        verticalCenter: center,
        horizontalCenter: center,
        top: { value: 0, unit: "px" },
        left: { value: 0, unit: "px" },
        bottom: { value: 0, unit: "px" },
        right: { value: 0, unit: "px" },
      };
    }

    const id = ctx.addCanvasChild("qrcode", extraOptions);
    return {
      success: true,
      message: `已添加二维码元素，内容: ${content}`,
      data: { id, type: "qrcode" },
    };
  },
});
