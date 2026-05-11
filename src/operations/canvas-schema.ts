import { canvasStickerOptions, currentOperatingCanvasChildId } from '@/components/design/layout/canvas'
import { createDefaultCanvasChildcanvasStickerOptions } from '@/components/design/layout/canvas/children/canvas'
import { createDefaultCanvasChildTextOptions } from '@/components/design/layout/canvas/children/text/text.tsx'
import { createDefaultCanvasChildBackgroundOptions } from '@/components/design/layout/canvas/children/background/index.tsx'
import { createDefaultCanvasChildImageOptions } from '@/components/design/layout/canvas/children/image.tsx'
import { createDefaultCanvasChildSvgRectOptions, createDefaultCanvasChildSvgEllipseOptions } from '@/components/design/layout/canvas/children/svg/svg.tsx'
import { createDefaultCanvasChildQrcodeOptions } from '@/components/design/layout/canvas/children/qrcode.tsx'
import { createDefaultCanvasChildBarcodeOptions } from '@/components/design/layout/canvas/children/barcode/index.tsx'
import { createDefaultCanvasChildHtmlOptions } from '@/components/design/layout/canvas/children/html.tsx'

export const CHILD_DEFAULT_FACTORIES: Record<string, () => any> = {
  canvas: createDefaultCanvasChildcanvasStickerOptions,
  text: createDefaultCanvasChildTextOptions,
  background: createDefaultCanvasChildBackgroundOptions,
  image: createDefaultCanvasChildImageOptions,
  rect: createDefaultCanvasChildSvgRectOptions,
  ellipse: createDefaultCanvasChildSvgEllipseOptions,
  qrcode: createDefaultCanvasChildQrcodeOptions,
  barcode: createDefaultCanvasChildBarcodeOptions,
  html: createDefaultCanvasChildHtmlOptions,
}

const STICKER_DESIGN_SYSTEM = `你是 POD 贴纸设计智能体。你的唯一任务：根据用户需求，输出一个完整的 JSON 对象来定义画布设计。

## 绝对规则（违反即失败）
1. 你只能输出一个合法的 JSON 对象，不要输出任何其他文字、解释、markdown
2. JSON 必须有 children 数组，第一个元素 type 必须是 "canvas"
3. 所有尺寸用 {"value": 数字, "unit": "px"} 格式
4. 所有颜色用 {"type": "pure", "color": "#RRGGBB"} 格式
5. 只写你想自定义的字段，其余自动用默认值

## 示例输出
{"children":[{"type":"canvas","width":{"value":2000,"unit":"px"},"height":{"value":2000,"unit":"px"},"backgroundColor":{"color":"#FF0000"}},{"type":"background","backgroundColor":{"type":"pure","color":"#FF0000"},"zIndex":0},{"type":"text","textContent":"你好世界","fontSize":{"value":120,"unit":"px"},"fontColor":{"type":"pure","color":"#FFFFFF"},"position":{"center":true,"verticalCenter":true,"horizontalCenter":true},"zIndex":1}]}

## 可用元素类型
- canvas: 画布底板（必需，唯一）。width/height 只能 px
- background: 背景层，默认铺满画布。支持 backgroundColor(type+color)、customBackground
- text: 文字。支持 textContent, fontSize(px), fontWeight("100"~"900"数字字符串，不可用bold/normal), fontColor, textAlign, writingMode, textShadow[], textStrokeWidth+textStrokeColor, isRoundText, isTraditionalChinese, lineHeight, letterSpacing
- image: 图片。imageInfo.url, objectFit, printEffect
- rect: 矩形。backgroundColor, borderColor, borderWidth, borderRadius(horizontal+vertical)
- ellipse: 椭圆。backgroundColor, borderColor, borderWidth
- qrcode: 二维码。qrcodeContent, qrCodeColor, qrcodeDotType, errorCorrectionLevel
- barcode: 条形码。barcodeContent, lineColor, barcodeFormat
- html: HTML元素。htmlContent

## 公共属性（除 canvas 外所有元素可选）
width/height, zIndex(数字越大越靠前), position({center:true}居中), transform, filter`

