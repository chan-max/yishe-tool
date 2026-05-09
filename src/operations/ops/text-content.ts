import { registerOperation } from '../registry'

registerOperation({
  id: 'element.setTextContent',
  name: '设置文字内容',
  description: '设置指定文字元素的文字内容',
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
      name: 'textContent',
      label: '文字内容',
      type: 'string',
      required: true,
      placeholder: '输入新的文字内容',
      description: '要设置的文字内容',
    },
  ],
  execute(params, ctx) {
    const { id, textContent } = params
    const child = ctx.findChildById(id)
    if (!child) {
      return { success: false, message: `未找到 ID 为 ${id} 的元素` }
    }
    if (child.type !== 'text') {
      return { success: false, message: `元素 ${id} 不是文字类型` }
    }
    ctx.setChildProperty(id, 'textContent', textContent)
    return { success: true, message: `已将文字内容更新为 "${textContent}"`, data: { id, textContent } }
  },
})
