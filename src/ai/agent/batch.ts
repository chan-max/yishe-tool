import { reactive, ref, watch } from "vue";
import { directChat } from "../direct-client";
import { designAgent } from "./simple";
import { evaluateCanvasVisual } from "../visual-evaluate";
import { executeAITool } from "../shared/execute-tool";
import { parseChatResponse } from "../shared/response-parser";
import { AI_TIMEOUTS, withTimeout } from "../shared/timeout";
import { websocketClient } from "@/services/websocketClient";
import {
  beginDesignTabTask,
  completeDesignTabTask,
} from "@/services/designTabStatus";

// ============ Types ============

export type BatchSaveMode = "auto" | "draft";
export type BatchFailureStrategy = "skip" | "stop" | "save_anyway";

export interface AutoBatchConfig {
  description: string;
  count: number;
  enableAnalysisOptimization?: boolean;
  style?: string;
  width?: number;
  height?: number;
  transparentBackground?: boolean;
  qualityThreshold?: number;
  maxRevisions?: number;
  saveMode?: BatchSaveMode;
  failureStrategy?: BatchFailureStrategy;
}

export interface StickerBrief {
  title: string;
  prompt: string;
  width: number;
  height: number;
  transparentBackground: boolean;
  resourceHints: string[];
  saveName: string;
  description: string;
  keywords: string[];
  qualityTarget: number;
}

export interface BatchItem {
  index: number;
  prompt: string;
  brief: StickerBrief;
  score: number | null;
  status:
    | "pending"
    | "designing"
    | "evaluating"
    | "revising"
    | "saving"
    | "done"
    | "failed"
    | "skipped";
  revisionCount: number;
  error?: string;
  savedUrl?: string;
  saveResult?: any;
}

export interface BatchProgress {
  status: "idle" | "preparing" | "running" | "paused" | "stopped" | "done";
  items: BatchItem[];
  current: number;
  config: AutoBatchConfig | null;
  error?: string;
  startedAt?: number;
  finishedAt?: number;
}

export interface BatchRuntimeSnapshot {
  status: BatchProgress["status"];
  current: number;
  total: number;
  completed: number;
  succeeded: number;
  failed: number;
  skipped: number;
  description: string;
  error?: string;
  startedAt?: number;
  finishedAt?: number;
  updatedAt: string;
  items: Array<{
    index: number;
    title: string;
    status: BatchItem["status"];
    score: number | null;
    revisionCount: number;
    error?: string;
    savedUrl?: string;
  }>;
}

interface NormalizedBatchConfig {
  style: string;
  description: string;
  count: number;
  width?: number;
  height?: number;
  transparentBackground: boolean;
  enableAnalysisOptimization: boolean;
  qualityThreshold: number;
  maxRevisions: number;
  saveMode: BatchSaveMode;
  failureStrategy: BatchFailureStrategy;
}

// ============ Shared State ============

export const batchProgress = reactive<BatchProgress>({
  status: "idle",
  items: [],
  current: 0,
  config: null,
});

const controlSignal = ref<"running" | "paused" | "stopped">("running");
let pauseResolve: (() => void) | null = null;

export function getBatchRuntimeSnapshot(): BatchRuntimeSnapshot {
  const terminal = new Set(["done", "failed", "skipped"]);
  return {
    status: batchProgress.status,
    current: batchProgress.current,
    total: batchProgress.items.length || batchProgress.config?.count || 0,
    completed: batchProgress.items.filter((item) => terminal.has(item.status))
      .length,
    succeeded: batchProgress.items.filter((item) => item.status === "done")
      .length,
    failed: batchProgress.items.filter((item) => item.status === "failed")
      .length,
    skipped: batchProgress.items.filter((item) => item.status === "skipped")
      .length,
    description: batchProgress.config?.description || "",
    error: batchProgress.error,
    startedAt: batchProgress.startedAt,
    finishedAt: batchProgress.finishedAt,
    updatedAt: new Date().toISOString(),
    items: batchProgress.items.map((item) => ({
      index: item.index,
      title: item.brief.title,
      status: item.status,
      score: item.score,
      revisionCount: item.revisionCount,
      error: item.error,
      savedUrl: item.savedUrl,
    })),
  };
}

