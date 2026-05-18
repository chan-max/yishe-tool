import { registerOperation, executeOperation } from '../registry'
import { captureCanvasForAI, getCanvasStateSummary } from '@/ai/capture'
import { directChat } from '@/ai/direct-client'

registerOperation({
  id: 'canvas.createAndAnalyze',
  name: '创建并分析设计',
  description: '自动创建设计、截图、AI 分析效果。用于自测试和迭代优化。返回分析结果和改进建议。',
  group: 'AI',
  params: [
    {
      name: 'description',
      label: '设计描述',
      type: 'string',
      required: true,
      placeholder: '描述你想要的设计效果',
      description: '用自然语言描述设计需求',
    },
    {
      name: 'style',
      label: '设计风格',
      type: 'select',
      default: 'auto',
      options: [
        { label: '自动选择', value: 'auto' },
        { label: '简约', value: 'minimal' },
        { label: '卡通', value: 'cartoon' },
        { label: '复古', value: 'vintage' },
        { label: '潮流', value: 'trendy' },
        { label: '优雅', value: 'elegant' },
      ],
      description: '设计风格偏好',
    },
    {
      name: 'iterations',
      label: '迭代次数',
      type: 'number',
      default: 1,
      min: 1,
      max: 5,
      description: '自动迭代优化次数（1-5）',
    },
  ],
  async execute(params, ctx) {
    const { description, style = 'auto', iterations = 1 } = params
    const results: Array<{ iteration: number; analysis: string; changes: string[] }> = []

    try {
      // 第一步：根据描述创建初始设计
      const createResult = await executeOperation(
        'canvas.createFromDescription',
        { description, width: 800, height: 800 },
        ctx
      )

      if (!createResult.success) {
        return { success: false, message: `创建设计失败: ${createResult.message}` }
      }

      // 根据风格调整
      if (style !== 'auto') {
        await applyStyle(style, ctx)
      }

      // 迭代优化循环
      for (let i = 0; i < iterations; i++) {
        // 等待渲染完成
        await new Promise(resolve => setTimeout(resolve, 500))

        // 截图并分析
        const imageBase64 = await captureCanvasForAI()
        const stateSummary = getCanvasStateSummary()

        const analysisPrompt = i === 0
          ? `请分析这个设计的效果，包括：
1. 整体视觉效果评分（1-10分）
2. 配色是否协调
3. 文字排版是否清晰
4. 构图是否平衡
5. 具体的改进建议（最多3条）

请用 JSON 格式返回：
{
  "score": 8,
  "colorHarmony": "描述",
  "typography": "描述",
  "composition": "描述",
  "suggestions": ["建议1", "建议2", "建议3"],
  "overall": "总体评价"
}`
          : `这是第 ${i + 1} 次迭代。请分析当前设计相比之前是否有改进，并给出进一步优化建议。

画布状态：
${stateSummary}

请用 JSON 格式返回分析结果。`

        const response = await directChat({
          messages: [
            {
              role: 'system',
              content: '你是一个专业的设计评审专家。请分析设计图片并给出专业、具体的评价和改进建议。'
            },
            {
              role: 'user',
              content: [
                { type: 'text', text: analysisPrompt },
                { type: 'image_url', image_url: { url: imageBase64 } }
              ]
            }
          ],
          temperature: 0.3,
        })

        // 解析分析结果
        let analysisText = ''
        const res = response as any
        if (res?.choices?.[0]?.message?.content) {
          analysisText = res.choices[0].message.content
        } else if (typeof res?.data === 'string') {
          analysisText = res.data
        } else {
          analysisText = JSON.stringify(response)
        }

        // 尝试解析 JSON
        let analysis: any
        try {
          const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            analysis = JSON.parse(jsonMatch[0])
          }
        } catch {
          analysis = { raw: analysisText }
        }

        const changes: string[] = []

        // 如果有改进建议且不是最后一次迭代，尝试应用改进
        if (analysis?.suggestions && analysis.suggestions.length > 0 && i < iterations - 1) {
          for (const suggestion of analysis.suggestions.slice(0, 2)) {
            // 根据建议尝试自动优化
            const applied = await applySuggestion(suggestion, ctx)
            if (applied) changes.push(applied)
          }
        }

        results.push({
          iteration: i + 1,
          analysis: analysisText,
          changes,
        })
      }

      return {
        success: true,
        message: `设计创建并分析完成，共 ${iterations} 次迭代`,
        data: {
          description,
          style,
          iterations: results,
          finalScore: results[results.length - 1]?.analysis,
        },
      }
    } catch (error: any) {
      return {
        success: false,
        message: `自测试失败: ${error?.message || '未知错误'}`,
      }
    }
  },
})

