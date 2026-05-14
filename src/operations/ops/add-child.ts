import { registerOperation } from '../registry'

registerOperation({
  id: 'canvas.addChild',
  name: '添加元素',
  description: '向画布添加一个新元素，支持文字、背景、图片、矩形、椭圆、二维码、条形码、ECharts、Three.js、数学公式等类型',
  group: '画布',
  params: [
    {
      name: 'type',
      label: '元素类型',
      type: 'select',
      required: true,
      options: [
        { label: '文字', value: 'text' },
        { label: '背景', value: 'background' },
        { label: '图片', value: 'image' },
        { label: '矩形', value: 'rect' },
        { label: '椭圆', value: 'ellipse' },
        { label: '二维码', value: 'qrcode' },
        { label: '条形码', value: 'barcode' },
        { label: 'ECharts', value: 'echart' },
        { label: 'Three.js', value: 'threeScene' },
        { label: '数学公式', value: 'math' },
      ],
      description: '要添加的元素类型',
    },
    {
      name: 'textContent',
      label: '文字内容',
      type: 'string',
      placeholder: '输入文字内容',
      description: '仅文字类型有效',
    },
    {
      name: 'fontColor',
      label: '文字颜色',
      type: 'color',
      default: '#ffffff',
      description: '仅文字类型有效',
    },
    {
      name: 'fontSize',
      label: '字号',
      type: 'number',
      default: 160,
      min: 1,
      max: 2000,
      description: '仅文字类型有效',
    },
    {
      name: 'backgroundColor',
      label: '背景颜色',
      type: 'color',
      default: '#000000',
      description: '仅背景类型有效',
    },
    {
      name: 'formula',
      label: '公式内容',
      type: 'string',
      placeholder: String.raw`\frac{a}{b}=c`,
      description: '仅数学公式类型有效，LaTeX 公式字符串',
    },
    {
      name: 'displayMode',
      label: '块级显示',
      type: 'boolean',
      default: true,
      description: '仅数学公式类型有效',
    },
    {
      name: 'throwOnError',
      label: '严格报错',
      type: 'boolean',
      default: false,
      description: '仅数学公式类型有效',
    },
    {
      name: 'mathFontColor',
      label: '公式颜色',
      type: 'color',
      default: '#111111',
      description: '仅数学公式类型有效',
    },
    {
      name: 'mathFontSize',
      label: '公式大小',
      type: 'number',
      default: 180,
      min: 1,
      max: 10000,
      description: '仅数学公式类型有效，单位 px',
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
  ],
  execute(params, ctx) {
    const { type, textContent, fontColor, fontSize, backgroundColor, formula, displayMode, throwOnError, mathFontColor, mathFontSize, width, height } = params

    const extraOptions: Record<string, any> = {}

    if (type === 'text') {
      if (textContent !== undefined) extraOptions.textContent = textContent
      if (fontColor !== undefined) extraOptions.fontColor = fontColor
      if (fontSize !== undefined) extraOptions.fontSize = fontSize
    }

    if (type === 'background' && backgroundColor !== undefined) {
      extraOptions.backgroundColor = backgroundColor
    }

    if (type === 'math') {
      if (formula !== undefined) extraOptions.formula = formula
      if (displayMode !== undefined) extraOptions.displayMode = displayMode
      if (throwOnError !== undefined) extraOptions.throwOnError = throwOnError
      if (mathFontColor !== undefined) extraOptions.fontColor = { color: mathFontColor, type: 'pure' }
      if (mathFontSize !== undefined) extraOptions.fontSize = { value: mathFontSize, unit: 'px' }
      if (width !== undefined) extraOptions.width = { value: width, unit: 'px' }
      if (height !== undefined) extraOptions.height = { value: height, unit: 'px' }
    }

    if (type === 'rect' || type === 'ellipse') {
      if (width !== undefined) extraOptions.width = { value: width, unit: 'px' }
      if (height !== undefined) extraOptions.height = { value: height, unit: 'px' }
    }

    if (type === 'qrcode' || type === 'barcode') {
      if (width !== undefined) extraOptions.width = width
      if (height !== undefined) extraOptions.height = height
    }

    const id = ctx.addCanvasChild(type, extraOptions)
    return { success: true, message: `已添加${type}元素`, data: { id } }
  },
})
