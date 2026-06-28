import { reactive, ref } from "vue";
import { directChat } from "../direct-client";
import { designAgent } from "./simple";
import { evaluateCanvasVisual } from "../visual-evaluate";
import { executeAITool } from "../shared/execute-tool";
import { parseChatResponse } from "../shared/response-parser";

// ============ 类型定义 ============

export interface AutoBatchConfig {
  style: string; // "极简主义"
  description: string; // "咖啡店菜单"（可选）
  count: number; // 1-20
}

export interface BatchItem {
  index: number;
  prompt: string; // LLM 展开的具体 prompt
  score: number | null;
  status:
    | "pending"
    | "generating"
    | "evaluating"
    | "improving"
    | "saving"
    | "done"
    | "failed";
  error?: string;
}

export interface BatchProgress {
  status: "idle" | "preparing" | "running" | "paused" | "stopped" | "done";
  items: BatchItem[];
  current: number; // 当前处理到第几个（0-indexed）
}

// ============ 共享状态 ============

export const batchProgress = reactive<BatchProgress>({
  status: "idle",
  items: [],
  current: 0,
});

// 暂停/恢复控制
const controlSignal = ref<"running" | "paused" | "stopped">("running");
let pauseResolve: (() => void) | null = null;

// ============ Prompt 展开 ============

async function expandPrompts(config: AutoBatchConfig): Promise<string[]> {
  const styleHint = config.style ? `风格：${config.style}` : "";
  const descHint = config.description ? `主题：${config.description}` : "";

  const response = await directChat({
    messages: [
      {
        role: "system",
        content: `你是一个设计提示词生成专家。根据用户的需求，生成 N 个具体、互不相同的设计提示词。
每个提示词应该是一个完整的、可直接执行的设计指令。
提示词之间要有明显的风格/内容差异，避免雷同。
画布尺寸由提示词中的描述决定，如"正方形海报"→1080x1080，"手机壁纸"→1080x1920，"横幅"→1920x600。
如果用户没有指定尺寸，默认使用 1080x1080。

输出格式：严格输出 JSON 数组，不要写其他内容。
["提示词1", "提示词2", ...]`,
      },
      {
        role: "user",
        content: `请生成 ${config.count} 个设计提示词。
${styleHint}
${descHint}

要求：
- 每个提示词 20-50 字，描述完整的设计意图
- 包含色彩、构图、内容等关键信息
- 互相之间有明显差异
- 适合 POD（按需印刷）产品设计`,
      },
    ],
    temperature: 0.8,
  });

  const parsed = parseChatResponse(response);
  if (!parsed?.content) {
    throw new Error("无法生成提示词");
  }

  // 尝试解析 JSON 数组
  try {
    const arr = JSON.parse(parsed.content.trim());
    if (Array.isArray(arr) && arr.length > 0) {
      return arr.slice(0, config.count);
    }
  } catch {
    // 尝试从文本中提取 JSON 数组
    const match = parsed.content.match(/\[[\s\S]*\]/);
    if (match) {
      try {
        const arr = JSON.parse(match[0]);
        if (Array.isArray(arr) && arr.length > 0) {
          return arr.slice(0, config.count);
        }
      } catch {}
    }
  }

  // fallback：按行分割
  const lines = parsed.content
    .split("\n")
    .map((l: string) => l.replace(/^\d+[\.\)、]\s*/, "").trim())
    .filter((l: string) => l.length > 5);

  if (lines.length > 0) {
    return lines.slice(0, config.count);
  }

  throw new Error("无法解析提示词列表");
}

// ============ 单个设计执行 ============

async function runSingleDesign(
  item: BatchItem,
  signal: typeof controlSignal,
): Promise<void> {
  // 1. 生成设计
  item.status = "generating";
  try {
    await designAgent._runBatchItem(item.prompt);
  } catch (e: any) {
    item.status = "failed";
    item.error = `生成失败: ${e.message}`;
    return;
  }

  // 检查停止信号
  if (signal.value === "stopped") {
    item.status = "failed";
    item.error = "用户停止";
    return;
  }

  // 2. 视觉评估
  item.status = "evaluating";
  let evaluation: Awaited<ReturnType<typeof evaluateCanvasVisual>> = null;
  try {
    evaluation = await evaluateCanvasVisual();
    if (evaluation) {
      item.score = evaluation.score;
    }
  } catch (e: any) {
    console.warn("[Batch] 评估失败，跳过:", e);
  }

  // 3. 如果评分低，自动优化一轮
  if (evaluation && evaluation.score < 6 && evaluation.suggestions.length > 0) {
    item.status = "improving";
    const improvePrompt = `当前设计评分 ${evaluation.score}/10，有以下问题：
${evaluation.weaknesses.map((w: string, i: number) => `${i + 1}. ${w}`).join("\n")}

改进建议：
${evaluation.suggestions.map((s: string, i: number) => `${i + 1}. ${s}`).join("\n")}

请使用工具改进设计。只执行最关键的 1-2 个改进操作。`;

    try {
      await designAgent._runBatchItem(improvePrompt);
      // 再评估一次
      const reEval = await evaluateCanvasVisual();
      if (reEval) {
        item.score = reEval.score;
      }
    } catch (e: any) {
      console.warn("[Batch] 优化失败:", e);
    }
  }

  // 4. 保存
  item.status = "saving";
  try {
    const stickerName = item.prompt.slice(0, 30).replace(/[\n\r"]/g, " ");
    await executeAITool("canvas.updateAndSaveSticker", {
      name: stickerName,
      description: `自动批量制作 - ${stickerName}`,
    });
  } catch (e: any) {
    console.warn("[Batch] 保存失败:", e);
    item.error = `保存失败: ${e.message}`;
  }

  item.status = "done";
}

// ============ 等待暂停恢复 ============

function waitIfPaused(): Promise<void> {
  if (controlSignal.value !== "paused") {
    return Promise.resolve();
  }
  return new Promise<void>((resolve) => {
    pauseResolve = resolve;
  });
}

// ============ 主入口 ============

export async function startBatch(config: AutoBatchConfig): Promise<void> {
  if (batchProgress.status === "running") {
    console.warn("[Batch] 已在运行中");
    return;
  }

  // 重置状态
  batchProgress.status = "preparing";
  batchProgress.items = [];
  batchProgress.current = 0;
  controlSignal.value = "running";

  try {
    // 1. 展开提示词
    const prompts = await expandPrompts(config);

    // 2. 初始化 items
    batchProgress.items = prompts.map((prompt, index) => ({
      index,
      prompt,
      score: null,
      status: "pending" as const,
    }));

    batchProgress.status = "running";

    // 3. 逐个执行
    for (let i = 0; i < batchProgress.items.length; i++) {
      // 检查停止
      if (controlSignal.value === "stopped") {
        batchProgress.status = "stopped";
        return;
      }

      // 检查暂停
      await waitIfPaused();
      if (controlSignal.value === "stopped") {
        batchProgress.status = "stopped";
        return;
      }

      batchProgress.current = i;
      const item = batchProgress.items[i];

      await runSingleDesign(item, controlSignal);
    }

    batchProgress.status = "done";
  } catch (error: any) {
    console.error("[Batch] 批量制作失败:", error);
    batchProgress.status = "stopped";
  }
}

// ============ 控制方法 ============

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
  // 如果在暂停中，解除暂停以便循环退出
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
}
