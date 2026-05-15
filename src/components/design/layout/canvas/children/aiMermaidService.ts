import { aiChat } from '@/ai/api'
import { DESIGN_TOOL_FEATURE_CODES } from '@/ai/feature-codes'

export interface AiMermaidResult {
    source: string
    raw: string
    usage?: any
}

export interface AiMermaidConfigResult {
    config: Record<string, any>
    raw: string
    usage?: any
}

export interface AiMermaidContext {
    canvasWidth?: number
    canvasHeight?: number
    unit?: string
    elementWidth?: number
    elementHeight?: number
}

const SYSTEM_PROMPT = `你是 Mermaid 图表 DSL 生成助手。用户会用自然语言描述一个图表，你只需要输出可被 Mermaid 渲染的源码。

规则：
1. 只输出 Mermaid 源码，不要解释，不要输出 markdown
2. 不要包含 \`\`\`mermaid 代码围栏
3. 优先生成静态清晰的图表，不要依赖点击、链接、交互或外部资源
4. 可按需求选择 flowchart、sequenceDiagram、classDiagram、stateDiagram-v2、erDiagram、journey、gantt、pie、timeline、mindmap、quadrantChart、gitGraph 等 Mermaid 类型
5. 如果用户没有指定类型，选择最适合表达信息结构的 Mermaid 图表类型
6. 保持标签简洁，适合贴纸、海报、画布中静态展示
7. 如果提供了画布或元素尺寸，请自行决策复杂度、布局方向和文字长度，让静态图在该尺寸中可读
8. 如果当前已有 Mermaid 源码，可参考结构并生成替换后的完整源码`

const CONFIG_SYSTEM_PROMPT = `你是 Mermaid 原生配置生成助手。用户会描述希望图表呈现的视觉风格，你只需要输出 Mermaid config 对象。

规则：
1. 只输出一个对象，不要解释，不要 markdown，不要代码围栏
2. 只生成 Mermaid config，不要生成或改写 Mermaid source
3. 不要写函数、变量、import、外部资源、点击交互或链接
4. 深度自定义颜色、字体、字号时优先使用 theme: 'base' 和 themeVariables
5. 可配置 theme、themeVariables、flowchart、sequence、gantt、mindmap、timeline、securityLevel 等 Mermaid 支持字段
6. 请结合当前 Mermaid 源码和尺寸自行决策字体大小、线条粗细、颜色对比度与整体风格
7. 输出对象必须可被 JSON.parse 或 JavaScript object literal 解析`

function extractSource(text: string): string {
    const block = text.match(/```(?:mermaid)?\s*\r?\n([\s\S]*?)```/)
    return (block ? block[1] : text).trim()
}

function extractConfigText(text: string): string {
    const block = text.match(/```(?:json|js|javascript)?\s*\r?\n([\s\S]*?)```/)
    const source = (block ? block[1] : text).trim()
    const start = source.indexOf('{')
    const end = source.lastIndexOf('}')
    if (start >= 0 && end > start) {
        return source.slice(start, end + 1).trim()
    }
    return source
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

function buildContextText(context?: AiMermaidContext): string {
    if (!context) return ''
    const lines: string[] = []

    if (context.canvasWidth && context.canvasHeight) {
        lines.push(`当前画布尺寸：${context.canvasWidth} x ${context.canvasHeight}${context.unit || 'px'}`)
    }
    if (context.elementWidth && context.elementHeight) {
        lines.push(`当前 Mermaid 元素尺寸：${Math.round(context.elementWidth)} x ${Math.round(context.elementHeight)}px`)
    }

    return lines.length ? `\n\n尺寸上下文：\n${lines.join('\n')}` : ''
}

function parseConfigObject(text: string): Record<string, any> {
    const source = extractConfigText(text)
    if (!source) {
        throw new Error('AI 未返回有效配置')
    }

    try {
        const parsed = JSON.parse(source)
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
            return parsed
        }
    } catch {
        // Continue with JavaScript object literal parsing.
    }

    try {
        const parsed = Function(
            '"use strict";\n' +
            'const window = undefined, document = undefined, globalThis = undefined, global = undefined, process = undefined, require = undefined, importScripts = undefined, fetch = undefined, XMLHttpRequest = undefined;\n' +
            `return (${source});`,
        )()
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
            return parsed
        }
    } catch (error: any) {
        throw new Error(error?.message ? `配置解析失败：${error.message}` : '配置解析失败')
    }

    throw new Error('AI 返回的配置必须是对象')
}

export async function generateMermaidSource(prompt: string, currentSource?: string, context?: AiMermaidContext): Promise<AiMermaidResult> {
    const currentSourceText = currentSource
        ? `\n\n当前 Mermaid 源码，可参考或替换：\n${currentSource}`
        : ''
    const contextText = buildContextText(context)

    const response = await aiChat({
        featureCode: DESIGN_TOOL_FEATURE_CODES.chat,
        messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: `用户需求：${prompt}${contextText}${currentSourceText}` },
        ],
        temperature: 0.25,
        maxTokens: 2200,
    })

    const { raw, usage } = getResponseContent(response)
    if (!raw) {
        throw new Error('AI 未返回内容')
    }

    const source = extractSource(raw)
    if (!source) {
        throw new Error('AI 未返回有效 Mermaid 源码')
    }

    return { source, raw, usage }
}

export async function generateMermaidConfig(
    prompt: string,
    currentSource?: string,
    currentConfig?: Record<string, any>,
    context?: AiMermaidContext,
): Promise<AiMermaidConfigResult> {
    const contextText = buildContextText(context)
    const currentSourceText = currentSource
        ? `\n\n当前 Mermaid 源码（仅用于判断图类型和复杂度，不要改写）：\n${currentSource}`
        : ''
    const currentConfigText = currentConfig
        ? `\n\n当前 Mermaid config，可参考或替换：\n${JSON.stringify(currentConfig, null, 2)}`
        : ''

    const response = await aiChat({
        featureCode: DESIGN_TOOL_FEATURE_CODES.chat,
        messages: [
            { role: 'system', content: CONFIG_SYSTEM_PROMPT },
            { role: 'user', content: `用户视觉需求：${prompt}${contextText}${currentSourceText}${currentConfigText}` },
        ],
        temperature: 0.25,
        maxTokens: 1800,
    })

    const { raw, usage } = getResponseContent(response)
    if (!raw) {
        throw new Error('AI 未返回内容')
    }

    return {
        config: parseConfigObject(raw),
        raw,
        usage,
    }
}

export const aiMermaidService = {
    generateMermaidSource,
    generateMermaidConfig,
}
