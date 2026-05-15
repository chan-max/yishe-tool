import { aiChat } from '@/ai/api'
import { DESIGN_TOOL_FEATURE_CODES } from '@/ai/feature-codes'

export interface AiCodeBlockResult {
    source: string
    raw: string
    usage?: any
}

const SYSTEM_PROMPT = `你是代码片段生成助手。用户会描述希望展示的代码块内容，你只需要输出代码本体。

规则：
1. 只输出代码，不要解释，不要 markdown，不要代码围栏
2. 按用户或当前语言生成可读、完整、适合静态展示的短代码片段
3. 不要改动任何样式、主题、字号、文件名或布局
4. 如果当前已有代码，可参考并生成替换后的完整代码`

function extractCode(text: string): string {
    const block = text.match(/```(?:[\w#+.-]+)?\s*\r?\n([\s\S]*?)```/)
    return (block ? block[1] : text).trim()
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

export async function generateCodeBlockSource(
    prompt: string,
    language?: string,
    currentSource?: string,
): Promise<AiCodeBlockResult> {
    const languageText = language ? `\n\n当前代码语言：${language}` : ''
    const currentSourceText = currentSource
        ? `\n\n当前代码，可参考或替换：\n${currentSource}`
        : ''

    const response = await aiChat({
        featureCode: DESIGN_TOOL_FEATURE_CODES.chat,
        messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: `用户需求：${prompt}${languageText}${currentSourceText}` },
        ],
        temperature: 0.25,
        maxTokens: 2200,
    })

    const { raw, usage } = getResponseContent(response)
    if (!raw) {
        throw new Error('AI 未返回内容')
    }

    const source = extractCode(raw)
    if (!source) {
        throw new Error('AI 未返回有效代码')
    }

    return { source, raw, usage }
}

export const aiCodeBlockService = {
    generateCodeBlockSource,
}