export const CANVAS_DESIGN_SCHEMA = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'CanvasDesign',
  description: '画布设计完整数据结构，用于 AI 生成可直接渲染的设计方案',
  type: 'object',
  required: ['children'],
  properties: {
    unit: { type: 'string', enum: ['px'], default: 'px', description: '全局单位，当前仅支持 px' },
    supportBackgroundColor: {
      type: 'object',
      description: '画布全局背景色',
      properties: {
        type: { type: 'string', enum: ['pure', 'gradient'], default: 'pure', description: '颜色类型' },
        color: { type: 'string', description: 'CSS颜色值，如 #FF0000、rgba(0,0,0,0)、transparent', default: 'transparent' },
      },
      required: ['type', 'color'],
      additionalProperties: false,
    },
    children: {
      type: 'array',
      description: '子元素数组。第一个元素必须是 type="canvas" 的画布底板。后续按顺序添加设计元素。',
      minItems: 1,
      items: { $ref: '#/definitions/CanvasChild' },
    },
  },
  additionalProperties: false,
  definitions: {
    SizeValue: {
      type: 'object',
      description: '带单位的尺寸值。画布尺寸和文字大小只能用 px。背景/图片尺寸可用 vw/vh。',
      properties: {
        value: { type: 'number', minimum: 0 },
        unit: { type: 'string', enum: ['px', 'vw', 'vh'], default: 'px' },
      },
      required: ['value', 'unit'],
      additionalProperties: false,
    },
    ColorValue: {
      type: 'object',
      description: '颜色值。type=pure 时 color 为 CSS 颜色字符串，type=gradient 时 color 为 CSS 渐变字符串',
      properties: {
        type: { type: 'string', enum: ['pure', 'gradient'] },
        color: { type: 'string', description: '如 #FF0000、rgb(255,0,0)、linear-gradient(...)' },
      },
      required: ['type', 'color'],
      additionalProperties: false,
    },
    Position: {
      type: 'object',
      description: '定位方式。center=true 时元素居中于画布。否则按 top/left 或 bottom/right 定位',
      properties: {
        center: { type: 'boolean', default: true, description: '是否居中' },
        verticalCenter: { type: 'boolean', default: true, description: '垂直居中' },
        horizontalCenter: { type: 'boolean', default: true, description: '水平居中' },
        top: { $ref: '#/definitions/SizeValue' },
        left: { $ref: '#/definitions/SizeValue' },
        bottom: { $ref: '#/definitions/SizeValue' },
        right: { $ref: '#/definitions/SizeValue' },
      },
      additionalProperties: false,
    },
    Filter: {
      type: 'object',
      description: 'CSS 滤镜效果。值为默认值时表示无效果',
      properties: {
        filterBlur: { $ref: '#/definitions/SizeValue' },
        filterBrightness: { type: 'number', minimum: 0, maximum: 500, default: 100, description: '亮度%（100=正常）' },
        filterContrast: { type: 'number', minimum: 0, maximum: 500, default: 100, description: '对比度%（100=正常）' },
        filterGrayscale: { type: 'number', minimum: 0, maximum: 100, default: 0, description: '灰度%' },
        filterHueRotate: { type: 'number', minimum: 0, maximum: 360, default: 0, description: '色相旋转（度）' },
        filterInvert: { type: 'number', minimum: 0, maximum: 100, default: 0, description: '反转%' },
        filterOpacity: { type: 'number', minimum: 0, maximum: 100, default: 100, description: '不透明度%' },
        filterSaturate: { type: 'number', minimum: 0, maximum: 500, default: 100, description: '饱和度%（100=正常）' },
        filterSepia: { type: 'number', minimum: 0, maximum: 100, default: 0, description: '褐色%' },
      },
      additionalProperties: false,
    },
    Transform: {
      type: 'object',
      description: 'CSS Transform 变换。值为默认值时表示无变换',
      properties: {
        translateX: { $ref: '#/definitions/SizeValue' },
        translateY: { $ref: '#/definitions/SizeValue' },
        translateZ: { $ref: '#/definitions/SizeValue' },
        perspective: { $ref: '#/definitions/SizeValue' },
        scaleX: { type: 'number', default: 1 },
        scaleY: { type: 'number', default: 1 },
        scaleZ: { type: 'number', default: 1 },
        rotateX: { type: 'number', default: 0, description: 'X轴旋转（度）' },
        rotateY: { type: 'number', default: 0, description: 'Y轴旋转（度）' },
        rotateZ: { type: 'number', default: 0, description: 'Z轴旋转（度）' },
        skewX: { type: 'number', default: 0, description: 'X轴倾斜（度）' },
        skewY: { type: 'number', default: 0, description: 'Y轴倾斜（度）' },
      },
      additionalProperties: false,
    },
    TextShadow: {
      type: 'object',
      description: '文字阴影项。disabled=true 时不生效',
      properties: {
        horizontal: { $ref: '#/definitions/SizeValue' },
        vertical: { $ref: '#/definitions/SizeValue' },
        blur: { $ref: '#/definitions/SizeValue' },
        color: { $ref: '#/definitions/ColorValue' },
        disabled: { type: 'boolean', default: false },
      },
      additionalProperties: false,
    },
    BorderRadius: {
      type: 'object',
      description: '圆角（四个角分别设置）',
      properties: {
        leftTop: { $ref: '#/definitions/SizeValue' },
        rightTop: { $ref: '#/definitions/SizeValue' },
        leftBottom: { $ref: '#/definitions/SizeValue' },
        rightBottom: { $ref: '#/definitions/SizeValue' },
      },
      additionalProperties: false,
    },
    ImagePrintEffect: {
      type: 'object',
      description: '图片印花效果',
      properties: {
        preset: { type: 'string', enum: ['original', 'sticker', 'vintage', 'blackWhite', 'redStamp', 'golden'], default: 'original', description: '印花预设样式' },
        fillMode: { type: 'string', enum: ['single', 'tile'], default: 'single', description: '单图展示或图案平铺' },
        pattern: {
          type: 'object',
          description: '平铺模式配置（fillMode=tile 时生效）',
          properties: {
            repeatMode: { type: 'string', enum: ['repeat', 'repeat-x', 'repeat-y', 'no-repeat'], default: 'repeat' },
            tileWidth: { $ref: '#/definitions/SizeValue' },
            offsetX: { $ref: '#/definitions/SizeValue' },
            offsetY: { $ref: '#/definitions/SizeValue' },
          },
          additionalProperties: false,
        },
        outline: {
          type: 'object',
          description: '白边/描边效果',
          properties: {
            enabled: { type: 'boolean', default: false },
            width: { $ref: '#/definitions/SizeValue' },
            color: { $ref: '#/definitions/ColorValue' },
          },
          additionalProperties: false,
        },
        shadow: {
          type: 'object',
          description: '投影效果',
          properties: {
            enabled: { type: 'boolean', default: false },
            blur: { $ref: '#/definitions/SizeValue' },
            offsetX: { $ref: '#/definitions/SizeValue' },
            offsetY: { $ref: '#/definitions/SizeValue' },
            color: { $ref: '#/definitions/ColorValue' },
          },
          additionalProperties: false,
        },
      },
      additionalProperties: false,
    },
    CanvasChild: {
      type: 'object',
      description: '画布子元素，由 type 字段区分类型。只提供你需要设定的字段，其余自动使用默认值。',
      required: ['type'],
      properties: {
        type: { type: 'string', enum: ['canvas', 'text', 'background', 'image', 'rect', 'ellipse', 'qrcode', 'barcode', 'html'] },
      },
      oneOf: [
        { $ref: '#/definitions/CanvasBase' },
        { $ref: '#/definitions/TextChild' },
        { $ref: '#/definitions/BackgroundChild' },
        { $ref: '#/definitions/ImageChild' },
        { $ref: '#/definitions/RectChild' },
        { $ref: '#/definitions/EllipseChild' },
        { $ref: '#/definitions/QrcodeChild' },
        { $ref: '#/definitions/BarcodeChild' },
        { $ref: '#/definitions/HtmlChild' },
      ],
    },
    CanvasBase: {
      type: 'object',
      description: '画布底板（必须存在，不可删除，只能有一个）。定义画布整体尺寸。',
      required: ['type', 'width', 'height'],
      properties: {
        type: { const: 'canvas' },
        width: { type: 'object', description: '画布宽度（只能用 px）', properties: { value: { type: 'number', minimum: 1 }, unit: { const: 'px' } }, required: ['value', 'unit'], additionalProperties: false },
        height: { type: 'object', description: '画布高度（只能用 px）', properties: { value: { type: 'number', minimum: 1 }, unit: { const: 'px' } }, required: ['value', 'unit'], additionalProperties: false },
        backgroundColor: { type: 'object', description: '画布背景色（注意：无 type 字段，直接 color）', properties: { color: { type: 'string', description: 'CSS颜色值' } }, required: ['color'], additionalProperties: false },
        filter: { $ref: '#/definitions/Filter' },
      },
      additionalProperties: false,
    },
    TextChild: {
      type: 'object',
      description: '文字元素。支持描边、阴影、圆形排列、繁简转换等。',
      required: ['type', 'textContent'],
      properties: {
        type: { const: 'text' },
        textContent: { type: 'string', description: '文字内容' },
        fontSize: { type: 'object', description: '文字大小', properties: { value: { type: 'number', minimum: 1 }, unit: { const: 'px' } }, required: ['value', 'unit'], additionalProperties: false },
        fontWeight: { type: 'string', enum: ['100', '200', '300', '400', '500', '600', '700', '800', '900'], default: '500' },
        fontColor: { $ref: '#/definitions/ColorValue' },
        fontFamilyInfo: { type: 'object', description: '字体信息（id 标识）', properties: { id: { type: 'string' } }, additionalProperties: true },
        lineHeight: { type: 'number', minimum: 0, default: 1, description: '行高倍数' },
        letterSpacing: { type: 'number', default: 0, description: '字间距' },
        textAlign: { type: 'string', enum: ['left', 'center', 'right'], default: 'left' },
        writingMode: { type: 'string', enum: ['htb', 'vlr', 'vrl'], default: 'htb', description: '书写方向：htb=横排, vlr=竖排左起, vrl=竖排右起' },
        textShadow: { type: 'array', items: { $ref: '#/definitions/TextShadow' }, description: '文字阴影数组' },
        textStrokeWidth: { type: 'object', description: '描边宽度', properties: { value: { type: 'number', minimum: 0 }, unit: { const: 'px' } }, required: ['value', 'unit'], additionalProperties: false },
        textStrokeColor: { $ref: '#/definitions/ColorValue' },
        isTraditionalChinese: { type: 'boolean', default: false, description: '是否转繁体字' },
        isRoundText: { type: 'boolean', default: false, description: '是否沿圆形排列文字' },
        isMultipleLineOutExpand: { type: 'boolean', default: false, description: '圆形文字多行时是否向外扩张' },
        roundTextHorizontalRadius: { type: 'object', description: '圆形文字水平半径', properties: { value: { type: 'number', minimum: 1 }, unit: { const: 'px' } }, required: ['value', 'unit'], additionalProperties: false },
        roundTextVerticalRadius: { type: 'object', description: '圆形文字垂直半径', properties: { value: { type: 'number', minimum: 1 }, unit: { const: 'px' } }, required: ['value', 'unit'], additionalProperties: false },
        roundTextStartDeg: { type: 'number', default: 0, description: '圆形文字起始角度' },
        isCounterclockwise: { type: 'boolean', default: false, description: '文字是否指向圆心' },
        isPointingToCenter: { type: 'boolean', default: true, description: '是否指向圆心' },
        isReverseLetter: { type: 'boolean', default: false, description: '文字旋转180度（凹凸文字效果）' },
        zIndex: { type: 'number', default: 0, description: '层级，越大越靠前' },
        position: { $ref: '#/definitions/Position' },
        transform: { $ref: '#/definitions/Transform' },
        filter: { $ref: '#/definitions/Filter' },
        imageInfo: { type: 'object', description: '文字背景图', properties: { url: { type: 'string' } }, additionalProperties: false },
      },
      additionalProperties: false,
    },
    BackgroundChild: {
      type: 'object',
      description: '背景元素。默认铺满整个画布（width=100vw, height=100vh）。',
      required: ['type'],
      properties: {
        type: { const: 'background' },
        backgroundColor: { $ref: '#/definitions/ColorValue' },
        width: { $ref: '#/definitions/SizeValue' },
        height: { $ref: '#/definitions/SizeValue' },
        zIndex: { type: 'number', default: 0 },
        position: { $ref: '#/definitions/Position' },
        transform: { $ref: '#/definitions/Transform' },
        filter: { $ref: '#/definitions/Filter' },
        customBackground: { type: 'object', description: '内置背景模板', properties: { id: { type: 'string' }, label: { type: 'string' } }, additionalProperties: false },
      },
      additionalProperties: false,
    },
    ImageChild: {
      type: 'object',
      description: '图片元素。默认铺满画布。支持 objectFit 控制填充方式。',
      required: ['type'],
      properties: {
        type: { const: 'image' },
        imageInfo: { type: 'object', description: '图片信息', properties: { url: { type: 'string', description: '图片URL' } }, required: ['url'], additionalProperties: false },
        objectFit: { type: 'string', enum: ['contain', 'cover', 'fill', 'none', 'scale-down'], default: 'contain' },
        width: { $ref: '#/definitions/SizeValue' },
        height: { $ref: '#/definitions/SizeValue' },
        zIndex: { type: 'number', default: 0 },
        position: { $ref: '#/definitions/Position' },
        transform: { $ref: '#/definitions/Transform' },
        filter: { $ref: '#/definitions/Filter' },
        printEffect: { $ref: '#/definitions/ImagePrintEffect' },
      },
      additionalProperties: false,
    },
    RectChild: {
      type: 'object',
      description: '矩形元素。可设置背景色、边框、圆角。',
      required: ['type'],
      properties: {
        type: { const: 'rect' },
        backgroundColor: { $ref: '#/definitions/ColorValue' },
        borderColor: { $ref: '#/definitions/ColorValue' },
        borderWidth: { type: 'object', description: '边框宽度', properties: { value: { type: 'number', minimum: 0 }, unit: { const: 'px' } }, required: ['value', 'unit'], additionalProperties: false },
        borderRadius: { type: 'object', description: '圆角（水平/垂直方向）', properties: { horizontal: { type: 'object', properties: { value: { type: 'number', minimum: 0 }, unit: { const: 'px' } }, required: ['value', 'unit'], additionalProperties: false }, vertical: { type: 'object', properties: { value: { type: 'number', minimum: 0 }, unit: { const: 'px' } }, required: ['value', 'unit'], additionalProperties: false } }, additionalProperties: false },
        width: { type: 'object', description: '矩形宽度', properties: { value: { type: 'number', minimum: 1 }, unit: { const: 'px' } }, required: ['value', 'unit'], additionalProperties: false },
        height: { type: 'object', description: '矩形高度', properties: { value: { type: 'number', minimum: 1 }, unit: { const: 'px' } }, required: ['value', 'unit'], additionalProperties: false },
        zIndex: { type: 'number', default: 0 },
        position: { $ref: '#/definitions/Position' },
        transform: { $ref: '#/definitions/Transform' },
        filter: { $ref: '#/definitions/Filter' },
      },
      additionalProperties: false,
    },
    EllipseChild: {
      type: 'object',
      description: '椭圆/圆形元素。width=height 时为正圆。',
      required: ['type'],
      properties: {
        type: { const: 'ellipse' },
        backgroundColor: { $ref: '#/definitions/ColorValue' },
        borderColor: { $ref: '#/definitions/ColorValue' },
        borderWidth: { type: 'object', description: '边框宽度', properties: { value: { type: 'number', minimum: 0 }, unit: { const: 'px' } }, required: ['value', 'unit'], additionalProperties: false },
        width: { type: 'object', description: '椭圆宽度', properties: { value: { type: 'number', minimum: 1 }, unit: { const: 'px' } }, required: ['value', 'unit'], additionalProperties: false },
        height: { type: 'object', description: '椭圆高度', properties: { value: { type: 'number', minimum: 1 }, unit: { const: 'px' } }, required: ['value', 'unit'], additionalProperties: false },
        zIndex: { type: 'number', default: 0 },
        position: { $ref: '#/definitions/Position' },
        transform: { $ref: '#/definitions/Transform' },
        filter: { $ref: '#/definitions/Filter' },
      },
      additionalProperties: false,
    },
    QrcodeChild: {
      type: 'object',
      description: '二维码元素。qrcodeContent 为二维码内容。',
      required: ['type', 'qrcodeContent'],
      properties: {
        type: { const: 'qrcode' },
        qrcodeContent: { type: 'string', description: '二维码内容（URL或文本）' },
        qrCodeColor: { $ref: '#/definitions/ColorValue' },
        errorCorrectionLevel: { type: 'string', enum: ['L', 'M', 'Q', 'H'], default: 'H', description: '纠错级别' },
        qrcodeDotType: { type: 'string', enum: ['square', 'rounded', 'dots', 'classy', 'classy-rounded', 'extra-rounded'], default: 'square', description: '码点样式' },
        backgroundColor: { $ref: '#/definitions/ColorValue' },
        width: { type: 'object', description: '二维码宽度', properties: { value: { type: 'number', minimum: 1 }, unit: { const: 'px' } }, required: ['value', 'unit'], additionalProperties: false },
        height: { type: 'object', description: '二维码高度', properties: { value: { type: 'number', minimum: 1 }, unit: { const: 'px' } }, required: ['value', 'unit'], additionalProperties: false },
        zIndex: { type: 'number', default: 0 },
        position: { $ref: '#/definitions/Position' },
        borderRadius: { $ref: '#/definitions/BorderRadius' },
        scaleX: { type: 'number', default: 1 },
        scaleY: { type: 'number', default: 1 },
        scaleZ: { type: 'number', default: 1 },
        rotateX: { type: 'number', default: 0 },
        rotateY: { type: 'number', default: 0 },
        rotateZ: { type: 'number', default: 0 },
        skewX: { type: 'number', default: 0 },
        skewY: { type: 'number', default: 0 },
      },
      additionalProperties: false,
    },
    BarcodeChild: {
      type: 'object',
      description: '条形码元素。barcodeContent 为条形码内容。',
      required: ['type', 'barcodeContent'],
      properties: {
        type: { const: 'barcode' },
        barcodeContent: { type: 'string', description: '条形码内容' },
        barcodeFormat: { type: 'string', default: '', description: '条形码格式（空字符串=自动检测）' },
        lineColor: { $ref: '#/definitions/ColorValue' },
        background: { $ref: '#/definitions/ColorValue' },
        width: { type: 'object', description: '条形码宽度', properties: { value: { type: 'number', minimum: 1 }, unit: { const: 'px' } }, required: ['value', 'unit'], additionalProperties: false },
        height: { type: 'object', description: '条形码高度', properties: { value: { type: 'number', minimum: 1 }, unit: { const: 'px' } }, required: ['value', 'unit'], additionalProperties: false },
        zIndex: { type: 'number', default: 0 },
        position: { $ref: '#/definitions/Position' },
        scaleX: { type: 'number', default: 1 },
        scaleY: { type: 'number', default: 1 },
        scaleZ: { type: 'number', default: 1 },
        rotateX: { type: 'number', default: 0 },
        rotateY: { type: 'number', default: 0 },
        rotateZ: { type: 'number', default: 0 },
        skewX: { type: 'number', default: 0 },
        skewY: { type: 'number', default: 0 },
      },
      additionalProperties: false,
    },
    HtmlChild: {
      type: 'object',
      description: 'HTML代码元素。直接渲染自定义HTML内容。',
      required: ['type', 'htmlContent'],
      properties: {
        type: { const: 'html' },
        htmlContent: { type: 'string', description: 'HTML代码内容' },
        htmlBindings: { type: 'object', description: 'HTML模板绑定的变量键值对' },
        htmlTemplateFields: { type: 'array', description: '模板字段定义', items: { type: 'object' } },
        htmlTemplateDefaultBindings: { type: 'object', description: '模板默认绑定值' },
        htmlTemplateMeta: { type: 'object', description: '模板元信息' },
        zIndex: { type: 'number', default: 0 },
        transform: { $ref: '#/definitions/Transform' },
        filter: { $ref: '#/definitions/Filter' },
      },
      additionalProperties: false,
    },
  },
}

