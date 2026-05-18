import { registerOperation } from '../registry'

registerOperation({
  id: 'element.setTextAlign',
  name: '设置文字对齐',
  description: '设置指定文字元素的水平对齐方式',
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
      name: 'textAlign',
      label: '对齐方式',
      type: 'select',
      required: true,
      options: [
        { label: '左对齐', value: 'left' },
        { label: '居中', value: 'center' },
        { label: '右对齐', value: 'right' },
        { label: '两端对齐', value: 'justify' },
      ],
      description: '文字的水平对齐方式',
    },
  ],
  execute(params, ctx) {
    const { id, textAlign } = params
    const child = ctx.findChildById(id)
    if (!child) {
      return { success: false, message: `未找到 ID 为 ${id} 的元素` }
    }
    if (child.type !== 'text') {
      return { success: false, message: `元素 ${id} 不是文字类型` }
    }
    ctx.setChildProperty(id, 'textAlign', textAlign)
    return {
      success: true,
      message: `已将文字对齐方式设置为 ${textAlign}`,
      data: { id, textAlign },
    }
  },
})