watch(
  () => ({
    status: batchProgress.status,
    current: batchProgress.current,
    error: batchProgress.error,
    startedAt: batchProgress.startedAt,
    finishedAt: batchProgress.finishedAt,
    config: batchProgress.config,
    items: batchProgress.items.map((item) => ({
      status: item.status,
      score: item.score,
      revisionCount: item.revisionCount,
      error: item.error,
      savedUrl: item.savedUrl,
    })),
  }),
  () => websocketClient.setBatchProgress(getBatchRuntimeSnapshot()),
  { deep: true, immediate: true, flush: "post" },
);

function isStopped(signal = controlSignal): boolean {
  return signal.value === "stopped";
}

// ============ Config Helpers ============

function normalizeConfig(config: AutoBatchConfig): NormalizedBatchConfig {
  const description = config.description || "";
  const explicitSize = extractSize(description);
  const enableAnalysisOptimization = Boolean(config.enableAnalysisOptimization);

  return {
    style: config.style || "",
    description,
    count: clampNumber(config.count, 1, 100, 5),
    width: getOptionalSize(config.width, explicitSize?.width),
    height: getOptionalSize(config.height, explicitSize?.height),
    transparentBackground:
      Boolean(config.transparentBackground) ||
      shouldUseStickerBackground(description),
    enableAnalysisOptimization,
    qualityThreshold:
      config.qualityThreshold ?? inferQualityThreshold(description),
    maxRevisions: clampNumber(
      config.maxRevisions,
      0,
      3,
      enableAnalysisOptimization ? inferMaxRevisions(description) || 1 : 0,
    ),
    saveMode: "auto",
    failureStrategy: "save_anyway",
  };
}

function clampNumber(
  value: unknown,
  min: number,
  max: number,
  fallback: number,
): number {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, Math.round(n)));
}

function getOptionalSize(...values: unknown[]): number | undefined {
  for (const value of values) {
    const n = Number(value);
    if (Number.isFinite(n)) {
      return clampNumber(n, 128, 6000, 1024);
    }
  }
  return undefined;
}

function extractSize(text: string): { width: number; height: number } | null {
  const match = String(text || "").match(/(\d{3,5})\s*[x×*]\s*(\d{3,5})/i);
  if (!match) return null;
  return {
    width: clampNumber(match[1], 128, 6000, 1024),
    height: clampNumber(match[2], 128, 6000, 1024),
  };
}

function shouldUseStickerBackground(text: string): boolean {
  return /透明|抠图|白边|异形|贴纸化|die[-\s]?cut/i.test(text);
}

function inferQualityThreshold(text: string): number {
  const match = String(text || "").match(
    /(?:质量|评分|分数|门槛)[^\d]*(\d{1,2})/,
  );
  return clampNumber(match?.[1], 1, 10, 7);
}