// 应用风格
async function applyStyle(style: string, ctx: any): Promise<void> {
  const styleConfigs: Record<string, { bg: string; text: string; weight: string }> = {
    minimal: { bg: '#f5f5f5', text: '#333333', weight: '400' },
    cartoon: { bg: '#fff3e0', text: '#e65100', weight: '700' },
    vintage: { bg: '#3e2723', text: '#ffe0b2', weight: '600' },
    trendy: { bg: '#000000', text: '#00ff00', weight: '900' },
    elegant: { bg: '#fafafa', text: '#1a1a1a', weight: '300' },
  }

  const config = styleConfigs[style]
  if (config) {
    await executeOperation('canvas.setBackgroundColor', { color: config.bg }, ctx)
    // 获取所有文字元素并调整样式
    const children = ctx.getCanvasChildren()
    for (const child of children) {
      if (child.type === 'text') {
        ctx.setChildProperty(child.id, 'fontColor', config.text)
        ctx.setChildProperty(child.id, 'fontWeight', config.weight)
      }
    }
  }
}

// 应用改进建议
async function applySuggestion(suggestion: string, ctx: any): Promise<string | null> {
  const lower = suggestion.toLowerCase()

  // 颜色相关建议
  if (lower.includes('颜色') || lower.includes('color') || lower.includes('对比度')) {
    const children = ctx.getCanvasChildren()
    const texts = children.filter((c: any) => c.type === 'text')
    if (texts.length > 0) {
      // 增加文字大小以提高可读性
      for (const text of texts) {
        const currentSize = typeof text.fontSize === 'object' ? text.fontSize.value : text.fontSize || 160
        ctx.setChildProperty(text.id, 'fontSize', Math.min(currentSize * 1.2, 500))
      }
      return '增大文字以提高可读性'
    }
  }

  // 大小相关建议
  if (lower.includes('大小') || lower.includes('size') || lower.includes('字号')) {
    const children = ctx.getCanvasChildren()
    const texts = children.filter((c: any) => c.type === 'text')
    if (texts.length > 0) {
      for (const text of texts) {
        const currentSize = typeof text.fontSize === 'object' ? text.fontSize.value : text.fontSize || 160
        ctx.setChildProperty(text.id, 'fontSize', Math.min(currentSize * 1.15, 500))
      }
      return '调整文字大小'
    }
  }

  // 间距相关建议
  if (lower.includes('间距') || lower.includes('spacing') || lower.includes('拥挤')) {
    const children = ctx.getCanvasChildren()
    const texts = children.filter((c: any) => c.type === 'text')
    if (texts.length >= 2) {
      // 调整元素间距
      for (let i = 1; i < texts.length; i++) {
        const currentTop = typeof texts[i].position?.top === 'object'
          ? texts[i].position.top.value
          : texts[i].position?.top || 0
        ctx.setChildProperty(texts[i].id, 'position.top', { value: currentTop + 20, unit: 'px' })
      }
      return '增加元素间距'
    }
  }

  return null
}

// 快速测试工具
registerOperation({
  id: 'canvas.quickTest',
  name: '快速测试设计',
  description: '快速创建一个测试设计并返回截图，用于验证工具链是否正常工作',
  group: 'AI',
  params: [
    {
      name: 'text',
      label: '测试文字',
      type: 'string',
      default: '测试',
      placeholder: '输入测试文字',
    },
  ],
  async execute(params, ctx) {
    const { text = '测试' } = params

    try {
      // 创建简单测试设计
      await executeOperation('canvas.setSize', { width: 600, height: 400 }, ctx)
      await executeOperation('canvas.setBackgroundColor', { color: '#4A90D9' }, ctx)
      await executeOperation('canvas.addText', {
        textContent: text,
        fontColor: '#ffffff',
        fontSize: 150,
        fontWeight: '700',
        center: true,
      }, ctx)

      // 等待渲染
      await new Promise(resolve => setTimeout(resolve, 300))

      // 截图
      const imageBase64 = await captureCanvasForAI()

      return {
        success: true,
        message: `测试设计已创建，截图大小: ${Math.round(imageBase64.length / 1024)}KB`,
        data: {
          imageSize: imageBase64.length,
          preview: imageBase64.substring(0, 100) + '...',
        },
      }
    } catch (error: any) {
      return {
        success: false,
        message: `快速测试失败: ${error?.message || '未知错误'}`,
      }
    }
  },
})
