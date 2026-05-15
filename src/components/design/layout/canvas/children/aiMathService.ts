import { aiChat } from '@/ai/api'
import { DESIGN_TOOL_FEATURE_CODES } from '@/ai/feature-codes'

export interface AiMathResult {
    formula: string
    raw: string
    usage?: any
}

const SYSTEM_PROMPT = `你是一个 KaTeX 公式生成助手。用户会用自然语言描述数学公式、化学式或化学反应方程式，你只需要输出可被 KaTeX 渲染的公式字符串。

规则：
1. 只输出公式本体，不要输出解释文字
2. 不要包含 $、$$、\\(、\\)、\\[、\\] 这些公式包裹符
3. 不要输出 markdown
4. 可以使用 KaTeX 支持的常见 LaTeX 数学命令，例如 \\frac、\\sqrt、\\sum、\\int、\\lim、\\begin{matrix} 等
5. 化学式、离子、同位素、反应式优先使用 mhchem 语法，例如 \\ce{H2O}、\\ce{2H2 + O2 -> 2H2O}、\\ce{SO4^2-}
6. 物理/化学单位可使用 \\pu{...}，例如 \\pu{9.8 m/s2}
7. 如果用户输入已经是 LaTeX 或 mhchem，请整理为可直接渲染的公式字符串
8. 不要改动任何样式、颜色、字号或布局，只负责公式内容`

function extractFormula(text: string): string {
    const block = text.match(/```(?:tex|latex)?\s*\n([\s\S]*?)```/)
    let formula = (block ? block[1] : text).trim()

    formula = formula
        .replace(/^\$\$([\s\S]*)\$\$$/, '$1')
        .replace(/^\$([\s\S]*)\$$/, '$1')
        .replace(/^\\\(([\s\S]*)\\\)$/, '$1')
        .replace(/^\\\[([\s\S]*)\\\]$/, '$1')
        .trim()

    return formula
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

export async function generateMathFormula(prompt: string, currentFormula?: string): Promise<AiMathResult> {
    const currentFormulaText = currentFormula
        ? `\n\n当前公式，可参考或替换：\n${currentFormula}`
        : ''

    const response = await aiChat({
        featureCode: DESIGN_TOOL_FEATURE_CODES.chat,
        messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: `用户需求：${prompt}${currentFormulaText}` },
        ],
        temperature: 0.2,
        maxTokens: 1200,
    })

    const { raw, usage } = getResponseContent(response)
    if (!raw) {
        throw new Error('AI 未返回内容')
    }

    const formula = extractFormula(raw)
    if (!formula) {
        throw new Error('AI 未返回有效公式')
    }

    return { formula, raw, usage }
}

export const aiMathService = {
    generateMathFormula,
}