function inferMaxRevisions(text: string): number {
  return /修订|优化|迭代|自检|合格|质量|评分|分数|门槛|revise|improve/i.test(
    text,
  )
    ? 1
    : 0;
}

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(/[,，、\n]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function truncateText(text: string, max = 80): string {
  const normalized = String(text || "")
    .replace(/\s+/g, " ")
    .trim();
  return normalized.length > max
    ? `${normalized.slice(0, max)}...`
    : normalized;
}

// ============ Brief Generation ============

async function generateBriefs(
  configInput: AutoBatchConfig,
): Promise<StickerBrief[]> {
  const config = normalizeConfig(configInput);

  let response: any;
  try {
    response = await directChat({
      messages: [
        {
          role: "system",
          content: `你是贴纸生产任务策划助手。根据用户的生产需求，生成一组可以逐张执行的结构化贴纸 brief。

输出必须是 JSON 数组，不要写 Markdown 或解释。数组里每项格式如下：
{
  "title": "短标题",
  "prompt": "给设计 agent 的完整自然语言需求",
  "width": 1024,
  "height": 1024,
  "transparentBackground": true,
  "resourceHints": ["素材或字体检索方向"],
  "saveName": "保存到素材库的名称",
  "description": "保存到素材库的简短描述",
  "keywords": ["关键词1", "关键词2"],
  "qualityTarget": 7
}

要求：
- 数量以本次传入的 count 为准，输出必须正好对应数量；如果用户文本里出现其他数量，以 count 为准。
- 从用户完整提示词里理解尺寸、风格、题材、是否透明、是否保存、质量要求等，不要依赖额外表单字段。
- 如果用户没有指定尺寸，默认使用 1024x1024。
- 如果用户要求同一系列，保持统一视觉语言，但每张主题、构图或元素要有差异。
- 每张贴纸主题、构图或元素要有差异，避免只是换颜色。
- prompt 要自然，像真实用户提出的设计需求。
- 如需要图片、字体、文案资源，只写检索方向，不要编造 URL 或资源 ID。
- 不要在 brief 里要求保存，保存由生产流水线处理。`,
        },
        {
          role: "user",
          content: `请根据下面的完整生产提示词生成 ${config.count} 个贴纸 brief。

完整生产提示词：
${config.description || config.style || "自由发挥"}

默认参数（仅在提示词没有说明时使用）：
- 尺寸：${config.width && config.height ? `${config.width}x${config.height}` : "1024x1024"}
- 背景：${config.transparentBackground ? "适合贴纸、透明/白边/抠边优先" : "按提示词自由处理"}
- 分析优化：${config.enableAnalysisOptimization ? `开启，质量目标 ${config.qualityThreshold}/10` : "关闭，生成完成后直接保存"}

每个 brief 都需要适合持续制作和保存到素材库，且 prompt 必须可以直接交给设计 agent 执行。`,
        },
      ],
      temperature: 0.8,
      maxTokens: 2400,
      timeoutMs: AI_TIMEOUTS.brief,
    });
  } catch (error) {
    console.warn("[Batch] brief 生成失败，使用本地 fallback:", error);
    return fallbackBriefs(config);
  }

  const parsed = parseChatResponse(response);
  const content = parsed?.content || "";
  const rawItems = parseJsonArray(content);

  if (!rawItems.length) {
    return fallbackBriefs(config);
  }

  const briefs: StickerBrief[] = [];
  for (const rawItem of rawItems) {
    const brief = normalizeBrief(rawItem, briefs.length, config);
    if (hasSimilarBrief(brief, briefs)) continue;
    briefs.push(brief);
    if (briefs.length >= config.count) break;
  }

  return ensureExactBriefs(briefs, config);
}

function parseJsonArray(content: string): any[] {
  const text = content.trim();
  try {
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : [];
  } catch {}

  const match = text.match(/\[[\s\S]*\]/);
  if (match) {
    try {
      const parsed = JSON.parse(match[0]);
      return Array.isArray(parsed) ? parsed : [];
    } catch {}
  }

  return [];
}

function fallbackBriefs(config: NormalizedBatchConfig): StickerBrief[] {
  return ensureExactBriefs([], config);
}

const FALLBACK_VARIATIONS = [
  "主体居中，强调清晰轮廓、白边和第一眼识别度",
  "使用不同姿态或动作，加入一个有记忆点的小道具",
  "做成局部特写或近景构图，突出材质、表情或笔触细节",
  "加入一句短文案，让画面更像可收藏的社交贴纸",
  "采用场景化小插画构图，加入不同前景和背景装饰",
  "换成徽章、印章或异形贴纸构图，增强系列变化",
];

function buildFallbackBriefRaw(
  config: NormalizedBatchConfig,
  index: number,
): Record<string, any> {
  const base = config.description || config.style || "创意贴纸";
  const variation = FALLBACK_VARIATIONS[index % FALLBACK_VARIATIONS.length];

  return {
    title: `${truncateText(base, 18)} ${index + 1}`,
    prompt: [
      `做一张${config.style || "自由风格"}的贴纸，主题来自：${base}。`,
      `这是系列第 ${index + 1} 张，变化方向：${variation}。`,
      "需要和同系列其他贴纸在主体姿态、构图、装饰元素或短文案上明显不同，画面完整、有识别度。",
    ].join(""),
    resourceHints: [base, config.style].filter(Boolean),
    saveName: `${truncateText(base, 18)} ${index + 1}`,
    description: `${truncateText(base, 36)}系列自动制作贴纸，第 ${index + 1} 张`,
    keywords: [base, config.style, "贴纸", `系列${index + 1}`].filter(Boolean),
  };
}

function ensureExactBriefs(
  briefs: StickerBrief[],
  config: NormalizedBatchConfig,
): StickerBrief[] {
  const result: StickerBrief[] = [];

  for (const brief of briefs) {
    if (result.length >= config.count) break;
    if (!hasSimilarBrief(brief, result)) {
      result.push(brief);
    }
  }

  while (result.length < config.count) {
    result.push(
      normalizeBrief(
        buildFallbackBriefRaw(config, result.length),
        result.length,
        config,
      ),
    );
  }

  return ensureUniqueBriefLabels(result.slice(0, config.count));
}

function hasSimilarBrief(
  brief: StickerBrief,
  existing: StickerBrief[],
): boolean {
  const key = comparableBriefKey(brief);
  const promptKey = comparablePromptKey(brief);
  return existing.some(
    (item) =>
      comparableBriefKey(item) === key ||
      comparablePromptKey(item) === promptKey,
  );
}

function comparableBriefKey(brief: StickerBrief): string {
  return normalizeComparable(`${brief.title}\n${brief.prompt}`).slice(0, 180);
}

function comparablePromptKey(brief: StickerBrief): string {
  return normalizeComparable(brief.prompt).slice(0, 180);
}

function normalizeComparable(text: string): string {
  return String(text || "")
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[，。、“”‘’：:；;,.!?！？【】\[\]()（）「」]/g, "");
}

