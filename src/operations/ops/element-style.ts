import { registerOperation } from '../registry'

registerOperation({
  id: 'element.setStyle',
  name: '设置元素样式',
  description: '设置元素的通用样式属性，包括位置、大小、旋转、透明度、层级',
  group: '样式',
  params: [
    {
      name: 'id',
      label: '元素 ID',
      type: 'string',
      required: true,
      placeholder: '元素的 ID',
      description: '目标元素的唯一标识符',
    },
    {
      name: 'left',
      label: 'X 位置',
      type: 'number',
      description: '元素左侧位置（px）',
    },
    {
      name: 'top',
      label: 'Y 位置',
      type: 'number',
      description: '元素顶部位置（px）',
    },
    {
      name: 'width',
      label: '宽度',
      type: 'number',
      min: 1,
      max: 10000,
      description: '元素宽度（px）',
    },
    {
      name: 'height',
      label: '高度',
      type: 'number',
      min: 1,
      max: 10000,
      description: '元素高度（px）',
    },
    {
      name: 'rotateZ',
      label: '旋转角度',
      type: 'number',
      min: -360,
      max: 360,
      description: 'Z 轴旋转角度（度）',
    },
    {
      name: 'opacity',
      label: '透明度',
      type: 'number',
      min: 0,
      max: 100,
      description: '透明度百分比（0=完全透明，100=完全不透明）',
    },
    {
      name: 'zIndex',
      label: '层级',
      type: 'number',
      min: 0,
      max: 9999,
      description: '元素层级，数值越大越靠前',
    },
    {
      name: 'center',
      label: '居中',
      type: 'boolean',
      description: '是否水平和垂直居中',
    },
  ],
  execute(params, ctx) {
    const { id, left, top, width, height, rotateZ, opacity, zIndex, center } = params
    const child = ctx.findChildById(id)
    if (!child) {
      return { success: false, message: `未找到 ID 为 ${id} 的元素` }
    }

    const changes: string[] = []

    if (left !== undefined && child.position) {
      ctx.setChildProperty(id, 'position.left', { value: left, unit: 'px' })
      ctx.setChildProperty(id, 'position.center', false)
      ctx.setChildProperty(id, 'position.horizontalCenter', false)
      changes.push(`X=${left}`)
    }

    if (top !== undefined && child.position) {
      ctx.setChildProperty(id, 'position.top', { value: top, unit: 'px' })
      ctx.setChildProperty(id, 'position.center', false)
      ctx.setChildProperty(id, 'position.verticalCenter', false)
      changes.push(`Y=${top}`)
    }

    if (width !== undefined && child.width) {
      if (typeof child.width === 'object') {
        ctx.setChildProperty(id, 'width', { value: width, unit: child.width.unit || 'px' })
      } else {
        ctx.setChildProperty(id, 'width', width)
      }
      changes.push(`宽=${width}`)
    }

    if (height !== undefined && child.height) {
      if (typeof child.height === 'object') {
        ctx.setChildProperty(id, 'height', { value: height, unit: child.height.unit || 'px' })
      } else {
        ctx.setChildProperty(id, 'height', height)
      }
      changes.push(`高=${height}`)
    }

    if (rotateZ !== undefined && child.transform) {
      ctx.setChildProperty(id, 'transform.rotateZ', rotateZ)
      changes.push(`旋转=${rotateZ}°`)
    }

    if (opacity !== undefined && child.filter) {
      ctx.setChildProperty(id, 'filter.filterOpacity', opacity)
      changes.push(`透明度=${opacity}%`)
    }

    if (zIndex !== undefined) {
      ctx.setChildProperty(id, 'zIndex', zIndex)
      changes.push(`层级=${zIndex}`)
    }

    if (center !== undefined && child.position) {
      ctx.setChildProperty(id, 'position.center', center)
      ctx.setChildProperty(id, 'position.horizontalCenter', center)
      ctx.setChildProperty(id, 'position.verticalCenter', center)
      changes.push(`居中=${center}`)
    }

    if (changes.length === 0) {
      return { success: false, message: '未指定任何要修改的样式属性' }
    }

    return {
      success: true,
      message: `已更新元素样式: ${changes.join(', ')}`,
      data: { id, changes },
    }
  },
})
