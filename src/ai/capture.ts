import {
  currentCanvasControllerInstance,
  renderingLoading,
} from "@/components/design/layout/canvas";
import { nextTick } from "vue";

function waitForAnimationFrame(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof requestAnimationFrame === "function") {
      requestAnimationFrame(() => resolve());
      return;
    }
    setTimeout(resolve, 16);
  });
}

/**
 * 等待画布渲染完成
 */
async function waitForRender(
  controller: any,
  timeout = 15_000,
  rejectOnTimeout = false,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const check = () => {
      if (!controller.loading.value && !renderingLoading.value) {
        resolve();
        return;
      }
      if (Date.now() - startTime > timeout) {
        const message = `[AI Capture] 等待渲染超时 (${timeout}ms)`;
        console.warn(message);
        if (rejectOnTimeout) {
          reject(new Error(message));
          return;
        }
        resolve();
        return;
      }
      setTimeout(check, 50);
    };
    check();
  });
}

export async function renderCurrentCanvasNow(
  options: { timeoutMs?: number } = {},
) {
  const controller = currentCanvasControllerInstance.value;
  if (!controller) {
    throw new Error("画布控制器未初始化");
  }

  const timeoutMs = options.timeoutMs ?? 15_000;

  await nextTick();
  await waitForAnimationFrame();
  await waitForAnimationFrame();

  if (typeof controller.updateRenderingCanvasJob === "function") {
    controller.loading.value = true;
    renderingLoading.value = true;
    await Promise.race([
      Promise.resolve(controller.updateRenderingCanvasJob()),
      new Promise<never>((_, reject) => {
        setTimeout(
          () => reject(new Error(`画布渲染超时 (${timeoutMs}ms)`)),
          timeoutMs,
        );
      }),
    ]);
  } else {
    await controller.activeUpdateRenderingCanvas();
    await waitForRender(controller, timeoutMs, true);
  }

  await waitForRender(controller, timeoutMs, true);
  if (controller.shouldUpdateCanvasSticker?.value) {
    throw new Error("画布渲染未完成或渲染失败，已阻止使用旧画面");
  }
  await nextTick();
  await waitForAnimationFrame();

  return controller;
}

/**
 * 截取当前画布为 base64 图片
 * 会先强制更新贴纸渲染，确保截图是最新的
 */
export async function captureCanvasForAI(): Promise<string> {
  const controller = await renderCurrentCanvasNow();

  const canvasEl = controller.canvasEl;
  if (!canvasEl) {
    throw new Error("画布元素不存在");
  }

  // 检查 canvas 尺寸
  if (canvasEl.width === 0 || canvasEl.height === 0) {
    throw new Error("画布尺寸为 0，无法截图");
  }

  try {
    // 截图为 base64
    const base64 = canvasEl.toDataURL("image/png");
    if (!base64 || base64 === "data:," || base64.length < 100) {
      throw new Error("画布截图数据为空");
    }

    console.log(
      "[AI Capture] 截图成功，大小:",
      Math.round(base64.length / 1024),
      "KB",
    );
    return base64;
  } catch (err: any) {
    // 如果 toDataURL 失败，可能是 canvas 被污染
    console.error("[AI Capture] 截图失败:", err);
    throw new Error(`画布截图失败: ${err?.message || "未知错误"}`);
  }
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