function ensureUniqueBriefLabels(briefs: StickerBrief[]): StickerBrief[] {
  const seenTitles = new Map<string, number>();
  const seenNames = new Map<string, number>();

  return briefs.map((brief, index) => {
    const titleCount = seenTitles.get(brief.title) || 0;
    const nameCount = seenNames.get(brief.saveName) || 0;
    seenTitles.set(brief.title, titleCount + 1);
    seenNames.set(brief.saveName, nameCount + 1);

    return {
      ...brief,
      title:
        titleCount > 0
          ? truncateText(`${brief.title} ${index + 1}`, 28)
          : brief.title,
      saveName:
        nameCount > 0
          ? truncateText(`${brief.saveName} ${index + 1}`, 30)
          : brief.saveName,
    };
  });
}

function normalizeBrief(
  raw: any,
  index: number,
  config: NormalizedBatchConfig,
): StickerBrief {
  const title =
    truncateText(
      raw?.title ||
        raw?.saveName ||
        `${config.description || "贴纸"} ${index + 1}`,
      28,
    ) || `贴纸 ${index + 1}`;
  const prompt =
    String(raw?.prompt || raw?.description || title).trim() ||
    `做一张主题为「${title}」的贴纸。`;
  const keywords = asStringArray(raw?.keywords);
  const resourceHints = asStringArray(raw?.resourceHints || raw?.resources);
  const width =
    getOptionalSize(raw?.width, raw?.size?.width, config.width) || 1024;
  const height =
    getOptionalSize(raw?.height, raw?.size?.height, config.height) || 1024;
  const transparentBackground =
    typeof raw?.transparentBackground === "boolean"
      ? raw.transparentBackground
      : config.transparentBackground;

  return {
    title,
    prompt,
    width,
    height,
    transparentBackground,
    resourceHints,
    saveName: truncateText(raw?.saveName || title, 30),
    description: truncateText(raw?.description || prompt, 120),
    keywords: keywords.length
      ? keywords
      : [title, config.style, "贴纸"].filter(Boolean),
    qualityTarget: clampNumber(
      raw?.qualityTarget,
      1,
      10,
      config.qualityThreshold,
    ),
  };
}

// ============ Single Item Pipeline ============

