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
    chartWidth?: number
    chartHeight?: number
}

const SYSTEM_PROMPT = `你是一个专业的 ECharts 图表配置生成助手。用户会描述想要的图表，你只需要输出一个可直接传给 echarts.setOption(option, true) 的 option JSON 对象。

规则：
1. 只输出 JSON 对象，不要输出解释文字
2. 可以用 \`\`\`json 包裹输出，也可以直接输出纯 JSON
3. option 必须是可 JSON 序列化的数据，不能包含函数、undefined、Date、RegExp、注释或尾逗号
4. 不要输出 dataset transform 自定义函数、formatter 函数、tooltip formatter 函数等 JavaScript 代码
5. 优先生成完整可渲染的静态配置，包含 title、legend、grid、xAxis、yAxis、series 等必要字段
6. 颜色、数据和文案需要根据用户描述自行补齐，适合作为贴纸/画布中的静态视觉图表
7. 如果用户没有明确数据，请生成一组合理示例数据
8. 用户会提供画布尺寸和图表元素实际渲染尺寸。你必须基于图表元素实际渲染尺寸设置合理的 title.textStyle.fontSize、legend.textStyle.fontSize、axisLabel.fontSize、axisName.fontSize、grid 边距、series.label.fontSize 等视觉尺寸
9. 画布/图表很小时减少标题、legend 和坐标轴占用，避免文字重叠；画布/图表很大时必须显著增大字号和间距，避免导出或缩放预览时文字过小
10. 生成的 option 面向静态贴纸导出，优先保证首屏可读、构图均衡、留白合理
11. 不要套用网页仪表盘的小字号。请自己根据图表渲染尺寸、标题长度、数据密度、导出可读性和构图权衡字号、边距、线宽、点大小等参数
12. 图表只用于静态渲染，不需要动画、hover、tooltip 或 toolbox；不要生成 tooltip、toolbox、brush、dataZoom、emphasis 动态交互配置；必须设置 animation:false、animationDuration:0、animationDurationUpdate:0

示例输出：
\`\`\`json
{
  "title": { "text": "月度销量", "left": "center" },
  "animation": false,
  "animationDuration": 0,
  "animationDurationUpdate": 0,
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
    const canvasWidth = Number(canvas?.width)
    const canvasHeight = Number(canvas?.height)
    const chartWidth = Number(canvas?.chartWidth)
    const chartHeight = Number(canvas?.chartHeight)
    const unit = canvas?.unit || 'px'
    const width = Number.isFinite(chartWidth) && chartWidth > 0 ? chartWidth : canvasWidth
    const height = Number.isFinite(chartHeight) && chartHeight > 0 ? chartHeight : canvasHeight

    if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
        return ''
    }

    const minSide = Math.min(width, height)
    const maxSide = Math.max(width, height)
    const aspectRatio = Number((width / height).toFixed(2))

    return [
        '当前画布信息：',
        `- 画布尺寸：${canvasWidth} x ${canvasHeight}${unit}`,
        `- ECharts 元素实际渲染尺寸：${width} x ${height}px`,
        `- 图表渲染区域宽高比：${aspectRatio}`,
        `- 图表渲染区域较短边：${minSide}px，较长边：${maxSide}px`,
        '请你自主基于 ECharts 元素实际渲染尺寸决策图表视觉参数：',
        '- 需要明确设置 title.textStyle.fontSize、legend.textStyle.fontSize、axisLabel.fontSize、axisName.fontSize、series.label.fontSize 等字号',
        '- 需要明确设置 grid.left/right/top/bottom，确保标题、legend、坐标轴标签和图表主体不互相挤压',
        '- 需要按图表尺寸自主设置 lineStyle.width、symbolSize、barWidth、itemStyle.borderWidth、legend.itemWidth/itemHeight/itemGap 等视觉参数',
        '- 如果图表区域较窄，legend 可放到底部、右侧或减少展示；如果图表区域较矮，需要控制标题和 grid top/bottom 占用',
        '- 你的目标是让导出后的静态贴纸在整体画布预览和成品图中都清晰可读',
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
