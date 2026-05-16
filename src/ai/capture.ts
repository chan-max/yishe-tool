import { currentCanvasControllerInstance } from "@/components/design/layout/canvas";

/**
 * 截取当前画布为 base64 图片
 * 会先强制更新贴纸渲染，确保截图是最新的
 */
export async function captureCanvasForAI(): Promise<string> {
  const controller = currentCanvasControllerInstance.value;
  if (!controller) {
    throw new Error("画布控制器未初始化");
  }

  // 强制更新贴纸渲染
  await controller.activeUpdateRenderingCanvas();

  // 等待一帧确保渲染完成
  await new Promise((resolve) => requestAnimationFrame(resolve));

  const canvasEl = controller.canvasEl;
  if (!canvasEl) {
    throw new Error("画布元素不存在");
  }

  // 截图为 base64
  const base64 = canvasEl.toDataURL("image/png");
  if (!base64 || base64 === "data:,") {
    throw new Error("画布截图失败");
  }

  return base64;
}

/**
 * 获取画布状态摘要（文字描述）
 */
export function getCanvasStateSummary(): string {
  const controller = currentCanvasControllerInstance.value;
  if (!controller) {
    return "画布未初始化";
  }

  const options = controller.options;
  if (!options) {
    return "画布配置为空";
  }

  const children = options.children || [];
  const mainCanvas = children[0];
  const elements = children.slice(1);

  const lines = [
    `画布尺寸: ${mainCanvas?.width || "?"} x ${mainCanvas?.height || "?"}`,
    `元素数量: ${elements.length}`,
    "",
  ];

  if (elements.length > 0) {
    lines.push("元素列表:");
    elements.forEach((el: any, i: number) => {
      const desc = getElementBriefDescription(el);
      lines.push(`  ${i + 1}. [${el.type}] ${desc}`);
    });
  } else {
    lines.push("画布为空，没有元素");
  }

  return lines.join("\n");
}

/**
 * 获取元素简要描述
 */
function getElementBriefDescription(el: any): string {
  switch (el.type) {
    case "text":
      return `文字: "${(el.textContent || "").slice(0, 20)}"`;
    case "image":
      return `图片: ${el.src ? "有" : "无"}`;
    case "rect":
      return `矩形: ${el.fill || "无填充"}`;
    case "ellipse":
      return `椭圆: ${el.fill || "无填充"}`;
    case "qrcode":
      return `二维码`;
    case "barcode":
      return `条形码`;
    case "math":
      return `公式: "${(el.formula || "").slice(0, 20)}"`;
    case "mermaid":
      return `流程图`;
    case "codeBlock":
      return `代码块: ${el.language || "?"}`;
    case "molecule":
      return `分子: ${(el.source || "").slice(0, 15)}`;
    case "threeMol":
      return `3D分子`;
    case "figlet":
      return `ASCII字: "${(el.text || "").slice(0, 10)}"`;
    case "chartjs":
    case "apexChart":
    case "plotlyChart":
      return `图表`;
    default:
      return el.type;
  }
}
