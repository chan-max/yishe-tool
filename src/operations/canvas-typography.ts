import type { OperationContext } from "./types";

export type CanvasTypographyDensity = "dense" | "balanced" | "display";

export interface CanvasTypographyScale {
  hero: string;
  title: string;
  primaryText: string;
  subtitle: string;
  body: string;
  caption: string;
  micro: string;
  heroLineHeight: number;
  bodyLineHeight: number;
}

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
  const quotedContentLength = Array.from(
    text.matchAll(/[“\"']([^”\"']+)[”\"']/g),
  ).reduce((total, match) => total + String(match[1] || "").length, 0);

  if (
    quotedContentLength >= 100 ||
    /兰亭序|全文|长文|正文|篇章|段落|多行|密集|排满|手卷|碑帖|经文|目录|信息图|书法作品模拟|包装标签|产品参数|规格信息|成分表|菜单|价目表|日程|数据看板|二维码|条形码/i.test(
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

function formatEm(value: number): string {
  return `${Number(value.toFixed(2))}em`;
}

export function buildCanvasTypographyScale(
  width: number,
  height: number,
  density: CanvasTypographyDensity,
): CanvasTypographyScale {
  const aspectRatio = width > 0 && height > 0 ? width / height : 1;
  const heroAspectMultiplier =
    aspectRatio >= 2 ? 1.08 : aspectRatio <= 0.7 ? 0.9 : 1;

  const profiles: Record<
    CanvasTypographyDensity,
    Omit<CanvasTypographyScale, "hero"> & { heroBase: number }
  > = {
    dense: {
      heroBase: 5.5,
      title: "3.8em",
      primaryText: "2.6em",
      subtitle: "1.8em",
      body: "1.25em",
      caption: "0.85em",
      micro: "0.7em",
      heroLineHeight: 0.95,
      bodyLineHeight: 1.75,
    },
    balanced: {
      heroBase: 9,
      title: "5.5em",
      primaryText: "3em",
      subtitle: "2.4em",
      body: "1.5em",
      caption: "0.9em",
      micro: "0.72em",
      heroLineHeight: 0.95,
      bodyLineHeight: 1.55,
    },
    display: {
      heroBase: 13,
      title: "7.5em",
      primaryText: "4em",
      subtitle: "2.8em",
      body: "1.4em",
      caption: "0.9em",
      micro: "0.72em",
      heroLineHeight: 0.88,
      bodyLineHeight: 1.45,
    },
  };

  const profile = profiles[density];
  return {
    hero: formatEm(profile.heroBase * heroAspectMultiplier),
    title: profile.title,
    primaryText: profile.primaryText,
    subtitle: profile.subtitle,
    body: profile.body,
    caption: profile.caption,
    micro: profile.micro,
    heroLineHeight: profile.heroLineHeight,
    bodyLineHeight: profile.bodyLineHeight,
  };
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

  const typeScale = buildCanvasTypographyScale(
    options.width,
    options.height,
    density,
  );

  return {
    baseFontSize: fontSize,
    baseFontUnit: "px",
    typographyDensity: density,
    typographyDensityLabel: CANVAS_TYPOGRAPHY_LABELS[density],
    typeScale,
    emScale: {
      displayTitle: typeScale.hero,
      title: typeScale.title,
      subtitle: typeScale.subtitle,
      body: typeScale.body,
      caption: typeScale.caption,
    },
  };
}
