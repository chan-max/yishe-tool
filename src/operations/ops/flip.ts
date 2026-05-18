import { registerOperation } from '../registry'

registerOperation({
  id: 'element.flipHorizontal',
  name: '水平翻转',
  description: '水平翻转指定元素',
  group: '变换',
  params: [
    {
      name: 'id',
      label: '元素 ID',
      type: 'string',
      required: true,
      placeholder: '元素 ID',
      description: '要翻转的元素 ID',
    },
  ],
  execute(params, ctx) {
    const { id } = params
    const child = ctx.findChildById(id)
    if (!child) {
      return { success: false, message: `未找到 ID 为 ${id} 的元素` }
    }

    // 获取当前的 scaleX，如果不存在则默认为 1
    const currentScaleX = child.transform?.scaleX ?? 1
    ctx.setChildProperty(id, 'transform.scaleX', currentScaleX * -1)

    return {
      success: true,
      message: `已水平翻转元素 ${id}`,
      data: { id, scaleX: currentScaleX * -1 },
    }
  },
})

registerOperation({
  id: 'element.flipVertical',
  name: '垂直翻转',
  description: '垂直翻转指定元素',
  group: '变换',
  params: [
    {
      name: 'id',
      label: '元素 ID',
      type: 'string',
      required: true,
      placeholder: '元素 ID',
      description: '要翻转的元素 ID',
    },
  ],
  execute(params, ctx) {
    const { id } = params
    const child = ctx.findChildById(id)
    if (!child) {
      return { success: false, message: `未找到 ID 为 ${id} 的元素` }
    }

    // 获取当前的 scaleY，如果不存在则默认为 1
    const currentScaleY = child.transform?.scaleY ?? 1
    ctx.setChildProperty(id, 'transform.scaleY', currentScaleY * -1)

    return {
      success: true,
      message: `已垂直翻转元素 ${id}`,
      data: { id, scaleY: currentScaleY * -1 },
    }
  },
})
