import { registerOperation } from '../registry'

registerOperation({
  id: 'element.setBorderRadius',
  name: '设置圆角',
  description: '设置元素的圆角半径（适用于矩形等形状元素）',
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
      name: 'borderRadius',
      label: '圆角半径',
      type: 'number',
      required: true,
      min: 0,
      max: 5000,
      placeholder: '8',
      description: '圆角半径（px）',
    },
  ],
  execute(params, ctx) {
    const { id, borderRadius } = params
    const child = ctx.findChildById(id)
    if (!child) {
      return { success: false, message: `未找到 ID 为 ${id} 的元素` }
    }

    // 检查元素类型是否支持圆角
    const supportedTypes = ['rect', 'image', 'text']
    if (!supportedTypes.includes(child.type)) {
      return {
        success: false,
        message: `元素类型 ${child.type} 不支持圆角设置`,
      }
    }

    ctx.setChildProperty(id, 'borderRadius', borderRadius)

    return {
      success: true,
      message: `已设置元素 ${id} 的圆角半径为 ${borderRadius}px`,
      data: { id, borderRadius },
    }
  },
})

registerOperation({
  id: 'element.setBorderRadiusEach',
  name: '分别设置圆角',
  description: '分别设置元素四个角的圆角半径',
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
      name: 'topLeft',
      label: '左上角',
      type: 'number',
      default: 0,
      min: 0,
      max: 5000,
      description: '左上角圆角半径（px）',
    },
    {
      name: 'topRight',
      label: '右上角',
      type: 'number',
      default: 0,
      min: 0,
      max: 5000,
      description: '右上角圆角半径（px）',
    },
    {
      name: 'bottomRight',
      label: '右下角',
      type: 'number',
      default: 0,
      min: 0,
      max: 5000,
      description: '右下角圆角半径（px）',
    },
    {
      name: 'bottomLeft',
      label: '左下角',
      type: 'number',
      default: 0,
      min: 0,
      max: 5000,
      description: '左下角圆角半径（px）',
    },
  ],
  execute(params, ctx) {
    const { id, topLeft = 0, topRight = 0, bottomRight = 0, bottomLeft = 0 } = params
    const child = ctx.findChildById(id)
    if (!child) {
      return { success: false, message: `未找到 ID 为 ${id} 的元素` }
    }

    // 检查元素类型是否支持圆角
    const supportedTypes = ['rect', 'image', 'text']
    if (!supportedTypes.includes(child.type)) {
      return {
        success: false,
        message: `元素类型 ${child.type} 不支持圆角设置`,
      }
    }

    ctx.setChildProperty(id, 'borderRadius', {
      topLeft,
      topRight,
      bottomRight,
      bottomLeft,
    })

    return {
      success: true,
      message: `已分别设置元素 ${id} 的四个角圆角`,
      data: { id, topLeft, topRight, bottomRight, bottomLeft },
    }
  },
})