async function runSingleDesign(
  item: BatchItem,
  config: NormalizedBatchConfig,
  signal: typeof controlSignal,
): Promise<void> {
  await waitIfPaused();
  if (isStopped(signal)) {
    markStopped(item);
    return;
  }

  item.status = "designing";
  try {
    await withTimeout(
      designAgent._runBatchItem(buildDesignPrompt(item.brief, item.index)),
      AI_TIMEOUTS.batchDesign,
      `第 ${item.index + 1} 张设计`,
    );
  } catch (e: any) {
    failItem(item, `生成失败: ${e?.message || e}`);
    return;
  }

  await waitIfPaused();
  if (isStopped(signal)) {
    markStopped(item);
    return;
  }

  if (!config.enableAnalysisOptimization) {
    if (config.saveMode === "draft") {
      item.status = "done";
      return;
    }
    await saveItem(item);
    return;
  }

  const firstScore = await evaluateItem(item);
  let score = firstScore;

  while (
    score !== null &&
    score < item.brief.qualityTarget &&
    item.revisionCount < config.maxRevisions
  ) {
    await waitIfPaused();
    if (isStopped(signal)) {
      markStopped(item);
      return;
    }

    item.status = "revising";
    item.revisionCount += 1;
    try {
      await withTimeout(
        designAgent._runBatchItem(buildRevisionPrompt(score, item.brief)),
        AI_TIMEOUTS.batchDesign,
        `第 ${item.index + 1} 张修订`,
      );
      score = await evaluateItem(item);
    } catch (e: any) {
      console.warn("[Batch] 修订失败:", e);
      break;
    }
  }

  if (
    item.score !== null &&
    item.score < item.brief.qualityTarget &&
    config.failureStrategy === "skip"
  ) {
    item.status = "skipped";
    item.error = `评分 ${item.score}/10 低于门槛 ${item.brief.qualityTarget}/10`;
    return;
  }

  if (
    item.score !== null &&
    item.score < item.brief.qualityTarget &&
    config.failureStrategy === "stop"
  ) {
    failItem(
      item,
      `评分 ${item.score}/10 低于门槛 ${item.brief.qualityTarget}/10`,
    );
    controlSignal.value = "stopped";
    batchProgress.status = "stopped";
    return;
  }

  if (config.saveMode === "draft") {
    item.status = "done";
    return;
  }

  await saveItem(item);
}

function buildDesignPrompt(brief: StickerBrief, index: number): string {
  const resourceHint = brief.resourceHints.length
    ? `可以按需要搜索这些资源方向：${brief.resourceHints.join("、")}。`
    : "可以按需要自行搜索图片、字体、文案或设计知识资源。";

  return `制作第 ${index + 1} 张贴纸。

尺寸：${brief.width}x${brief.height}
${brief.transparentBackground ? "背景要求：适合贴纸使用，可以做透明感、白边或便于抠边的主体。" : "背景要求：按设计效果自由处理。"}
主题：${brief.title}
需求：${brief.prompt}
${resourceHint}

只制作这一张，不要启动批量任务。请完成画布设计即可，不要询问用户，不要请求反馈，不要调用分析、评估、保存或导出工具。`;
}

async function evaluateItem(item: BatchItem): Promise<number | null> {
  item.status = "evaluating";
  try {
    const evaluation = await withTimeout(
      evaluateCanvasVisual(),
      AI_TIMEOUTS.batchEvaluate,
      `第 ${item.index + 1} 张评估`,
    );
    if (evaluation) {
      item.score = evaluation.score;
      return evaluation.score;
    }
  } catch (e: any) {
    console.warn("[Batch] 评估失败，跳过:", e);
  }
  return null;
}

function buildRevisionPrompt(score: number, brief: StickerBrief): string {
  return `当前这张「${brief.title}」贴纸评分为 ${score}/10，目标是 ${brief.qualityTarget}/10。

请基于当前画布做一次关键优化，优先处理构图、层级、文字可读性和素材融合问题。保持主题不变，不要重新开始，不要询问用户，也不要保存。`;
}

async function saveItem(item: BatchItem): Promise<void> {
  item.status = "saving";
  let lastError = "保存失败";
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const result = await withTimeout(
        executeAITool("canvas.updateAndSaveSticker", {
          name: item.brief.saveName,
          description: item.brief.description,
          keywords: item.brief.keywords.join(","),
        }),
        AI_TIMEOUTS.batchSave,
        `第 ${item.index + 1} 张保存（第 ${attempt}/3 次）`,
      );

      item.saveResult = result;
      if (result?.success) {
        item.savedUrl = result?.data?.url;
        item.status = "done";
        item.error = undefined;
        return;
      }
      lastError = result?.message || "保存失败";
    } catch (e: any) {
      lastError = e?.message || String(e);
    }
    if (attempt < 3) {
      item.error = `上传失败，正在重试 ${attempt}/3`;
      await new Promise((resolve) => setTimeout(resolve, attempt * 800));
    }
  }
  failItem(item, `保存失败，已重试 3 次: ${lastError}`);
}

