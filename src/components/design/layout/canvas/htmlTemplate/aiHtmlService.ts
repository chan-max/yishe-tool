import { aiChat } from '@/ai/api'
import { DESIGN_TOOL_FEATURE_CODES } from '@/ai/feature-codes'

export type AiHtmlMode = 'generate' | 'modify' | 'bindings'

export interface AiHtmlResult {
  html: string
  raw: string
  unchanged?: boolean
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

const SYSTEM_PROMPT_GENERATE = `你是一个专业的 HTML/CSS 前端设计师。用户会用自然语言描述他们想要的视觉效果，你需要生成一个完整的 HTML 片段（包含内联 <style> 标签）。

规则：
1. 生成的 HTML 必须包含一个根容器，宽高设为 100%（width: 100%; height: 100%），因为它会被放入一个有固定尺寸的画布容器中
2. 所有样式必须写在 <style> 标签内，不要使用外部 CSS 或 JavaScript
3. 使用现代 CSS（flexbox、grid 等）来实现布局
4. 不要使用 <script> 标签
5. 不要使用外部图片链接，用纯 CSS 实现所有视觉效果
6. 你可以使用 {{text.xxx}}、{{color.xxx}}、{{font.xxx.family}}、{{image.xxx.url}} 等魔术变量，但不是必须的
7. 只输出 HTML 代码，不要输出任何解释文字
8. 用 \`\`\`html 包裹你的输出

魔术变量规范：
- 文本：{{text.字段名}} 如 {{text.title}}、{{text.subtitle}}
- 颜色：{{color.字段名}} 如 {{color.primary}}、{{color.background}}
- 字体：{{font.字段名.family}} 如 {{font.title.family}}
- 图片：{{image.字段名.url}} 如 {{image.logo.url}}

示例：
\`\`\`html
<style>
.card { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: {{color.background}}; }
.card__title { font-size: 24px; color: {{color.text}}; font-family: {{font.title.family}}; }
</style>
<div class="card">
  <div class="card__title">{{text.title}}</div>
</div>
\`\`\``

const SYSTEM_PROMPT_MODIFY = `你是一个专业的 HTML/CSS 前端设计师。用户会提供当前的 HTML 代码和修改需求，你需要对代码进行修改。

你拥有完全的修改自由度，可以修改 CSS 样式、HTML 结构、魔术变量中的任意部分。

重要规则 - 关于魔术变量 {{xxx}} 的处理：
- 模板中可能包含 {{color.xxx}}、{{text.xxx}} 等魔术变量
- 当用户要求修改某个属性（如"背景改为红色"），如果该属性使用了魔术变量（如 background:{{color.background}}），你必须直接将魔术变量替换为具体的值（如 background:#ff0000）
- 绝对不能原封不动地返回魔术变量，除非用户明确说"保留变量"
- 你可以自由决定是用魔术变量还是用具体值来实现用户的要求

其他规则：
1. 只输出修改后的完整 HTML 代码
2. 所有样式必须写在 <style> 标签内
3. 不要使用 <script> 标签
4. 不要输出解释文字，不要输出修改前的代码
5. 用一个 \`\`\`html 包裹你的输出，不要输出多个代码块`

const SYSTEM_PROMPT_BINDINGS = `你是一个专业的文案和设计助手。用户会提供当前的 HTML 代码（包含魔术变量），你需要根据用户的要求生成新的变量值。

规则：
1. 不要修改 HTML 结构，只输出新的变量值
2. 以 JSON 格式输出一个对象，key 是魔术变量的完整路径，value 是新的值
3. 只输出 JSON，不要输出其他内容
4. 用 \`\`\`json 包裹你的输出
5. 保留用户没有提到要修改的变量不变（不在 JSON 中输出它们）

示例输入 HTML：
<div class="card"><div class="title">{{text.title}}</div><div style="color:{{color.primary}}">...</div></div>

示例用户请求："把标题改成 限时特惠，主色改成红色"

示例输出：
\`\`\`json
{
  "text.title": "限时特惠",
  "color.primary": "#ff0000"
}
\`\`\``

function extractHtml(text: string): string {
  const allBlocks = [...text.matchAll(/```html\s*\n([\s\S]*?)```/g)]
  if (allBlocks.length > 0) {
    return allBlocks[allBlocks.length - 1][1].trim()
  }

  const styleMatch = text.match(/<style[\s\S]*?<\/style>/i)
  const divMatch = text.match(/<div[\s\S]*<\/div>/i)
  if (styleMatch && divMatch) {
    return styleMatch[0] + '\n' + divMatch[0]
  }

  if (text.trim().startsWith('<')) return text.trim()

  return ''
}

function extractJson(text: string): Record<string, any> | null {
  const allBlocks = [...text.matchAll(/```json\s*\n([\s\S]*?)```/g)]
  const raw = allBlocks.length > 0
    ? allBlocks[allBlocks.length - 1][1].trim()
    : text.trim()
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function parseResponseContent(raw: string): { content: string; usage?: any } {
  return { content: raw, usage: undefined }
}

async function callAiChat(messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>): Promise<{ raw: string; content: string; usage?: any }> {
  const res = await aiChat({
    featureCode: DESIGN_TOOL_FEATURE_CODES.chat,
    messages,
    temperature: 0.7,
    maxTokens: 4000,
  })

  const data = res?.data ?? res
  const choice = data?.choices?.[0]
  const raw: string = choice?.message?.content ?? ''
  if (!raw) {
    throw new Error('AI 未返回内容')
  }

  return { raw, content: raw, usage: data?.usage }
}

export async function generateHtml(prompt: string): Promise<AiHtmlResult> {
  const { raw, content, usage } = await callAiChat([
    { role: 'system', content: SYSTEM_PROMPT_GENERATE },
    { role: 'user', content: prompt },
  ])

  const html = extractHtml(content)
  if (!html) {
    throw new Error('AI 未返回有效的 HTML 代码，请尝试更具体的描述')
  }

  return { html, raw, usage }
}

export async function modifyHtml(currentHtml: string, prompt: string): Promise<AiHtmlResult> {
  const { raw, content, usage } = await callAiChat([
    { role: 'system', content: SYSTEM_PROMPT_MODIFY },
    { role: 'user', content: `当前 HTML 代码：\n\n\`\`\`html\n${currentHtml}\n\`\`\`\n\n修改需求：${prompt}` },
  ])

  const html = extractHtml(content)
  if (!html) {
    throw new Error('AI 未返回有效的 HTML 代码，请尝试更具体的描述')
  }

  const normalizedCurrent = currentHtml.replace(/\s+/g, '').trim()
  const normalizedResult = html.replace(/\s+/g, '').trim()
  const unchanged = normalizedCurrent === normalizedResult

  return { html, raw, usage, unchanged }
}

export interface AiBindingsResult {
  bindings: Record<string, any>
  raw: string
  usage?: any
}

export async function modifyBindings(
  currentHtml: string,
  currentBindings: Record<string, any>,
  prompt: string,
): Promise<AiBindingsResult> {
  const { raw, content, usage } = await callAiChat([
    { role: 'system', content: SYSTEM_PROMPT_BINDINGS },
    {
      role: 'user',
      content: `当前 HTML 代码：\n\n\`\`\`html\n${currentHtml}\n\`\`\`\n\n当前变量值：\n\`\`\`json\n${JSON.stringify(currentBindings, null, 2)}\n\`\`\`\n\n用户请求：${prompt}`,
    },
  ])

  const bindings = extractJson(content)
  if (!bindings) {
    throw new Error('AI 未返回有效的 JSON 数据，请尝试更明确的描述')
  }

  return { bindings, raw, usage }
}

export const aiHtmlService = {
  generateHtml,
  modifyHtml,
  modifyBindings,
}
