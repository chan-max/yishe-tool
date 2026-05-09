import { registerOperation } from '../../registry'

registerOperation({
  id: 'canvas.addBarcode',
  name: '添加条形码',
  description: '向画布添加一个条形码元素，可设置内容、颜色、尺寸等',
  group: '添加元素',
  params: [
    {
      name: 'content',
      label: '条形码内容',
      type: 'string',
      required: true,
      placeholder: '123456789012',
      description: '条形码内容（数字或字母）',
    },
    {
      name: 'lineColor',
      label: '线条颜色',
      type: 'color',
      default: '#ff0000',
      description: '条形码线条颜色',
    },
    {
      name: 'backgroundColor',
      label: '背景颜色',
      type: 'color',
      default: '#ffff00',
      description: '条形码背景颜色',
    },
    {
      name: 'width',
      label: '宽度',
      type: 'number',
      default: 100,
      min: 10,
      max: 2000,
      description: '条形码宽度（px）',
    },
    {
      name: 'height',
      label: '高度',
      type: 'number',
      default: 100,
      min: 10,
      max: 2000,
      description: '条形码高度（px）',
    },
    {
      name: 'center',
      label: '居中',
      type: 'boolean',
      default: true,
      description: '是否在画布中居中',
    },
  ],
  execute(params, ctx) {
    const { content, lineColor, backgroundColor, width, height, center } = params

    const extraOptions: Record<string, any> = {}

    if (content !== undefined) extraOptions.barcodeContent = content
    if (lineColor !== undefined) extraOptions.lineColor = { color: lineColor, type: 'pure' }
    if (backgroundColor !== undefined) extraOptions.background = { color: backgroundColor, type: 'pure' }
    if (width !== undefined) extraOptions.width = { value: width, unit: 'px' }
    if (height !== undefined) extraOptions.height = { value: height, unit: 'px' }

    if (center !== undefined) {
      extraOptions.position = {
        center,
        verticalCenter: center,
        horizontalCenter: center,
        top: { value: 0, unit: 'px' },
        left: { value: 0, unit: 'px' },
        bottom: { value: 0, unit: 'px' },
        right: { value: 0, unit: 'px' },
      }
    }

    const id = ctx.addCanvasChild('barcode', extraOptions)
    return {
      success: true,
      message: `已添加条形码元素，内容: ${content}`,
      data: { id, type: 'barcode' },
    }
  },
})