export function buildDirectDesignPrompt(currentCanvas?: any): string {
  const lines: string[] = [
    STICKER_DESIGN_SYSTEM,
    '',
  ]

  if (currentCanvas) {
    lines.push('## 当前画布状态（可完全替换）')
    lines.push('')
    lines.push('```json')
    lines.push(JSON.stringify(currentCanvas, null, 2))
    lines.push('```')
    lines.push('')
  }

  lines.push('## 热门配色参考')
  lines.push('')
  lines.push('以下配色可参考使用（也可自由发挥）：')
  lines.push('红:#FF0000 橙:#FF6B35 金:#FFD700 深红:#DC143C 粉:#FF69B4 蓝:#1E90FF 绿:#228B22 青:#00CED1 紫:#9370DB 黑:#000000 白:#FFFFFF')
  lines.push('')

  return lines.join('\n')
}

export function parseDirectDesignResult(text: string): any | null {
  const re = /```canvas-design\s*\n([\s\S]*?)```/g
  const match = re.exec(text)
  if (!match) return null
  try {
    return JSON.parse(match[1].trim())
  } catch {
    return null
  }
}

export function stripDesignBlocks(text: string): string {
  return text.replace(/```canvas-design\s*\n[\s\S]*?```/g, '').trim()
}

function deepMergeDefaults(target: any, source: any): any {
  if (!source || typeof source !== 'object') return source ?? target
  if (!target || typeof target !== 'object') return source

  const result = { ...target }
  for (const key of Object.keys(source)) {
    if (key in result) {
      if (
        result[key] !== null &&
        source[key] !== null &&
        typeof result[key] === 'object' &&
        typeof source[key] === 'object' &&
        !Array.isArray(result[key]) &&
        !Array.isArray(source[key])
      ) {
        result[key] = deepMergeDefaults(result[key], source[key])
      } else {
        result[key] = source[key]
      }
    } else {
      result[key] = source[key]
    }
  }
  return result
}

