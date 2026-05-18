import { registerOperation } from '../registry'

registerOperation({
  id: 'element.setLocked',
  name: '锁定元素',
  description: '锁定元素，防止误操作移动或修改',
  group: '元素',
  params: [
    {
      name: 'id',
      label: '元素 ID',
      type: 'string',
      required: true,
      placeholder: '元素 ID',
      description: '要锁定的元素 ID',
    },
    {
      name: 'locked',
      label: '锁定状态',
      type: 'boolean',
      default: true,
      description: 'true 为锁定，false 为解锁',
    },
  ],
  execute(params, ctx) {
    const { id, locked = true } = params
    const child = ctx.findChildById(id)
    if (!child) {
      return { success: false, message: `未找到 ID 为 ${id} 的元素` }
    }

    ctx.setChildProperty(id, 'locked', locked)

    return {
      success: true,
      message: locked ? `已锁定元素 ${id}` : `已解锁元素 ${id}`,
      data: { id, locked },
    }
  },
})

registerOperation({
  id: 'element.setVisible',
  name: '设置可见性',
  description: '设置元素的可见性，隐藏的元素不会被导出',
  group: '元素',
  params: [
    {
      name: 'id',
      label: '元素 ID',
      type: 'string',
      required: true,
      placeholder: '元素 ID',
      description: '目标元素的 ID',
    },
    {
      name: 'visible',
      label: '可见性',
      type: 'boolean',
      default: true,
      description: 'true 为显示，false 为隐藏',
    },
  ],
  execute(params, ctx) {
    const { id, visible = true } = params
    const child = ctx.findChildById(id)
    if (!child) {
      return { success: false, message: `未找到 ID 为 ${id} 的元素` }
    }

    ctx.setChildProperty(id, 'visible', visible)

    return {
      success: true,
      message: visible ? `已显示元素 ${id}` : `已隐藏元素 ${id}`,
      data: { id, visible },
    }
  },
})
