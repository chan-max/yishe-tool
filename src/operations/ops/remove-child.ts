import { registerOperation } from '../registry'

registerOperation({
  id: 'canvas.removeChild',
  name: '删除元素',
  description: '通过元素 ID 删除画布上的指定元素',
  group: '画布',
  params: [
    {
      name: 'id',
      label: '元素 ID',
      type: 'string',
      required: true,
      placeholder: '输入要删除的元素 ID',
      description: '元素的唯一标识符，可通过"获取画布状态"查看',
    },
  ],
  execute(params, ctx) {
    const { id } = params
    const child = ctx.findChildById(id)
    if (!child) {
      return { success: false, message: `未找到 ID 为 ${id} 的元素` }
    }
    ctx.removeCanvasChild(id)
    return { success: true, message: `已删除元素 ${id}`, data: { id } }
  },
})
