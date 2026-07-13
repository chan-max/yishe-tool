import { registerOperation } from '../registry'
import { searchDesignKnowledge } from '@/api'

registerOperation({
  id: 'resource.searchDesignKnowledge',
  name: '搜索设计知识库',
  description: `从设计知识库进行语义搜索，返回与用户问题相关的设计知识（CSS 技巧、颜色值、代码配置、设计原则等）。

典型场景：
- 用户询问某个 CSS 效果如何实现
- 需要查找已保存的设计规范或配色方案
- 查找模板使用技巧`,
  group: '资源',
  params: [
    {
      name: 'query',
      label: '搜索内容',
      type: 'string',
      placeholder: '描述你想查找的设计知识',
      description: '自然语言描述，支持语义搜索',
    },
    {
      name: 'category',
      label: '分类',
      type: 'select',
      options: [
        { label: '不限', value: '' },
        { label: 'CSS技巧', value: 'css-trick' },
        { label: '颜色值', value: 'color-value' },
        { label: '代码配置', value: 'code-config' },
        { label: '设计原则', value: 'design-principle' },
        { label: '模板技巧', value: 'template-tip' },
        { label: '其他', value: 'other' },
      ],
      default: '',
      description: '按分类筛选知识条目',
    },
    {
      name: 'limit',
      label: '返回数量',
      type: 'number',
      default: 5,
      min: 1,
      max: 10,
      description: '返回的知识条目数量',
    },
  ],
  async execute(params) {
    const { query, category, limit = 5 } = params

    if (!query || !String(query).trim()) {
      return {
        success: false,
        message: '请提供搜索内容（query 参数）',
      }
    }

    try {
      const results = await searchDesignKnowledge({
        query: String(query).trim(),
        limit,
        ...(category ? { category } : {}),
      })

      const items = (Array.isArray(results) ? results : [])
        .map((item: any) => ({
          id: item.id || item.sourceId,
          title: item.title || item.payload?.title || '未命名',
          content: item.content || item.payload?.content || '',
          category: item.category || item.payload?.category,
          tags: item.tags || item.payload?.tags || [],
          score: item.score,
        }))
        .filter((item) => item.content)

      if (items.length === 0) {
        return {
          success: true,
          message: `未找到与"${query}"相关的设计知识。建议：\n1. 换更具体的关键词\n2. 在知识库面板手动录入相关知识`,
          data: { items: [], total: 0 },
        }
      }

      const summary = items
        .map((item, idx) => {
          const preview = item.content.length > 80
            ? `${item.content.slice(0, 80)}...`
            : item.content
          return `  ${idx + 1}. ${item.title} [${item.category || '未分类'}]\n     ${preview}`
        })
        .join('\n')

      return {
        success: true,
        message: `找到 ${items.length} 条设计知识：\n${summary}`,
        data: {
          items,
          total: items.length,
        },
      }
    } catch (err: any) {
      return {
        success: false,
        message: `搜索失败: ${err?.message || '未知错误'}`,
      }
    }
  },
})
