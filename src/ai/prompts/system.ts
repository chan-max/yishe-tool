import { canvasStickerOptions } from "@/components/design/layout/canvas";

// ============ 画布状态摘要（共享） ============

interface CanvasSummary {
  width: number;
  height: number;
  elementCount: number;
  elements: { id: any; type: any; content: string }[];
}

function getCanvasSummary(): CanvasSummary {
  const children = canvasStickerOptions.value.children;
  const mainCanvas = children[0];
  const extractNum = (v: any) => typeof v === "number" ? v : (v?.value ?? 500);
  return {
    width: extractNum(mainCanvas?.width) || 500,
    height: extractNum(mainCanvas?.height) || 500,
    elementCount: children.length - 1,
    elements: children.slice(1).map((c: any) => ({
      id: c.id,
      type: c.type,
      content: c.content || c.text || "",
    })),
  };
}

// ============ Layer 1: 核心身份 + HTML 优先 ============

function buildRolePrompt(): string {
  return `你是一个专业的设计协作 AI，运行在设计工具内部，通过调用工具帮用户创建设计。

## 核心规则
- 用户要求创建新设计时，先调用 canvas.clear 清空画布
- 用户明确给出具体画布尺寸（如 1080x1080、800×1200、10x10cm）时，先调用 canvas.setSize 设置该尺寸，后续不要覆盖它
- 用户未指定数值尺寸时，可以使用 canvas.smartSize 或 canvas.setSizeByPreset
- 用户要求修改/迭代现有设计时，不要清空画布，直接修改
- 主要视觉作品使用 canvas.addHtml 创建；再次调用 canvas.addHtml 会替换当前 HTML 作品
- 流程图/思维导图可用 canvas.addDiagram，数据图表可用 canvas.addChart
- 每次只调用一个工具，完成后根据结果决定下一步
- 只在用户明确要求保存时调用 canvas.updateAndSaveSticker`;}

// ============ Layer 3: 资源使用 ============

function buildResourceGuidePrompt(): string {
  return `## 素材库 / 字体 / 文案 / 文档

- resource.searchSticker：搜索图片/贴纸/插画候选
- resource.searchFont：搜索字体候选
- resource.searchSentence：搜索短文案候选
- resource.searchTextDocument：搜索长文本/知识文档候选
- 搜索结果只是候选，可选择、忽略或继续搜索
- 外部图片和字体用于 HTML 时，需要放进 canvas.addHtml 的 htmlBindings，不要直接把 URL 写进 htmlContent
- 图片引用：{{image.xxx.url}}；字体引用：{{font.xxx.family}}`;
}

// ============ Layer 4: HTML 速查 ============

function buildHtmlQuickRefPrompt(): string {
  return `## HTML 能力

- canvas.addHtml 接收 htmlContent 和 htmlBindings；根节点建议使用 width:100%; height:100%; position:relative; overflow:hidden; box-sizing:border-box
- 图片/字体资源通过 htmlBindings 注入，HTML 中用 {{image.xxx.url}} / {{font.xxx.family}} 引用
- 可在 HTML 中嵌入组件变量：{{echart.name}}、{{threejs.name}}、{{qrcode.name}}、{{barcode.name}}、{{wordCloud.name}}、{{math.name}}、{{mermaid.name}}、{{chartjs.name}}、{{particlesEffect.name}}、{{opentypeText.name}}
- 组件配置放在 htmlBindings 对应 key 下，例如 echart.name.option、qrcode.name.textContent、mermaid.name.mermaidSource`;
}

// ============ Layer 5: 设计经验参考 ============

export interface DesignExperience {
  compositionType: string;
  colorStrategy: string;
  typographyStyle: string;
  decorationStyle: string;
  colorPalette: string[];
  htmlPattern: string;
  keyTechniques: string[];
  qualityScore: number;
  keywords: string[];
}

function buildDesignExperiencePrompt(patterns: DesignExperience[]): string {
  if (!patterns.length) return '';

  return `\n## 设计经验参考（来自图库中 ${patterns.length} 个相似设计的综合分析）

这些是与当前需求最相似的 ${patterns.length} 个历史设计的设计模式总结，参考它们的配色、构图和技巧，融合多种经验创造新设计：

${patterns.map((p, i) => `### 模式 ${i + 1}: ${p.compositionType} + ${p.colorStrategy}
- 构图: ${p.compositionType}
- 配色策略: ${p.colorStrategy} (${p.colorPalette.join(', ')})
- 排版: ${p.typographyStyle}
- 装饰: ${p.decorationStyle}
- 关键技术: ${p.keyTechniques.join(', ')}
- 参考骨架:
\`\`\`html
${p.htmlPattern}
\`\`\``).join('\n\n')}

这些经验只作为参考，不要求在最终回复中说明，也不要机械复刻参考骨架。`;
}

// ============ 组合器 ============

export interface PromptOptions {
  includeResourceGuide?: boolean;
  includeHtmlQuickRef?: boolean;
  canvasState?: boolean;
  designExperiences?: DesignExperience[];
}

export function buildSystemPrompt(options: PromptOptions = {}): string {
  const {
    includeResourceGuide = true,
    includeHtmlQuickRef = true,
    canvasState = true,
  } = options;

  const layers: string[] = [];

  layers.push(buildRolePrompt());

  if (canvasState) {
    const state = getCanvasSummary();
    const hint = state.elementCount > 0 ? "（如果要创建新设计，记得先 canvas.clear）" : "";
    layers.push(`\n## 当前画布\n${JSON.stringify(state)}\n${hint}`);
  }

  if (includeResourceGuide) {
    layers.push(buildResourceGuidePrompt());
  }

  if (includeHtmlQuickRef) {
    layers.push(buildHtmlQuickRefPrompt());
  }

  return layers.join("\n");
}

// ============ 兼容旧的 buildSystemPrompt 无参调用 ============
// 保持同名函数，该文件在 simple.ts 和 think.ts 中被 import { buildSystemPrompt } 调用
// 无参调用 = 全量 prompt，有参调用 = 按需组合

// ============ 图片分析提示词 ============

export function buildImageAnalysisPrompt(): string {
  return `你是设计分析助手。用户上传参考图片，你需要：

1. 分析图片的设计元素（配色、字体、布局、风格）
2. 用 HTML 类型创建类似风格的设计
3. 先分析再执行

## HTML 写法
标题：<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;background:#1a1a2e;"><div style="font-size:280px;font-weight:900;color:#fff;">标题</div></div>
渐变背景：<div style="width:100%;height:100%;background:linear-gradient(135deg,#667eea,#764ba2);border-radius:20px;"></div>

## 字体和图片绑定
搜到资源后在 canvas.addHtml 中用 htmlBindings 字段绑定，HTML 中用 {{font.xxx.family}} 或 {{image.xxx.url}} 引用。`;
}

// ============ 规划提示词 ============

export function buildPlanPrompt(userInput: string): string {
  return `根据用户需求制定执行计划。

## 用户需求
${userInput}

## 输出 JSON 格式
{
  "goal": "任务目标",
  "steps": [{"id":"step_1","action":"动作描述","tool":"工具名","args":{},"description":"详细说明"}]
}`;
}
