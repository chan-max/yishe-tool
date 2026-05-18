import { registerOperation } from '../registry'

registerOperation({
  id: 'element.setShadow',
  name: '设置阴影',
  description: '设置元素的阴影效果',
  group: '样式',
  params: [
    {
      name: 'id',
      label: '元素 ID',
      type: 'string',
      required: true,
      placeholder: '元素 ID',
      description: '目标元素的唯一标识符',
    },
    {
      name: 'offsetX',
      label: 'X 偏移',
      type: 'number',
      required: true,
      placeholder: '4',
      description: '阴影的水平偏移量（px）',
    },
    {
      name: 'offsetY',
      label: 'Y 偏移',
      type: 'number',
      required: true,
      placeholder: '4',
      description: '阴影的垂直偏移量（px）',
    },
    {
      name: 'blur',
      label: '模糊半径',
      type: 'number',
      default: 8,
      min: 0,
      max: 100,
      description: '阴影的模糊半径（px）',
    },
    {
      name: 'spread',
      label: '扩展半径',
      type: 'number',
      default: 0,
      min: -100,
      max: 100,
      description: '阴影的扩展半径（px）',
    },
    {
      name: 'color',
      label: '阴影颜色',
      type: 'color',
      default: '#00000066',
      description: '阴影颜色（支持透明度）',
    },
  ],
  execute(params, ctx) {
    const { id, offsetX, offsetY, blur = 8, spread = 0, color = '#00000066' } = params
    const child = ctx.findChildById(id)
    if (!child) {
      return { success: false, message: `未找到 ID 为 ${id} 的元素` }
    }

    ctx.setChildProperty(id, 'shadow', {
      offsetX,
      offsetY,
      blur,
      spread,
      color,
    })

    return {
      success: true,
      message: `已设置元素 ${id} 的阴影效果`,
      data: { id, offsetX, offsetY, blur, spread, color },
    }
  },
})

registerOperation({
  id: 'element.removeShadow',
  name: '移除阴影',
  description: '移除元素的阴影效果',
  group: '样式',
  params: [
    {
      name: 'id',
      label: '元素 ID',
      type: 'string',
      required: true,
      placeholder: '元素 ID',
      description: '目标元素的唯一标识符',
    },
  ],
  execute(params, ctx) {
    const { id } = params
    const child = ctx.findChildById(id)
    if (!child) {
      return { success: false, message: `未找到 ID 为 ${id} 的元素` }
    }

    ctx.setChildProperty(id, 'shadow', null)

    return {
      success: true,
      message: `已移除元素 ${id} 的阴影效果`,
      data: { id },
    }
  },
})
