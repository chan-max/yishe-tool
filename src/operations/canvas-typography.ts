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

export type CanvasTypographyRole =
  | "hero"
  | "title"
  | "primaryText"
  | "subtitle"
  | "body"
  | "caption"
  | "micro";

export type CanvasTypographyPixelScale = Record<CanvasTypographyRole, number>;

interface CanvasTypographyProfile {
  ratios: Record<CanvasTypographyRole, number>;
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

const TYPOGRAPHY_PROFILES: Record<CanvasTypographyDensity, CanvasTypographyProfile> = {
  dense: {
    ratios: {
      hero: 0.09,
      title: 0.065,
      primaryText: 0.052,
      subtitle: 0.044,
      body: 0.038,
      caption: 0.032,
      micro: 0.028,
    },
    heroLineHeight: 0.95,
    bodyLineHeight: 1.75,
  },
  balanced: {
    ratios: {
      hero: 0.15,
      title: 0.095,
      primaryText: 0.07,
      subtitle: 0.055,
      body: 0.05,
      caption: 0.045,
      micro: 0.04,
    },
    heroLineHeight: 0.95,
    bodyLineHeight: 1.55,
  },
  display: {
    ratios: {
      hero: 0.22,
      title: 0.14,
      primaryText: 0.09,
      subtitle: 0.065,
      body: 0.05,
      caption: 0.042,
      micro: 0.036,
    },
    heroLineHeight: 0.88,
    bodyLineHeight: 1.45,
  },
};

const TYPOGRAPHY_MINIMUMS: Record<CanvasTypographyRole, number> = {
  hero: 24,
  title: 20,
  primaryText: 18,
  subtitle: 16,
  body: 14,
  caption: 12,
  micro: 12,
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
  const pixelScale = buildCanvasTypographyPixelScale(width, height, density);
  const recommendedBaseFontSize = recommendCanvasBaseFontSize(width, height, "px", density);
  const profile = TYPOGRAPHY_PROFILES[density];
  const toEm = (role: CanvasTypographyRole) =>
    formatEm(pixelScale[role] / recommendedBaseFontSize);

  return {
    hero: toEm("hero"),
    title: toEm("title"),
    primaryText: toEm("primaryText"),
    subtitle: toEm("subtitle"),
    body: toEm("body"),
    caption: toEm("caption"),
    micro: toEm("micro"),
    heroLineHeight: profile.heroLineHeight,
    bodyLineHeight: profile.bodyLineHeight,
  };
}

export function buildCanvasTypographyPixelScale(
  width: number,
  height: number,
  density: CanvasTypographyDensity,
  scaleFactor = 1,
): CanvasTypographyPixelScale {
  const shortSide = Math.max(1, Math.min(width, height));
  const aspectRatio = width > 0 && height > 0 ? width / height : 1;
  const heroAspectMultiplier =
    aspectRatio >= 2 ? 1.08 : aspectRatio <= 0.7 ? 0.9 : 1;
  const ratios = TYPOGRAPHY_PROFILES[density].ratios;

  return Object.fromEntries(
    (Object.keys(ratios) as CanvasTypographyRole[]).map((role) => {
      const roleSize = Math.max(TYPOGRAPHY_MINIMUMS[role], shortSide * ratios[role]);
      const aspectMultiplier = role === "hero" ? heroAspectMultiplier : 1;
      return [role, Math.round(roleSize * aspectMultiplier * scaleFactor)];
    }),
  ) as CanvasTypographyPixelScale;
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

export function resolveCanvasTypography(options: {
  width: number;
  height: number;
  unit?: string;
  density?: CanvasTypographyDensity;
  fontSize?: number;
}) {
  const density: CanvasTypographyDensity =
    options.density && options.density in TYPOGRAPHY_PROFILES
      ? options.density
      : "balanced";
  const unit = options.unit || "px";
  const cssPixelRatio = UNIT_TO_CSS_PX[unit] || 1;
  const widthInCssPixels = Math.max(1, options.width * cssPixelRatio);
  const heightInCssPixels = Math.max(1, options.height * cssPixelRatio);
  const recommendedBaseFontSize = recommendCanvasBaseFontSize(
    options.width,
    options.height,
    unit,
    density,
  );
  const baseFontSize = resolveCanvasBaseFontSize(
    options.width,
    options.height,
    unit,
    density,
    options.fontSize,
  );
  const typeScale = buildCanvasTypographyScale(
    widthInCssPixels,
    heightInCssPixels,
    density,
  );
  const typeScalePx = buildCanvasTypographyPixelScale(
    widthInCssPixels,
    heightInCssPixels,
    density,
    baseFontSize / recommendedBaseFontSize,
  );

  return {
    baseFontSize,
    baseFontUnit: "px",
    typographyDensity: density,
    typographyDensityLabel: CANVAS_TYPOGRAPHY_LABELS[density],
    typeScale,
    typeScalePx,
    minimumReadableFontSize: typeScalePx.micro,
    emScale: {
      displayTitle: typeScale.hero,
      title: typeScale.title,
      subtitle: typeScale.subtitle,
      body: typeScale.body,
      caption: typeScale.caption,
    },
  };
}

export function resolveCanvasTypographyFromContext(ctx: OperationContext) {
  const size = ctx.getCanvasSize();
  const canvas = ctx
    .getCanvasChildren()
    .find((child: any) => child.type === "canvas");
  const rawFontSize = canvas?.fontSize;
  const fontSize =
    typeof rawFontSize === "object" ? Number(rawFontSize.value) : Number(rawFontSize);
  const density = ["dense", "balanced", "display"].includes(canvas?.typographyDensity)
    ? (canvas.typographyDensity as CanvasTypographyDensity)
    : "balanced";

  return resolveCanvasTypography({
    ...size,
    density,
    fontSize: Number.isFinite(fontSize) && fontSize > 0 ? fontSize : undefined,
  });
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
  const typography = resolveCanvasTypography({ ...options, density });
  const canvas = ctx
    .getCanvasChildren()
    .find((child: any) => child.type === "canvas");

  if (canvas?.id) {
    ctx.setChildProperty(canvas.id, "fontSize", {
      value: typography.baseFontSize,
      unit: "px",
    });
    ctx.setChildProperty(canvas.id, "typographyDensity", density);
  }

  return typography;
}
