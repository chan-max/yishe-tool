import type { OperationContext } from "./types";

export type CanvasTypographyDensity = "dense" | "balanced" | "display";

const DENSITY_RATIOS: Record<CanvasTypographyDensity, number> = {
  dense: 0.012,
  balanced: 0.016,
  display: 0.02,
};

const UNIT_TO_CSS_PX: Record<string, number> = {
  px: 1,
  mm: 96 / 25.4,
  cm: 96 / 2.54,
  in: 96,
};

export const CANVAS_TYPOGRAPHY_LABELS: Record<CanvasTypographyDensity, string> =
  {
    dense: "密集长文",
    balanced: "标准排版",
    display: "标题展示",
  };

export function inferCanvasTypographyDensity(
  description: string,
): CanvasTypographyDensity {
  const text = String(description || "");

  if (
    /兰亭序|全文|长文|正文|篇章|段落|多行|密集|排满|手卷|碑帖|经文|目录|信息图|书法作品模拟/i.test(
      text,
    )
  ) {
    return "dense";
  }

  if (
    /大字|单字|短句|标语|slogan|logo|艺术字|标题为主|极简|大留白|主视觉文字/i.test(
      text,
    )
  ) {
    return "display";
  }

  return "balanced";
}

export function recommendCanvasBaseFontSize(
  width: number,
  height: number,
  unit = "px",
  density: CanvasTypographyDensity = "balanced",
): number {
  const cssPixelRatio = UNIT_TO_CSS_PX[unit] || 1;
  const shortSideInCssPixels = Math.min(width, height) * cssPixelRatio;
  const recommended = shortSideInCssPixels * DENSITY_RATIOS[density];
  return Math.max(12, Math.min(160, Math.round(recommended)));
}

export function resolveCanvasBaseFontSize(
  width: number,
  height: number,
  unit: string,
  density: CanvasTypographyDensity,
  explicitFontSize?: number,
): number {
  if (Number.isFinite(explicitFontSize) && Number(explicitFontSize) > 0) {
    return Math.max(4, Math.min(500, Math.round(Number(explicitFontSize))));
  }
  return recommendCanvasBaseFontSize(width, height, unit, density);
}

export function applyCanvasBaseFontSize(
  ctx: OperationContext,
  options: {
    width: number;
    height: number;
    unit?: string;
    density?: CanvasTypographyDensity;
    fontSize?: number;
  },
) {
  const density = options.density || "balanced";
  const fontSize = resolveCanvasBaseFontSize(
    options.width,
    options.height,
    options.unit || "px",
    density,
    options.fontSize,
  );
  const canvas = ctx
    .getCanvasChildren()
    .find((child: any) => child.type === "canvas");

  if (canvas?.id) {
    ctx.setChildProperty(canvas.id, "fontSize", {
      value: fontSize,
      unit: "px",
    });
  }

  return {
    baseFontSize: fontSize,
    baseFontUnit: "px",
    typographyDensity: density,
    typographyDensityLabel: CANVAS_TYPOGRAPHY_LABELS[density],
    emScale: {
      displayTitle: "8-14em",
      title: "5-8em",
      subtitle: "2.5-4em",
      body: "1.5-2.5em",
      caption: "0.8-1.2em",
    },
  };
}
