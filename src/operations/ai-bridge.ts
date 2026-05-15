import { getOperationTools } from './registry'
import type { OperationResult, OperationTool } from './types'
import { SIZE_PRESET_LIST_FOR_PROMPT } from './ops/size-presets'

const STICKER_DESIGN_SYSTEM = `你是一个专业的 POD（Print-on-Demand，按需印刷）产品设计 AI 助手。你运行在一个设计工具内部，拥有调用底层画布操作的能力。你的职责是**直接执行**用户的设计请求，而不是提供建议或讨论。

## 核心规则（必须严格遵守）

1. **你是一个执行者，不是顾问**。用户让你做设计，你就必须生成 operation 操作来实际创建设计。绝对不允许只给文字建议而不执行操作。
2. **每次回复必须包含至少一个 \`\`\`operation\`\`\` 代码块**（除非用户只是在闲聊或问与设计无关的问题）。
3. **禁止返回设计方案、创意建议、文案列表等纯文字内容**。用户要的是你动手做，不是听你分析。
4. **多个操作用多个 \`\`\`operation\`\`\` 代码块依次输出**，系统会按顺序自动执行。
5. **操作之间不要插入解释文字**，直接输出操作代码块即可。操作全部执行完成后，可以简短说明做了什么（一句话）。

## 画布系统说明

- 画布是设计的基础，所有元素都叠加在画布上
- 画布有宽高（单位 px），背景颜色默认透明
- 每个元素有唯一 ID（添加后返回），层级（zIndex），位置（position），变换（transform）等属性
- 元素类型：文字(text)、背景(background)、图片(image)、矩形(rect)、椭圆(ellipse)、二维码(qrcode)、条形码(barcode)、数学公式 (KaTeX, math)、流程图 (Mermaid, mermaid)、图表 (ECharts, echart)、3D模型 (Three.js, threeScene)

## 设计执行流程

当用户描述一个设计需求时，按以下步骤拆解为操作序列：

1. **设置画布尺寸** — 优先用 canvas.smartSize（传入产品描述如"T恤前胸"、"马克杯"、"A3海报"等），或 canvas.setSizeByPreset（传入预设ID），或 canvas.setSize（用户给了明确数值时）
2. **添加背景** — canvas.setBackgroundColor 或 canvas.addRect 设置底色
3. **添加主要元素** — canvas.addText / canvas.addRect / canvas.addImage 等
4. **调整布局** — element.setStyle 调整位置、大小、层级
5. **用户要求保存时** — 最后一步加 canvas.updateAndSaveSticker 或 canvas.exportPng

## 设计风格参考（自动选择合适的配色和排版）

- 简约风格：纯色背景 + 大字标题
- 卡通风格：鲜艳颜色 + 圆角 + 可爱文字
- 复古风格：深色背景 + 经典配色
- 潮流风格：撞色 + 粗体 + 几何图形
- 植物花卉：线描插画，黑白线条
- 几何抽象：几何拼接，现代感

## 执行示例

用户："帮我做一个粉色花卉圆形贴纸"
你的回复：

\`\`\`operation
{"op": "canvas.smartSize", "params": {"description": "圆形贴纸"}}
\`\`\`
\`\`\`operation
{"op": "canvas.setBackgroundColor", "params": {"color": "#FFE4E1"}}
\`\`\`
\`\`\`operation
{"op": "canvas.addText", "params": {"content": "✿", "fontSize": 400, "color": "#C71585", "fontWeight": "bold", "zIndex": 1}}
\`\`\`
\`\`\`operation
{"op": "canvas.addText", "params": {"content": "FLORAL", "fontSize": 200, "color": "#8B008B", "fontWeight": "600", "zIndex": 2}}
\`\`\`

注意：以上是示例格式，实际请根据用户需求设计具体内容。`

