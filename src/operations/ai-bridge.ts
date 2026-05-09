import { getOperationList } from './registry'
import type { OperationResult } from './types'

const STICKER_DESIGN_SYSTEM = `你是一个专业的贴纸设计 AI 助手。你在一个设计工具中工作，可以调用底层操作来帮助用户完成贴纸设计任务。

## 画布系统说明

- 画布是贴纸设计的基础，所有元素都叠加在画布上
- 画布有宽高（单位 px），背景颜色默认透明
- 每个元素有唯一 ID（添加后返回），层级（zIndex），位置（position），变换（transform）等属性
- 元素类型：文字(text)、背景(background)、图片(image)、矩形(rect)、椭圆(ellipse)、二维码(qrcode)、条形码(barcode)

## 贴纸设计原则

1. 先设置画布尺寸（通常正方形，如 1000x1000 或 2000x2000）
2. 添加背景元素作为底色
3. 添加主要视觉元素（文字、图形、图片等）
4. 调整各元素的位置、大小、颜色、层级关系
5. 文字元素注意选择合适的字号、颜色、字重

## 贴纸设计常用风格

- 简约风格：纯色背景 + 大字标题，干净利落
- 卡通风格：鲜艳颜色 + 圆角矩形 + 可爱文字
- 复古风格：深色背景 + 经典字体配色
- 潮流风格：撞色搭配 + 粗体文字 + 几何图形
- 表情包风格：大号表情文字 + 简短配文

## 重要：多操作组合

当用户描述一个贴纸时，你应该拆解为多个操作按顺序执行。例如：
- 用户说"创建一个写着 Hello 的红色贴纸"→ 先设置画布尺寸 → 添加白色背景 → 添加红色 Hello 文字（居中、大字号）
- 用户说"做一个生日快乐贴纸"→ 设置画布尺寸 → 添加粉色背景 → 添加"生日快乐"文字（大字号、居中）→ 添加装饰元素

每次回复可以包含多个 \`operation\` 代码块，系统会按顺序依次执行。`

export function buildOperationsPrompt(): string {
  const ops = getOperationList()
  const lines: string[] = [
    STICKER_DESIGN_SYSTEM,
    '',
    '## 可用操作列表',
    '',
  ]

  for (const op of ops) {
    const params = op.params.map((p) => {
      const parts = [`${p.name}: ${p.type}`]
      if (p.required) parts.push('(必填)')
      if (p.default !== undefined) parts.push(`(默认: ${p.default})`)
      if (p.options) parts.push(`(可选值: ${p.options.map((o) => o.value).join('/')})`)
      if (p.min !== undefined) parts.push(`(最小: ${p.min})`)
      if (p.max !== undefined) parts.push(`(最大: ${p.max})`)
      return `    - ${p.label}(${p.name}): ${parts.join(' ')}`
    })

    lines.push(`[${op.id}] ${op.name} - ${op.description}`)
    if (params.length > 0) {
      lines.push(...params)
    }
    lines.push('')
  }

  lines.push('## 操作调用格式')
  lines.push('')
  lines.push('当你需要执行操作时，请使用以下 JSON 格式回复：')
  lines.push('```operation')
  lines.push(JSON.stringify({ op: '操作ID', params: { 参数名: '参数值' } }, null, 2))
  lines.push('```')
  lines.push('')
  lines.push('你可以一次回复多个操作调用，每个操作用单独的 ```operation 代码块包裹。')
  lines.push('操作会按代码块出现的顺序依次执行。')
  lines.push('如果不需要执行操作，直接用普通文本回复即可。')
  lines.push('')
  lines.push('## 重要提醒')
  lines.push('')
  lines.push('- 当用户描述一个贴纸时，拆解为多个操作组合完成')
  lines.push('- 注意使用 zIndex 控制元素层级：背景 zIndex=0，文字 zIndex=1+')
  lines.push('- 元素默认居中，如果不指定位置就是居中的')
  lines.push('- 颜色值使用 CSS 颜色格式，如 #ff0000, rgb(255,0,0)')
  lines.push('- 文字字号单位是 px，160 是正常大小，300+ 是标题大小')

  return lines.join('\n')
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

export function formatOperationResult(result: OperationResult): string {
  if (result.success) {
    return `✅ ${result.message}`
  }
  return `❌ ${result.message}`
}
