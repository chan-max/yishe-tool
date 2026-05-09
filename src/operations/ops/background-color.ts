import { registerOperation } from '../registry'

registerOperation({
  id: 'canvas.setBackgroundColor',
  name: '设置背景颜色',
  description: '设置画布的背景颜色，支持任何 CSS 颜色值（如 #ff0000, rgb(255,0,0), rgba(0,0,0,0.5)）',
  group: '画布',
  params: [
    {
      name: 'color',
      label: '颜色',
      type: 'color',
      required: true,
      placeholder: '#ff0000 或 rgba(255,0,0,0.5)',
      description: 'CSS 颜色值',
    },
  ],
  execute(params, ctx) {
    const { color } = params
    ctx.setCanvasBackgroundColor(color)
    return { success: true, message: `背景颜色已设置为 ${color}`, data: { color } }
  },
})
