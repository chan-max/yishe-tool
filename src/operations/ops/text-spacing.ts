import { registerOperation } from '../registry'

registerOperation({
  id: 'element.setLineHeight',
  name: '设置行高',
  description: '设置文字元素的行高（行间距）',
  group: '文字',
  params: [
    {
      name: 'id',
      label: '元素 ID',
      type: 'string',
      required: true,
      placeholder: '文字元素的 ID',
      description: '文字元素的唯一标识符',
    },
    {
      name: 'lineHeight',
      label: '行高',
      type: 'number',
      required: true,
      min: 0.5,
      max: 10,
      placeholder: '1.5',
      description: '行高倍数（1.5 表示 1.5 倍行高）',
    },
  ],
  execute(params, ctx) {
    const { id, lineHeight } = params
    const child = ctx.findChildById(id)
    if (!child) {
      return { success: false, message: `未找到 ID 为 ${id} 的元素` }
    }
    if (child.type !== 'text') {
      return { success: false, message: `元素 ${id} 不是文字类型` }
    }

    ctx.setChildProperty(id, 'lineHeight', lineHeight)

    return {
      success: true,
      message: `已设置文字行高为 ${lineHeight}`,
      data: { id, lineHeight },
    }
  },
})

registerOperation({
  id: 'element.setLetterSpacing',
  name: '设置字间距',
  description: '设置文字元素的字间距',
  group: '文字',
  params: [
    {
      name: 'id',
      label: '元素 ID',
      type: 'string',
      required: true,
      placeholder: '文字元素的 ID',
      description: '文字元素的唯一标识符',
    },
    {
      name: 'letterSpacing',
      label: '字间距',
      type: 'number',
      required: true,
      min: -50,
      max: 100,
      placeholder: '0',
      description: '字间距（px）',
    },
  ],
  execute(params, ctx) {
    const { id, letterSpacing } = params
    const child = ctx.findChildById(id)
    if (!child) {
      return { success: false, message: `未找到 ID 为 ${id} 的元素` }
    }
    if (child.type !== 'text') {
      return { success: false, message: `元素 ${id} 不是文字类型` }
    }

    ctx.setChildProperty(id, 'letterSpacing', letterSpacing)

    return {
      success: true,
      message: `已设置字间距为 ${letterSpacing}px`,
      data: { id, letterSpacing },
    }
  },
})
