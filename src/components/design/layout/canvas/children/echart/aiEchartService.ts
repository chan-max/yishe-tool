import { aiChat } from '@/ai/api'
import { DESIGN_TOOL_FEATURE_CODES } from '@/ai/feature-codes'

export interface AiEchartResult {
    option: Record<string, any>
    raw: string
    usage?: any
}

export interface AiEchartCanvasInfo {
    width?: number
    height?: number
    unit?: string
}

const SYSTEM_PROMPT = `你是一个专业的 ECharts 图表配置生成助手。用户会描述想要的图表，你只需要输出一个可直接传给 echarts.setOption(option, true) 的 option JSON 对象。

规则：
1. 只输出 JSON 对象，不要输出解释文字
2. 可以用 \`\`\`json 包裹输出，也可以直接输出纯 JSON
3. option 必须是可 JSON 序列化的数据，不能包含函数、undefined、Date、RegExp、注释或尾逗号
4. 不要输出 dataset transform 自定义函数、formatter 函数、tooltip formatter 函数等 JavaScript 代码
5. 优先生成完整可渲染的配置，包含 title、tooltip、legend、grid、xAxis、yAxis、series 等必要字段
6. 颜色、数据和文案需要根据用户描述自行补齐，适合作为贴纸/画布中的静态视觉图表
7. 如果用户没有明确数据，请生成一组合理示例数据
8. 用户会提供画布尺寸。你必须根据画布宽高设置合理的 title.textStyle.fontSize、legend.textStyle.fontSize、axisLabel.fontSize、axisName.fontSize、grid 边距、series.label.fontSize 等视觉尺寸
9. 画布很小时减少标题、legend 和坐标轴占用，避免文字重叠；画布很大时适当增大字号和间距，避免视觉过小
10. 生成的 option 面向静态贴纸导出，优先保证首屏可读、构图均衡、留白合理

示例输出：
\`\`\`json
{
  "title": { "text": "月度销量", "left": "center" },
  "tooltip": { "trigger": "axis" },
  "xAxis": { "type": "category", "data": ["一月", "二月", "三月"] },
  "yAxis": { "type": "value" },
  "series": [
    { "type": "bar", "data": [120, 200, 150] }
  ]
}
\`\`\``

function extractJsonObject(text: string): Record<string, any> | null {
    const blocks = [...text.matchAll(/```(?:json)?\s*\n([\s\S]*?)```/g)]
    const candidates = blocks.length
        ? blocks.map((block) => block[1].trim()).reverse()
        : [text.trim()]

    for (const candidate of candidates) {
        try {
            const parsed = JSON.parse(candidate)
            if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
                return parsed
            }
        } catch {
            // Try extracting the outermost JSON object from mixed text below.
        }

        const start = candidate.indexOf('{')
        const end = candidate.lastIndexOf('}')
        if (start >= 0 && end > start) {
            try {
                const parsed = JSON.parse(candidate.slice(start, end + 1))
                if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
                    return parsed
                }
            } catch {
                // Continue to the next candidate.
            }
        }
    }

    return null
}

function buildCanvasPrompt(canvas?: AiEchartCanvasInfo): string {
    const width = Number(canvas?.width)
    const height = Number(canvas?.height)
    const unit = canvas?.unit || 'px'

    if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
        return ''
    }

    const minSide = Math.min(width, height)
    const maxSide = Math.max(width, height)
    const suggestedTitleFontSize = Math.max(14, Math.min(72, Math.round(minSide * 0.045)))
    const suggestedTextFontSize = Math.max(10, Math.min(42, Math.round(minSide * 0.026)))
    const suggestedLabelFontSize = Math.max(9, Math.min(36, Math.round(minSide * 0.022)))
    const suggestedGridPadding = Math.max(24, Math.min(160, Math.round(minSide * 0.08)))
    const aspectRatio = Number((width / height).toFixed(2))

    return [
        '当前画布信息：',
        `- 画布尺寸：${width} x ${height}${unit}`,
        `- 宽高比：${aspectRatio}`,
        `- 较短边：${minSide}${unit}，较长边：${maxSide}${unit}`,
        '请基于该尺寸决策图表视觉参数：',
        `- title.textStyle.fontSize 建议约 ${suggestedTitleFontSize}px，可按标题长度微调`,
        `- legend.textStyle.fontSize / axisName.fontSize 建议约 ${suggestedTextFontSize}px`,
        `- axisLabel.fontSize / series.label.fontSize 建议约 ${suggestedLabelFontSize}px`,
        `- grid.left/right/top/bottom 建议约 ${suggestedGridPadding}px，需考虑标题和 legend`,
        '- 如果画布较窄，legend 可放到底部或减少展示；如果画布较矮，减少标题和 grid top/bottom 占用',
        '- 所有 fontSize、padding、itemGap、symbolSize 等尺寸都使用数字像素值',
    ].join('\n')
}

function getResponseContent(response: any): { raw: string; usage?: any } {
    const data = response?.data ?? response
    if (typeof data === 'string') {
        return { raw: data }
    }

    const choice = data?.choices?.[0]
    const content = choice?.message?.content ?? choice?.text ?? ''
    return {
        raw: typeof content === 'string' ? content : JSON.stringify(content),
        usage: data?.usage,
    }
}

export async function generateEchartOption(
    prompt: string,
    currentOption?: Record<string, any>,
    canvas?: AiEchartCanvasInfo,
): Promise<AiEchartResult> {
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
        { role: 'system', content: SYSTEM_PROMPT },
    ]

    const canvasPrompt = buildCanvasPrompt(canvas)
    const currentOptionText = currentOption && Object.keys(currentOption).length
        ? `\n\n当前已有 option，可参考或替换：\n\`\`\`json\n${JSON.stringify(currentOption, null, 2)}\n\`\`\``
        : ''

    messages.push({
        role: 'user',
        content: `${canvasPrompt ? `${canvasPrompt}\n\n` : ''}用户需求：${prompt}${currentOptionText}`,
    })

    const response = await aiChat({
        featureCode: DESIGN_TOOL_FEATURE_CODES.chat,
        messages,
        temperature: 0.4,
        maxTokens: 5000,
    })

    const { raw, usage } = getResponseContent(response)
    if (!raw) {
        throw new Error('AI 未返回内容')
    }

    const option = extractJsonObject(raw)
    if (!option) {
        throw new Error('AI 未返回有效的 ECharts option JSON')
    }

    return { option, raw, usage }
}

export const aiEchartService = {
    generateEchartOption,
}
