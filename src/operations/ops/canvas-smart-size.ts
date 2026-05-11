import { registerOperation } from '../registry'
import { sizePresets, searchPresets, SIZE_PRESET_CATEGORIES } from './size-presets'

const UNIT_CONVERSION: Record<string, number> = {
  px: 1,
  mm: 3.7795275591,
  cm: 37.795275591,
  in: 96,
}

function normalizeToPx(value: number, unit: string, dpi = 300): number {
  if (unit === 'px') return value
  if (unit === 'in') return value * dpi
  if (unit === 'mm') return (value / 25.4) * dpi
  if (unit === 'cm') return (value / 2.54) * dpi
  return value * (UNIT_CONVERSION[unit] || 1)
}

function parseSizeString(input: string): { width: number; height: number; unit: string } | null {
  const cleaned = input.replace(/\s+/g, '').toLowerCase()

  const patterns = [
    /(\d+(?:\.\d+)?)\s*[x×X＊*]\s*(\d+(?:\.\d+)?)\s*(px|mm|cm|in)?/,
    /(\d+(?:\.\d+)?)\s*(px|mm|cm|in)\s*[x×X＊*]\s*(\d+(?:\.\d+)?)\s*(px|mm|cm|in)?/,
  ]

  for (const pattern of patterns) {
    const match = cleaned.match(pattern)
    if (match) {
      const width = parseFloat(match[1])
      const height = parseFloat(match[2])
      const unit = match[3] || 'px'
      if (!isNaN(width) && !isNaN(height) && width > 0 && height > 0) {
        return { width, height, unit }
      }
    }
  }

  return null
}

interface SmartSizeResult {
  presetId?: string
  presetName?: string
  width: number
  height: number
  unit: string
  printArea?: { width: number; height: number; unit: string }
  dpi?: number
  source: 'preset' | 'parsed' | 'ai_reasoning'
  reason: string
}

const PRODUCT_SIZE_RULES: Array<{
  keywords: string[]
  presetId: string
  reason: string
}> = [
  { keywords: ['t恤', 'tshirt', 'tee', '短袖', '上衣'], presetId: 'tee-front-large', reason: 'T恤前胸印花区域' },
  { keywords: ['t恤后背', 'tee back', 't恤背面'], presetId: 'tee-back', reason: 'T恤后背印花区域' },
  { keywords: ['卫衣', 'hoodie', '连帽衫', '帽衫'], presetId: 'hoodie-front', reason: '卫衣前胸印花区域' },
  { keywords: ['卫衣后背', 'hoodie back'], presetId: 'hoodie-back', reason: '卫衣后背印花区域' },
  { keywords: ['马克杯', 'mug', '杯子', '咖啡杯'], presetId: 'mug-11oz', reason: '标准马克杯印花区域' },
  { keywords: ['手机壳', 'phone case', 'iphone', '手机套'], presetId: 'phone-iphone-15', reason: 'iPhone 手机壳' },
  { keywords: ['海报', 'poster', '招贴'], presetId: 'poster-a3', reason: 'A3 海报' },
  { keywords: ['贴纸', 'sticker', '粘贴'], presetId: 'sticker-3x3', reason: '3英寸圆形贴纸' },
  { keywords: ['鼠标垫', 'mousepad', '鼠标垫'], presetId: 'mousepad-standard', reason: '标准鼠标垫' },
  { keywords: ['桌垫', 'deskmat', '桌面垫'], presetId: 'deskmat-xl', reason: '超大桌垫' },
  { keywords: ['帆布袋', 'tote', '托特袋', '环保袋'], presetId: 'tote-standard', reason: '标准帆布袋' },
  { keywords: ['帽子', 'cap', '棒球帽', '鸭舌帽'], presetId: 'cap-front', reason: '棒球帽正面' },
  { keywords: ['抱枕', 'pillow', '靠垫', '枕头'], presetId: 'pillow-18x18', reason: '18英寸抱枕' },
  { keywords: ['名片', 'business card'], presetId: 'business-card', reason: '标准名片' },
  { keywords: ['明信片', 'postcard'], presetId: 'postcard', reason: '标准明信片' },
  { keywords: ['贺卡', 'greeting card', '生日卡'], presetId: 'greeting-card-5x7', reason: '5×7英寸贺卡' },
  { keywords: ['社交媒体', 'social', 'instagram', '微信', '朋友圈', '方形图'], presetId: 'social-square', reason: '社交媒体方形图' },
  { keywords: ['story', '故事', '竖版图', '短视频封面'], presetId: 'social-story', reason: '社交媒体竖版故事' },
  { keywords: ['小图', 'logo', '胸标', '左胸', '右胸'], presetId: 'tee-front-small', reason: 'T恤胸前小图区域' },
]

