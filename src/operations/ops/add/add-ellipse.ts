import { registerOperation } from '../../registry'

registerOperation({
  id: 'canvas.addEllipse',
  name: '添加椭圆',
  description: '向画布添加一个椭圆/圆形元素，支持背景色、边框',
  group: '添加元素',
  params: [
    {
      name: 'width',
      label: '宽度',
      type: 'number',
      default: 100,
      min: 1,
      max: 10000,
      description: '椭圆宽度（px）',
    },
    {
      name: 'height',
      label: '高度',
      type: 'number',
      default: 100,
      min: 1,
      max: 10000,
      description: '椭圆高度（px），与宽度相同即为圆形',
    },
    {
      name: 'backgroundColor',
      label: '背景颜色',
      type: 'color',
      default: '#ffffff',
      description: '椭圆背景颜色',
    },
    {
      name: 'borderColor',
      label: '边框颜色',
      type: 'color',
      default: '#ffffff',
      description: '边框颜色',
    },
    {
      name: 'borderWidth',
      label: '边框宽度',
      type: 'number',
      default: 0,
      min: 0,
      max: 100,
      description: '边框宽度（px）',
    },
    {
      name: 'rotateZ',
      label: '旋转角度',
      type: 'number',
      default: 0,
      min: -360,
      max: 360,
      description: '旋转角度（度）',
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
    const { width, height, backgroundColor, borderColor, borderWidth, rotateZ, center } = params

    const extraOptions: Record<string, any> = {}

    if (width !== undefined) extraOptions.width = { value: width, unit: 'px' }
    if (height !== undefined) extraOptions.height = { value: height, unit: 'px' }
    if (backgroundColor !== undefined) extraOptions.backgroundColor = { color: backgroundColor, type: 'pure' }
    if (borderColor !== undefined) extraOptions.borderColor = { color: borderColor, type: 'pure' }
    if (borderWidth !== undefined) extraOptions.borderWidth = { value: borderWidth, unit: 'px' }
    if (rotateZ !== undefined) {
      extraOptions.transform = { rotateZ }
    }
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

    const id = ctx.addCanvasChild('ellipse', extraOptions)
    return {
      success: true,
      message: `已添加椭圆元素 ${width}x${height}`,
      data: { id, type: 'ellipse' },
    }
  },
})
