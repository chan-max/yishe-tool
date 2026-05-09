import { registerOperation } from '../registry'

registerOperation({
  id: 'canvas.setSize',
  name: '设置画布尺寸',
  description: '设置画布的宽度和高度，支持 px、mm、cm、in 等单位',
  group: '画布',
  params: [
    {
      name: 'width',
      label: '宽度',
      type: 'number',
      required: true,
      description: '画布宽度',
      min: 10,
      max: 20000,
    },
    {
      name: 'height',
      label: '高度',
      type: 'number',
      required: true,
      description: '画布高度',
      min: 10,
      max: 20000,
    },
    {
      name: 'unit',
      label: '单位',
      type: 'select',
      required: false,
      default: 'px',
      description: '尺寸单位',
      options: [
        { label: 'px (像素)', value: 'px' },
        { label: 'mm (毫米)', value: 'mm' },
        { label: 'cm (厘米)', value: 'cm' },
        { label: 'in (英寸)', value: 'in' },
      ],
    },
  ],
  execute(params, ctx) {
    const { width, height, unit = 'px' } = params
    const current = ctx.getCanvasSize()
    ctx.setCanvasSize(width, height, unit)
    return {
      success: true,
      message: `画布尺寸已从 ${current.width}×${current.height} ${current.unit} 设置为 ${width}×${height} ${unit}`,
      data: { width, height, unit },
    }
  },
})