export function validateDesignData(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['数据不是有效对象'] }
  }
  if (!Array.isArray(data.children) || data.children.length === 0) {
    errors.push('children 数组不能为空')
    return { valid: false, errors }
  }

  const baseChild = data.children.find((c: any) => c.type === 'canvas')
  if (!baseChild) {
    errors.push('children 中缺少 type="canvas" 的画布底板')
  } else if (!baseChild.width || !baseChild.height) {
    errors.push('画布底板必须包含 width 和 height')
  }

  const canvasCount = data.children.filter((c: any) => c.type === 'canvas').length
  if (canvasCount > 1) {
    errors.push('画布底板只能有一个')
  }

  for (let i = 0; i < data.children.length; i++) {
    const child = data.children[i]
    if (!child.type) {
      errors.push(`children[${i}] 缺少 type 字段`)
    }
    if (CHILD_DEFAULT_FACTORIES[child.type] === undefined) {
      errors.push(`children[${i}].type="${child.type}" 不是有效的类型`)
    }
  }

  return { valid: errors.length === 0, errors }
}

const FONT_WEIGHT_MAP: Record<string, string> = {
  thin: '100',
  hairline: '100',
  extralight: '200',
  'ultra-light': '200',
  light: '300',
  normal: '400',
  regular: '400',
  medium: '500',
  semibold: '600',
  'semi-bold': '600',
  demibold: '600',
  bold: '700',
  extrabold: '800',
  'ultra-bold': '800',
  black: '900',
  heavy: '900',
}