export function buildOperationsPrompt(): string {
  const tools = getOperationTools()
  const lines: string[] = [
    STICKER_DESIGN_SYSTEM,
    '',
    '## 可用操作列表（标准 JSON Schema 定义）',
    '',
    '每个操作的参数严格遵循 input_schema 定义。调用时参数名和类型必须匹配。',
    '',
  ]

  for (const tool of tools) {

    lines.push(`### ${tool.name}`)
    lines.push(tool.description)
    lines.push('')
    lines.push('```json')
    lines.push(JSON.stringify({
      name: tool.name,
      description: tool.description,
      input_schema: tool.input_schema,
    }, null, 2))
    lines.push('```')
    lines.push('')
  }

  lines.push('## 操作调用格式')
  lines.push('')
  lines.push('**每次回复必须包含操作调用。** 使用以下 JSON 格式：')
  lines.push('```operation')
  lines.push(JSON.stringify({ op: '操作ID', params: { 参数名: '参数值' } }, null, 2))
  lines.push('```')
  lines.push('')
  lines.push('调用规则：')
  lines.push('- 参数名和类型必须严格匹配 input_schema 定义')
  lines.push('- required 字段的参数必须提供')
  lines.push('- enum 字段的参数只能使用列出的可选值')
  lines.push('- number 类型参数不能超出 minimum/maximum 范围')
  lines.push('- 多个操作用多个 ```operation 代码块依次输出，按顺序执行')
  lines.push('- 操作之间不要插入任何文字，操作完成后简短说明')
  lines.push('')
  lines.push('## 重要提醒')
  lines.push('')
  lines.push('- 当用户描述产品类型时，优先使用 canvas.smartSize 或 canvas.setSizeByPreset 匹配预设尺寸')
  lines.push('- 当用户给出了明确的数值尺寸时，使用 canvas.setSize')
  lines.push('- 注意使用 zIndex 控制元素层级：背景 zIndex=0，文字 zIndex=1+')
  lines.push('- 元素默认居中，如果不指定位置就是居中的')
  lines.push('- 颜色值使用 CSS 颜色格式，如 #ff0000, rgb(255,0,0)')
  lines.push('- 文字字号单位是 px，160 是正常大小，300+ 是标题大小')
  lines.push('- 当用户要求保存/导出/完成设计时，最后一步使用 canvas.updateAndSaveSticker 保存到素材库，或 canvas.exportPng 导出下载')
  lines.push('- 设计完成后主动提示用户是否保存')
  lines.push('')
  lines.push('## 可用产品尺寸预设（用于 canvas.smartSize / canvas.setSizeByPreset）')
  lines.push('')
  lines.push(SIZE_PRESET_LIST_FOR_PROMPT)

  return lines.join('\n')
}

export function buildOperationTools(): OperationTool[] {
  return getOperationTools()
}

const OPERATION_BLOCK_RE = /```operation\s*\n([\s\S]*?)```/g

export function parseOperationCalls(text: string): Array<{ op: string; params: Record<string, any> }> {
  const calls: Array<{ op: string; params: Record<string, any> }> = []
  let match: RegExpExecArray | null

  while ((match = OPERATION_BLOCK_RE.exec(text)) !== null) {
    try {
      const parsed = JSON.parse(match[1].trim())
      if (parsed.op) {
        calls.push({ op: parsed.op, params: parsed.params || {} })
      }
    } catch {
      // skip malformed blocks
    }
  }

  return calls
}

export function stripOperationBlocks(text: string): string {
  return text.replace(/```operation\s*\n[\s\S]*?```/g, '').trim()
}

export function extractAiResponseText(response: any): string {
  if (!response) return ''

  // Server wrapper: { data: "text", code: 0, status: true }
  if (typeof response.data === 'string') return response.data

  // Server wrapper: { data: { choices: [...] } }
  const inner = response.data || response

  // OpenAI format: { choices: [{ message: { content } }] }
  if (inner.choices?.[0]?.message?.content) {
    const c = inner.choices[0].message.content
    return typeof c === 'string' ? c : JSON.stringify(c)
  }

  // Direct string
  if (typeof response === 'string') return response

  // Fallback: stringify entire response
  return JSON.stringify(response)
}

export function formatOperationResult(result: OperationResult): string {
  if (result.success) {
    return `✅ ${result.message}`
  }
  return `❌ ${result.message}`
}
