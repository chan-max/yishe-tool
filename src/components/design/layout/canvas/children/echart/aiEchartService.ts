import { aiChat } from '@/ai/api'
import { DESIGN_TOOL_FEATURE_CODES } from '@/ai/feature-codes'

export interface AiEchartResult {
    option: Record<string, any>
    raw: string
    usage?: any
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

export async function generateEchartOption(prompt: string, currentOption?: Record<string, any>): Promise<AiEchartResult> {
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
        { role: 'system', content: SYSTEM_PROMPT },
    ]

    const currentOptionText = currentOption && Object.keys(currentOption).length
        ? `\n\n当前已有 option，可参考或替换：\n\`\`\`json\n${JSON.stringify(currentOption, null, 2)}\n\`\`\``
        : ''

    messages.push({
        role: 'user',
        content: `用户需求：${prompt}${currentOptionText}`,
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