function failItem(item: BatchItem, error: string): void {
  item.status = "failed";
  item.error = error;
}

function markStopped(item: BatchItem): void {
  if (
    item.status !== "done" &&
    item.status !== "failed" &&
    item.status !== "skipped"
  ) {
    item.status = "failed";
    item.error = "用户停止";
  }
}

// ============ Pause / Resume ============

function waitIfPaused(): Promise<void> {
  if (controlSignal.value !== "paused") {
    return Promise.resolve();
  }
  return new Promise<void>((resolve) => {
    pauseResolve = resolve;
  });
}

// ============ Public Runner ============

export async function startBatch(configInput: AutoBatchConfig): Promise<void> {
  if (["preparing", "running", "paused"].includes(batchProgress.status)) {
    console.warn("[Batch] 已在运行中");
    return;
  }

  const config = normalizeConfig(configInput);
  batchProgress.status = "preparing";
  batchProgress.items = [];
  batchProgress.current = 0;
  batchProgress.config = config;
  batchProgress.error = undefined;
  batchProgress.startedAt = Date.now();
  batchProgress.finishedAt = undefined;
  controlSignal.value = "running";
  beginDesignTabTask();

  try {
    const briefs = await generateBriefs(config);
    batchProgress.items = briefs.map((brief, index) => ({
      index,
      prompt: brief.prompt,
      brief,
      score: null,
      status: "pending" as const,
      revisionCount: 0,
    }));

    batchProgress.status = "running";

    for (let i = 0; i < batchProgress.items.length; i++) {
      if (isStopped()) {
        batchProgress.status = "stopped";
        break;
      }

      await waitIfPaused();
      if (isStopped()) {
        batchProgress.status = "stopped";
        break;
      }

      batchProgress.current = i;
      try {
        await runSingleDesign(batchProgress.items[i], config, controlSignal);
      } catch (error: any) {
        console.error("[Batch] 单张制作异常，继续下一张:", error);
        failItem(
          batchProgress.items[i],
          error?.message || "单张制作异常，已跳过",
        );
      }

      if (isStopped()) {
        batchProgress.status = "stopped";
        break;
      }
    }

    if (batchProgress.status !== "stopped") {
      batchProgress.status = "done";
    }
  } catch (error: any) {
    console.error("[Batch] 批量制作失败:", error);
    batchProgress.error = error?.message || "批量制作失败";
    batchProgress.status = "stopped";
  } finally {
    batchProgress.finishedAt = Date.now();
    const snapshot = getBatchRuntimeSnapshot();
    completeDesignTabTask(
      snapshot.status === "done" &&
        snapshot.failed === 0 &&
        snapshot.skipped === 0 &&
        snapshot.succeeded === snapshot.total,
    );
  }
}

export function pauseBatch(): void {
  if (batchProgress.status === "running") {
    controlSignal.value = "paused";
    batchProgress.status = "paused";
  }
}

export function resumeBatch(): void {
  if (batchProgress.status === "paused") {
    controlSignal.value = "running";
    batchProgress.status = "running";
    if (pauseResolve) {
      pauseResolve();
      pauseResolve = null;
    }
  }
}

export function stopBatch(): void {
  controlSignal.value = "stopped";
  batchProgress.status = "stopped";
  designAgent.stop();
  if (pauseResolve) {
    pauseResolve();
    pauseResolve = null;
  }
}

export function resetBatch(): void {
  controlSignal.value = "running";
  batchProgress.status = "idle";
  batchProgress.items = [];
  batchProgress.current = 0;
  batchProgress.config = null;
  batchProgress.error = undefined;
  batchProgress.startedAt = undefined;
  batchProgress.finishedAt = undefined;
}
