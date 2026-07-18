import {
  inferCanvasTypographyDensity,
  type CanvasTypographyDensity,
} from "../../operations/canvas-typography.ts";

export type DesignPlanStepStatus = "pending" | "done" | "failed";

export interface DesignPlanStep {
  action: string;
  description: string;
  status: DesignPlanStepStatus;
  result?: string;
}

export interface DesignPlan {
  goal: string;
  steps: DesignPlanStep[];
  currentStep: number;
}

export interface ExplicitCanvasSize {
  width: number;
  height: number;
  unit: "px" | "mm" | "cm" | "in";
}

export interface ExecutionPlanResult {
  plan: DesignPlan | null;
  explicitCanvasSize: ExplicitCanvasSize | null;
  isNewDesign: boolean;
  shouldPreflightSize: boolean;
  typographyDensity: CanvasTypographyDensity;
  searchQueries: {
    assets: string;
    styles: string;
    layouts: string;
  };
}

const SIZE_ACTIONS = new Set([
  "canvas.setSize",
  "canvas.smartSize",
  "canvas.setSizeByPreset",
]);

const ARTWORK_ACTIONS = new Set([
  "canvas.addHtml",
  "canvas.addChild:html",
  "canvas.createSticker",
  "canvas.createFromDescription",
]);

const REUSABLE_ACTIONS = new Set([
  "resource.searchFont",
  "resource.searchSticker",
  "resource.searchSentence",
  "resource.searchTextDocument",
]);

const REQUIRED_DELIVERY_ACTIONS = new Set([
  "canvas.updateAndSaveSticker",
  "canvas.exportPng",
]);