function matchProductRule(text: string): SmartSizeResult | null {
  const lower = text.toLowerCase()
  for (const rule of PRODUCT_SIZE_RULES) {
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      const preset = sizePresets.find((p) => p.id === rule.presetId)
      if (preset) {
        return {
          presetId: preset.id,
          presetName: preset.name,
          width: preset.width,
          height: preset.height,
          unit: preset.unit,
          printArea: preset.printArea,
          dpi: preset.dpi,
          source: 'preset',
          reason: rule.reason,
        }
      }
    }
  }
  return null
}

registerOperation({
  id: 'canvas.smartSize',
  name: '智能设置画布尺寸',
  description: '根据自然语言描述智能推断并设置画布尺寸。支持产品名称、具体尺寸数值、分类关键词等。',
  group: '画布',
  params: [
    {
      name: 'description',
      label: '尺寸描述',
      type: 'string',
      required: true,
      placeholder: '如：T恤前胸、A3海报、4000x5000px、马克杯、Instagram 方形图',
      description: '用自然语言描述你想要的画布尺寸，可以是产品名称、具体尺寸、或分类',
    },
  ],
  execute(params, ctx) {
    const { description } = params

    if (!description || !description.trim()) {
      return {
        success: false,
        message: `请提供尺寸描述。支持：产品名称（T恤、马克杯、手机壳）、具体尺寸（4000x5000px）、分类（${SIZE_PRESET_CATEGORIES.join('、')}）`,
      }
    }

    const trimmed = description.trim()

    const parsed = parseSizeString(trimmed)
    if (parsed) {
      const pxW = Math.round(normalizeToPx(parsed.width, parsed.unit))
      const pxH = Math.round(normalizeToPx(parsed.height, parsed.unit))
      const finalW = Math.max(10, Math.min(20000, pxW))
      const finalH = Math.max(10, Math.min(20000, pxH))

      ctx.setCanvasSize(finalW, finalH, 'px')

      return {
        success: true,
        message: `已按您指定的尺寸设置画布：${finalW}×${finalH} px` +
          (parsed.unit !== 'px' ? `（从 ${parsed.width}×${parsed.height} ${parsed.unit} 转换）` : ''),
        data: {
          width: finalW,
          height: finalH,
          unit: 'px',
          source: 'parsed',
          originalValue: `${parsed.width}x${parsed.height}${parsed.unit}`,
        },
      }
    }

    const presetResults = searchPresets(trimmed)
    if (presetResults.length === 1) {
      const preset = presetResults[0]
      ctx.setCanvasSize(preset.width, preset.height, preset.unit)
      return {
        success: true,
        message: `已将画布设置为「${preset.name}」尺寸：${preset.width}×${preset.height} ${preset.unit}` +
          (preset.printArea ? `（印刷区 ${preset.printArea.width}×${preset.printArea.height} ${preset.printArea.unit}）` : ''),
        data: {
          presetId: preset.id,
          presetName: preset.name,
          width: preset.width,
          height: preset.height,
          unit: preset.unit,
          printArea: preset.printArea,
          dpi: preset.dpi,
          source: 'preset',
          reason: `关键词匹配到 ${preset.name}`,
        },
      }
    }

    const ruleMatch = matchProductRule(trimmed)
    if (ruleMatch) {
      ctx.setCanvasSize(ruleMatch.width, ruleMatch.height, ruleMatch.unit)
      return {
        success: true,
        message: `已将画布设置为「${ruleMatch.presetName}」尺寸：${ruleMatch.width}×${ruleMatch.height} ${ruleMatch.unit}（${ruleMatch.reason}）`,
        data: ruleMatch,
      }
    }

    if (presetResults.length > 1) {
      const top = presetResults[0]
      ctx.setCanvasSize(top.width, top.height, top.unit)
      return {
        success: true,
        message: `已将画布设置为「${top.name}」尺寸：${top.width}×${top.height} ${top.unit}。其他匹配：${presetResults.slice(1, 4).map((p) => p.name).join('、')}`,
        data: {
          presetId: top.id,
          presetName: top.name,
          width: top.width,
          height: top.height,
          unit: top.unit,
          printArea: top.printArea,
          dpi: top.dpi,
          source: 'preset',
          reason: `模糊匹配，共 ${presetResults.length} 个候选`,
          alternatives: presetResults.slice(1, 4).map((p) => ({ id: p.id, name: p.name })),
        },
      }
    }

    return {
      success: false,
      message: `无法根据「${trimmed}」推断尺寸。请尝试：\n1. 产品名称：${SIZE_PRESET_CATEGORIES.join('、')}\n2. 具体尺寸：4000x5000px 或 10x10cm\n3. 预设 ID：tee-front-large、mug-11oz 等`,
    }
  },
})
