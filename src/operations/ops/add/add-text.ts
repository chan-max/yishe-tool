import { registerOperation } from '../../registry'

registerOperation({
  id: 'canvas.addText',
  name: '添加文字',
  description: '向画布添加一个文字元素，支持自定义内容、颜色、字号、粗细、对齐方式等',
  group: '添加元素',
  params: [
    {
      name: 'textContent',
      label: '文字内容',
      type: 'string',
      default: 'do something special',
      placeholder: '输入文字内容',
      description: '要显示的文字内容',
    },
    {
      name: 'fontColor',
      label: '文字颜色',
      type: 'color',
      default: '#000000',
      description: '文字颜色，支持 CSS 颜色值',
    },
    {
      name: 'fontSize',
      label: '字号',
      type: 'number',
      default: 160,
      min: 1,
      max: 2000,
      description: '文字大小（px）',
    },
    {
      name: 'fontWeight',
      label: '字重',
      type: 'select',
      default: '500',
      options: [
        { label: '100 - 极细', value: '100' },
        { label: '200 - 特细', value: '200' },
        { label: '300 - 细', value: '300' },
        { label: '400 - 正常', value: '400' },
        { label: '500 - 中等', value: '500' },
        { label: '600 - 半粗', value: '600' },
        { label: '700 - 加粗', value: '700' },
        { label: '800 - 特粗', value: '800' },
        { label: '900 - 黑体', value: '900' },
      ],
      description: '文字粗细',
    },
    {
      name: 'lineHeight',
      label: '行高',
      type: 'number',
      default: 1,
      min: 0.5,
      max: 5,
      description: '行高（em倍数）',
    },
    {
      name: 'letterSpacing',
      label: '字间距',
      type: 'number',
      default: 0,
      min: -5,
      max: 20,
      description: '字间距（em倍数）',
    },
    {
      name: 'textAlign',
      label: '对齐方式',
      type: 'select',
      default: 'left',
      options: [
        { label: '左对齐', value: 'left' },
        { label: '居中', value: 'center' },
        { label: '右对齐', value: 'right' },
      ],
      description: '文字水平对齐方式',
    },
    {
      name: 'writingMode',
      label: '排版方向',
      type: 'select',
      default: 'htb',
      options: [
        { label: '水平（从左到右）', value: 'htb' },
        { label: '垂直（从上到下）', value: 'vlr' },
        { label: '垂直（从下到上）', value: 'vrl' },
      ],
      description: '文字排版方向',
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
    const {
      textContent,
      fontColor,
      fontSize,
      fontWeight,
      lineHeight,
      letterSpacing,
      textAlign,
      writingMode,
      rotateZ,
      center,
    } = params

    const extraOptions: Record<string, any> = {}

    if (textContent !== undefined) extraOptions.textContent = textContent
    if (fontColor !== undefined) extraOptions.fontColor = { color: fontColor, type: 'pure' }
    if (fontSize !== undefined) extraOptions.fontSize = { value: fontSize, unit: 'px' }
    if (fontWeight !== undefined) extraOptions.fontWeight = fontWeight
    if (lineHeight !== undefined) extraOptions.lineHeight = lineHeight
    if (letterSpacing !== undefined) extraOptions.letterSpacing = letterSpacing
    if (textAlign !== undefined) extraOptions.textAlign = textAlign
    if (writingMode !== undefined) extraOptions.writingMode = writingMode

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

    const id = ctx.addCanvasChild('text', extraOptions)
    return {
      success: true,
      message: `已添加文字元素 "${textContent || ''}"`,
      data: { id, type: 'text' },
    }
  },
})