function compactText(value: string, maxLength = 180): string {
  const text = String(value || "")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 3)}...`;
}

export function shouldAllowCanvasAnalysis(userMessage: string): boolean {
  const text = String(userMessage || "");
  const analysisIntent =
    /分析|评价|评估|打分|看看效果|看一下效果|检查(?:效果|画面|设计|素材|文字|排版|构图|加载)?|自检|自测|测试|review|analy[sz]e|evaluate|score/i;
  const deniedAnalysisIntent =
    /(不要|不用|无需|别|禁止|不需要).{0,12}(分析|评价|评估|打分|检查|自检|自测|测试|review|analy[sz]e|evaluate|score)/i;

  return analysisIntent.test(text) && !deniedAnalysisIntent.test(text);
}

export function shouldContinueAfterArtwork(userMessage: string): boolean {
  const continuationIntent = /继续|再改|优化|调整|迭代|保存|导出|save|export/i;
  const deniedContinuationIntent =
    /(不要|不用|无需|别|禁止|不需要).{0,12}(继续|再改|优化|调整|迭代|保存|导出|save|export)/i;
  return (
    (continuationIntent.test(userMessage) &&
      !deniedContinuationIntent.test(userMessage)) ||
    shouldAllowCanvasAnalysis(userMessage)
  );
}

export function extractExplicitCanvasSize(
  userMessage: string,
): ExplicitCanvasSize | null {
  const text = String(userMessage || "");
  const patterns = [
    /(\d+(?:\.\d+)?)\s*[x×X＊*]\s*(\d+(?:\.\d+)?)\s*(px|mm|cm|in)\b/i,
    /(\d+(?:\.\d+)?)\s*(px|mm|cm|in)\s*[x×X＊*]\s*(\d+(?:\.\d+)?)\b/i,
    /(\d+(?:\.\d+)?)\s*[x×X＊*]\s*(\d+(?:\.\d+)?)(?=\D|$)/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (!match) continue;

    if (pattern === patterns[1]) {
      return {
        width: Number(match[1]),
        height: Number(match[3]),
        unit: match[2].toLowerCase() as ExplicitCanvasSize["unit"],
      };
    }

    return {
      width: Number(match[1]),
      height: Number(match[2]),
      unit: (match[3] || "px").toLowerCase() as ExplicitCanvasSize["unit"],
    };
  }

  return null;
}

export function isModificationRequest(userMessage: string): boolean {
  const text = String(userMessage || "");
  return /基于当前(?:设计|画布)|现有设计|保留现有|不要清空|继续修改|修改当前|调整当前|替换当前|在此基础上|based on (?:the )?current|update (?:the )?current/i.test(
    text,
  );
}

export function isNewDesignRequest(userMessage: string): boolean {
  const text = String(userMessage || "");
  if (isModificationRequest(text)) return false;
  if (
    shouldAllowCanvasAnalysis(text) &&
    !/创建|生成|制作|设计一|做一|创作一|新建/i.test(text)
  ) {
    return false;
  }

  return /创建|新建|生成|制作|设计一(?:张|个|套|款|幅|枚|组)|做一(?:张|个|套|款|幅|枚|组)|创作一(?:张|个|套|款|幅|枚|组)|清空画布.*(?:添加|创建)|create|generate|make a|design a/i.test(
    text,
  );
}

function shouldApplyExplicitSize(
  userMessage: string,
  explicitCanvasSize: ExplicitCanvasSize | null,
  isNewDesign: boolean,
): boolean {
  if (!explicitCanvasSize) return false;
  if (isNewDesign) return true;

  return /设置|改为|调整|保持|保留|set|resize|keep/i.test(userMessage);
}

function hasExplicitResourceRequest(
  userMessage: string,
  type: string,
): boolean {
  const patterns: Record<string, RegExp> = {
    font: /字体库|搜索.{0,10}字体|检索.{0,10}字体|使用.{0,10}(手写体|标题字|字体资源)/i,
    image:
      /素材库|贴纸库|搜索.{0,12}(图片|贴纸|插画|素材)|检索.{0,12}(图片|贴纸|插画|素材)|抠图素材/i,
    sentence: /文案库|搜索.{0,10}(文案|句子|广告词)|检索.{0,10}(文案|句子)/i,
    document: /文档库|搜索.{0,10}(文档|资料)|检索.{0,10}(文档|资料)/i,
  };
  return patterns[type]?.test(userMessage) || false;
}

function getPrimaryArtworkAction(userMessage: string): string | null {
  if (
    /(?:设置|调整|修改|改为|改成).{0,12}画布基础字号|画布基础字号.{0,12}(?:设置|调整|修改|改为|改成)/i.test(
      userMessage,
    ) &&
    !/同时|并且|以及|创建|生成|制作|设计一|做一|创作一/i.test(userMessage)
  ) {
    return null;
  }

  const analysisOnly =
    shouldAllowCanvasAnalysis(userMessage) &&
    !/创建|生成|制作|设计一(?:张|个|套|款|幅|枚|组)|做一(?:张|个|套|款|幅|枚|组)|创作一(?:张|个|套|款|幅|枚|组)|新建|基于当前|修改当前|调整当前/i.test(
      userMessage,
    );
  if (analysisOnly) return null;

  const deniedMutation =
    /(不要|不用|无需|别|禁止|不需要).{0,12}(修改|调整|替换|更换|添加|创建|生成|制作)/i.test(
      userMessage,
    );
  const positiveMutation =
    !deniedMutation &&
    (/修改|调整|替换|更换|添加|改为|改成|移到|移动/i.test(userMessage) ||
      isModificationRequest(userMessage));
  const positiveCreation = isNewDesignRequest(userMessage);

  if (!positiveCreation && !positiveMutation) return null;

  if (/流程图|思维导图|关系图|mermaid|flowchart|mind ?map/i.test(userMessage)) {
    return "canvas.addDiagram";
  }
  if (/数据图表|柱状图|折线图|饼图|雷达图|echarts?|chart/i.test(userMessage)) {
    return "canvas.addChart";
  }
  return "canvas.addHtml";
}

function hasPositiveCommandIntent(
  userMessage: string,
  intent: RegExp,
  deniedIntent: RegExp,
): boolean {
  return intent.test(userMessage) && !deniedIntent.test(userMessage);
}

function createStep(action: string, description: string): DesignPlanStep {
  return { action, description, status: "pending" };
}

export function buildExecutionPlan(userMessage: string): ExecutionPlanResult {
  const normalized = compactText(userMessage);
  const explicitCanvasSize = extractExplicitCanvasSize(userMessage);
  const typographyDensity = inferCanvasTypographyDensity(userMessage);
  const isNewDesign = isNewDesignRequest(userMessage);
  const shouldPreflightSize = shouldApplyExplicitSize(
    userMessage,
    explicitCanvasSize,
    isNewDesign,
  );
  const steps: DesignPlanStep[] = [];

  if (isNewDesign) {
    steps.push(createStep("canvas.clear", "创建新设计前清空现有画布"));
  }

  if (shouldPreflightSize && explicitCanvasSize) {
    steps.push(
      createStep(
        "canvas.setSize",
        `设置画布为 ${explicitCanvasSize.width}×${explicitCanvasSize.height} ${explicitCanvasSize.unit}，并按内容密度设置基础字号`,
      ),
    );
  } else if (
    isNewDesign &&
    /T恤|马克杯|手机壳|海报|贴纸|鼠标垫|帆布袋|帽子|抱枕|名片|明信片|贺卡|小红书|story|instagram/i.test(
      userMessage,
    )
  ) {
    steps.push(
      createStep("canvas.smartSize", "根据产品或发布场景设置画布尺寸"),
    );
  }

  if (
    !isNewDesign &&
    /(?:设置|调整|修改|改为|改成).{0,12}画布基础字号|画布基础字号.{0,12}(?:设置|调整|修改|改为|改成)/i.test(
      userMessage,
    )
  ) {
    steps.push(
      createStep("canvas.setBaseFontSize", "调整 HTML 设计的画布基础字号"),
    );
  }

  if (hasExplicitResourceRequest(userMessage, "font")) {
    steps.push(createStep("resource.searchFont", "搜索用户明确要求的字体资源"));
  }
  if (hasExplicitResourceRequest(userMessage, "image")) {
    steps.push(
      createStep("resource.searchSticker", "搜索用户明确要求的图片或贴纸素材"),
    );
  }
  if (hasExplicitResourceRequest(userMessage, "sentence")) {
    steps.push(
      createStep("resource.searchSentence", "搜索用户明确要求的短文案"),
    );
  }
  if (hasExplicitResourceRequest(userMessage, "document")) {
    steps.push(
      createStep("resource.searchTextDocument", "搜索用户明确要求的文档资料"),
    );
  }

  const artworkAction = getPrimaryArtworkAction(userMessage);
  if (artworkAction) {
    const description =
      artworkAction === "canvas.addDiagram"
        ? "创建完整图示"
        : artworkAction === "canvas.addChart"
          ? "创建完整数据图表"
          : "根据用户要求生成完整 HTML/CSS 作品";
    steps.push(createStep(artworkAction, description));
  }

  if (shouldAllowCanvasAnalysis(userMessage)) {
    steps.push(createStep("canvas.analyze", "分析当前画布并给出评价"));
  }
  if (
    hasPositiveCommandIntent(
      userMessage,
      /保存|save/i,
      /(不要|不用|无需|别|禁止|不需要).{0,12}(保存|save)/i,
    )
  ) {
    steps.push(createStep("canvas.updateAndSaveSticker", "保存当前设计"));
  }
  if (
    hasPositiveCommandIntent(
      userMessage,
      /导出|export/i,
      /(不要|不用|无需|别|禁止|不需要).{0,12}(导出|export)/i,
    )
  ) {
    steps.push(createStep("canvas.exportPng", "导出当前设计"));
  }

  const plan = steps.length
    ? {
        goal: normalized,
        steps,
        currentStep: 0,
      }
    : null;

  const query = normalized.replace(
    /\d+(?:\.\d+)?\s*[x×X＊*]\s*\d+(?:\.\d+)?\s*(?:px|mm|cm|in)?/gi,
    " ",
  );

  return {
    plan,
    explicitCanvasSize,
    isNewDesign,
    shouldPreflightSize,
    typographyDensity,
    searchQueries: {
      assets: compactText(query, 120),
      styles: compactText(query, 160),
      layouts: compactText(query, 160),
    },
  };
}

export function planActionsMatch(
  plannedAction: string,
  actualAction: string,
): boolean {
  if (plannedAction === actualAction) return true;
  if (SIZE_ACTIONS.has(plannedAction) && SIZE_ACTIONS.has(actualAction))
    return true;
  if (ARTWORK_ACTIONS.has(plannedAction) && ARTWORK_ACTIONS.has(actualAction)) {
    return true;
  }
  return false;
}

export function ensurePlanStep(
  plan: DesignPlan,
  action: string,
  description: string,
): number {
  const pendingIndex = plan.steps.findIndex(
    (step) =>
      step.status === "pending" && planActionsMatch(step.action, action),
  );
  if (pendingIndex >= 0) return pendingIndex;

  if (REUSABLE_ACTIONS.has(action)) {
    const existingIndex = plan.steps.findIndex((step) =>
      planActionsMatch(step.action, action),
    );
    if (existingIndex >= 0) return existingIndex;
  }

  plan.steps.push(createStep(action, description));
  return plan.steps.length - 1;
}

export function settlePlanStep(
  plan: DesignPlan,
  action: string,
  status: Exclude<DesignPlanStepStatus, "pending">,
  result?: string,
  description = action,
): number {
  const index = ensurePlanStep(plan, action, description);
  plan.steps[index].status = status;
  plan.steps[index].result = result;
  plan.currentStep = plan.steps.filter(
    (step) => step.status !== "pending",
  ).length;
  return index;
}

export function failPendingPlanSteps(plan: DesignPlan, reason: string): void {
  for (const step of plan.steps) {
    if (step.status === "pending") {
      step.status = "failed";
      step.result = reason;
    }
  }
  plan.currentStep = plan.steps.length;
}

export function getPlanProgress(plan: DesignPlan | null): {
  settled: number;
  done: number;
  failed: number;
  total: number;
} {
  if (!plan) return { settled: 0, done: 0, failed: 0, total: 0 };
  const done = plan.steps.filter((step) => step.status === "done").length;
  const failed = plan.steps.filter((step) => step.status === "failed").length;
  return {
    settled: done + failed,
    done,
    failed,
    total: plan.steps.length,
  };
}

export function getIncompleteDeliveryActions(
  plan: DesignPlan | null,
): string[] {
  if (!plan) return [];
  return Array.from(REQUIRED_DELIVERY_ACTIONS).filter((action) => {
    const actionSteps = plan.steps.filter((step) => step.action === action);
    return (
      actionSteps.length > 0 &&
      !actionSteps.some((step) => step.status === "done")
    );
  });
}
