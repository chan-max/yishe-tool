export interface ImageSearchAttempt {
  strategy: "exact" | "relaxed" | "simplified" | "broad";
  params: Record<string, any>;
}

const STYLE_TOKENS = new Set([
  "复古",
  "高级",
  "好看",
  "素材",
  "图片",
  "插画",
  "透明背景",
  "vintage",
  "retro",
  "image",
  "sticker",
  "illustration",
  "transparent",
  "background",
  "line",
  "art",
]);

const FILTER_KEYS = [
  "aspectRatio",
  "aspectRatioTolerance",
  "minWidth",
  "maxWidth",
  "minHeight",
  "maxHeight",
];

function cleanParams(params: Record<string, any>): Record<string, any> {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined),
  );
}

function removeFilters(params: Record<string, any>): Record<string, any> {
  const next = { ...params };
  for (const key of FILTER_KEYS) delete next[key];
  return next;
}

export function simplifyImageSearchQuery(query: unknown): string {
  const tokens = String(query || "")
    .split(/[\s,，。！？、；：:;.!?()（）【】[\]{}<>《》"']+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 2 && token.length <= 12)
    .filter((token) => !STYLE_TOKENS.has(token.toLowerCase()));

  return Array.from(new Set(tokens)).slice(0, 4).join(" ");
}

export function buildImageSearchAttempts(
  params: Record<string, any>,
): ImageSearchAttempt[] {
  const exact = cleanParams(params);
  const relaxed = removeFilters(exact);
  const simplifiedQuery = simplifyImageSearchQuery(exact.query) || exact.query;
  const simplified: Record<string, any> = {
    ...relaxed,
    query: simplifiedQuery,
  };
  const broad: Record<string, any> = { ...simplified };
  delete broad.isCutout;
  delete broad.isCustom;

  const candidates: ImageSearchAttempt[] = [
    { strategy: "exact", params: exact },
    { strategy: "relaxed", params: relaxed },
    { strategy: "simplified", params: simplified },
    { strategy: "broad", params: broad },
  ];
  const seen = new Set<string>();

  return candidates.filter((attempt) => {
    const key = JSON.stringify(attempt.params);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