function normalizeFontWeight(value: any): string {
  if (typeof value === 'number') return String(value)
  if (typeof value !== 'string') return '500'
  const lower = value.toLowerCase().replace(/\s+/g, '')
  return FONT_WEIGHT_MAP[lower] || value
}

function isSizeValue(obj: any): boolean {
  return obj && typeof obj === 'object' && 'value' in obj && 'unit' in obj
}

function toSizeValue(val: any, fallbackUnit = 'px'): any {
  if (typeof val === 'number') return { value: val, unit: fallbackUnit }
  if (typeof val === 'string') {
    const num = parseFloat(val)
    if (!isNaN(num)) return { value: num, unit: fallbackUnit }
  }
  return val
}

function normalizeDefaultsMismatch(defaults: any, source: any): any {
  if (!source || typeof source !== 'object') return source
  if (!defaults || typeof defaults !== 'object') return source

  const result = { ...source }
  for (const key of Object.keys(source)) {
    const dv = defaults[key]
    const sv = source[key]
    if (dv === undefined) continue

    if (isSizeValue(dv) && !isSizeValue(sv)) {
      result[key] = toSizeValue(sv, dv.unit)
    } else if (dv && typeof dv === 'object' && !Array.isArray(dv) && sv && typeof sv === 'object' && !Array.isArray(sv)) {
      result[key] = normalizeDefaultsMismatch(dv, sv)
    }
  }
  return result
}

function normalizeChildOptions(child: any, defaults?: any): any {
  if (defaults) {
    return normalizeDefaultsMismatch(defaults, child)
  }
  if (child.type === 'text' && child.fontWeight) {
    child.fontWeight = normalizeFontWeight(child.fontWeight)
  }
  return child
}

export function applyDesignToCanvas(data: any): void {
  const canvas = canvasStickerOptions.value

  if (data.unit) canvas.unit = data.unit
  if (data.supportBackgroundColor) canvas.supportBackgroundColor = data.supportBackgroundColor

  const newChildren: any[] = []
  for (const child of data.children) {
    const factory = CHILD_DEFAULT_FACTORIES[child.type]
    if (!factory) continue

    const defaults = factory()
    const normalized = normalizeDefaultsMismatch(defaults, child)
    if (normalized.type === 'text' && normalized.fontWeight) {
      normalized.fontWeight = normalizeFontWeight(normalized.fontWeight)
    }
    const merged = deepMergeDefaults(defaults, normalized)

    if (!merged.id) {
      merged.id = '_' + String(Date.now()) + '_' + Math.random().toString(36).slice(2, 6)
    }

    newChildren.push(merged)
  }

  if (newChildren.length === 0) return

  canvas.children = newChildren
  const base = newChildren.find((c) => c.type === 'canvas')
  if (base) {
    currentOperatingCanvasChildId.value = base.id
  }
}
