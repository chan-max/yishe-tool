import {
  canvasStickerOptions,
  currentOperatingCanvasChildId,
} from "@/components/design/layout/canvas";
import { createDefaultCanvasChildcanvasStickerOptions } from "@/components/design/layout/canvas/children/canvas";
import { createDefaultCanvasChildTextOptions } from "@/components/design/layout/canvas/children/text/text.tsx";
import { createDefaultCanvasChildBackgroundOptions } from "@/components/design/layout/canvas/children/background/index.tsx";
import { createDefaultCanvasChildImageOptions } from "@/components/design/layout/canvas/children/image.tsx";
import {
  createDefaultCanvasChildSvgRectOptions,
  createDefaultCanvasChildSvgEllipseOptions,
} from "@/components/design/layout/canvas/children/svg/svg.tsx";
import { createDefaultCanvasChildQrcodeOptions } from "@/components/design/layout/canvas/children/qrcode.tsx";
import { createDefaultCanvasChildBarcodeOptions } from "@/components/design/layout/canvas/children/barcode/index.tsx";
import { createDefaultCanvasChildHtmlOptions } from "@/components/design/layout/canvas/children/html.tsx";
import { createDefaultCanvasChildRawCanvasOptions } from "@/components/design/layout/canvas/children/rawCanvas.tsx";
import { createDefaultCanvasChildWordCloudOptions } from "@/components/design/layout/canvas/children/wordCloud/index.tsx";
import { createDefaultCanvasChildThreeSceneOptions } from "@/components/design/layout/canvas/children/threeScene/index.tsx";
import { createDefaultCanvasChildEchartOptions } from "@/components/design/layout/canvas/children/echart/index.tsx";
import { createDefaultCanvasChildMathOptions } from "@/components/design/layout/canvas/children/math.tsx";
import { createDefaultCanvasChildMermaidOptions } from "@/components/design/layout/canvas/children/mermaid.tsx";
import { createDefaultCanvasChildCodeBlockOptions } from "@/components/design/layout/canvas/children/codeBlock.tsx";
import { createDefaultCanvasChildMoleculeOptions } from "@/components/design/layout/canvas/children/molecule.tsx";
import { createDefaultCanvasChildThreeMolOptions } from "@/components/design/layout/canvas/children/threeMol.tsx";
import { createDefaultCanvasChildAbcNotationOptions } from "@/components/design/layout/canvas/children/abcNotation.tsx";
import { createDefaultCanvasChildVexFlowOptions } from "@/components/design/layout/canvas/children/vexFlow.tsx";

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
  rawCanvas: createDefaultCanvasChildRawCanvasOptions,
  wordCloud: createDefaultCanvasChildWordCloudOptions,
  threeScene: createDefaultCanvasChildThreeSceneOptions,
  echart: createDefaultCanvasChildEchartOptions,
  math: createDefaultCanvasChildMathOptions,
  mermaid: createDefaultCanvasChildMermaidOptions,
  codeBlock: createDefaultCanvasChildCodeBlockOptions,
  molecule: createDefaultCanvasChildMoleculeOptions,
  threeMol: createDefaultCanvasChildThreeMolOptions,
  abcNotation: createDefaultCanvasChildAbcNotationOptions,
  vexFlow: createDefaultCanvasChildVexFlowOptions,
};

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
- canvas: 画布底板（必需，唯一）。width/height 只能 px，可设置 fontSize 作为 HTML 元素 em 的基础字号
- background: 背景层，默认铺满画布。支持 backgroundColor(type+color)、customBackground
- text: 文字。支持 textContent, fontSize(px), fontWeight("100"~"900"数字字符串，不可用bold/normal), fontColor, textAlign, writingMode, textShadow[], textStrokeWidth+textStrokeColor, isRoundText, isTraditionalChinese, lineHeight, letterSpacing
- image: 图片。imageInfo.url, objectFit；printEffect 仅用于图片平铺（fillMode/pattern），视觉滤镜请使用通用 filter
- rect: 矩形。backgroundColor, borderColor, borderWidth, borderRadius(horizontal+vertical)
- ellipse: 椭圆。backgroundColor, borderColor, borderWidth
- qrcode: 二维码。qrcodeContent, qrCodeColor, qrcodeDotType, errorCorrectionLevel
- barcode: 条形码。barcodeContent, lineColor, barcodeFormat
- html: HTML元素。htmlContent
- rawCanvas: 程序画布 (Canvas)。用于后续程序化绘制，当前支持作为透明画布容器参与布局和导出
- wordCloud: 词云 (wordcloud2)。当前 engine=wordcloud2，所有词云参数放在 wordCloud.engines.wordcloud2 下
- threeScene: 3D模型 (Three.js)。当前 engine=threejs，作为贴纸子元素渲染 3D 场景到独立 canvas，所有参数放在 threeScene.engines.threejs 下
- echart: 图表 (ECharts)。当前 engine=echarts，直接将原生 ECharts option 放在 echart.engines.echarts.option 下；只使用 JSON 对象，不写函数
- math: 数学公式 (KaTeX)。当前 engine=katex，formula 写 LaTeX/mhchem 字符串；支持数学公式和化学式/反应式，化学内容用 \\ce{...}，单位可用 \\pu{...}；支持 displayMode、fontSize、fontFamilyInfo、fontColor、backgroundColor、textAlign
- mermaid: 流程图 (Mermaid)。source 写 Mermaid DSL，config 写 Mermaid 原生配置对象；适合流程图、时序图、类图、ER 图、甘特图、思维导图、时间轴等静态图
- codeBlock: 代码块 (Shiki)。source 写代码内容，language 写语言标识，theme 写 Shiki 主题；适合生成漂亮的静态代码卡片
- molecule: 分子结构 (RDKit.js)。inputType 为 'smiles' 或 'molblock'，source 写 SMILES 或 MolBlock 字符串；drawOptions 透传给 RDKit get_svg_with_highlights；适合化学分子、有机物、药物结构贴纸
- threeMol: 3D分子 (3Dmol.js)。data 写 PDB/SDF/XYZ/MOL2 数据，format 写格式标识，pdbId 写 PDB 数据库 ID（自动下载），style 写渲染样式（stick/sphere/cartoon/line/cross）；适合 3D 交互式分子可视化
- abcNotation: 乐谱 (abcjs)。source 写 ABC 记谱法文本；适合简单乐谱、民谣、儿歌
- vexFlow: 五线谱 (VexFlow)。notes 写音符数组 [{keys:['c/4'],duration:'q'}]，clef 写谱号（treble/bass/alto/tenor），timeSignature 写拍号；适合专业五线谱

## 公共属性（除 canvas 外所有元素可选）
width/height, zIndex(数字越大越靠前), position({center:true}居中), transform, filter`;

export const CANVAS_DESIGN_SCHEMA = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "CanvasDesign",
  description: "画布设计完整数据结构，用于 AI 生成可直接渲染的设计方案",
  type: "object",
  required: ["children"],
  properties: {
    unit: {
      type: "string",
      enum: ["px"],
      default: "px",
      description: "全局单位，当前仅支持 px",
    },
    supportBackgroundColor: {
      type: "object",
      description: "画布全局背景色",
      properties: {
        type: {
          type: "string",
          enum: ["pure", "gradient"],
          default: "pure",
          description: "颜色类型",
        },
        color: {
          type: "string",
          description: "CSS颜色值，如 #FF0000、rgba(0,0,0,0)、transparent",
          default: "transparent",
        },
      },
      required: ["type", "color"],
      additionalProperties: false,
    },
    children: {
      type: "array",
      description:
        '子元素数组。第一个元素必须是 type="canvas" 的画布底板。后续按顺序添加设计元素。',
      minItems: 1,
      items: { $ref: "#/definitions/CanvasChild" },
    },
  },
  additionalProperties: false,
  definitions: {
    SizeValue: {
      type: "object",
      description:
        "带单位的尺寸值。画布尺寸和文字大小只能用 px。背景/图片尺寸可用 vw/vh。",
      properties: {
        value: { type: "number", minimum: 0 },
        unit: { type: "string", enum: ["px", "vw", "vh"], default: "px" },
      },
      required: ["value", "unit"],
      additionalProperties: false,
    },
    ColorValue: {
      type: "object",
      description:
        "颜色值。type=pure 时 color 为 CSS 颜色字符串，type=gradient 时 color 为 CSS 渐变字符串",
      properties: {
        type: { type: "string", enum: ["pure", "gradient"] },
        color: {
          type: "string",
          description: "如 #FF0000、rgb(255,0,0)、linear-gradient(...)",
        },
      },
      required: ["type", "color"],
      additionalProperties: false,
    },
    Position: {
      type: "object",
      description:
        "定位方式。center=true 时元素居中于画布。否则按 top/left 或 bottom/right 定位",
      properties: {
        center: { type: "boolean", default: true, description: "是否居中" },
        verticalCenter: {
          type: "boolean",
          default: true,
          description: "垂直居中",
        },
        horizontalCenter: {
          type: "boolean",
          default: true,
          description: "水平居中",
        },
        top: { $ref: "#/definitions/SizeValue" },
        left: { $ref: "#/definitions/SizeValue" },
        bottom: { $ref: "#/definitions/SizeValue" },
        right: { $ref: "#/definitions/SizeValue" },
      },
      additionalProperties: false,
    },
    Filter: {
      type: "object",
      description: "CSS 滤镜效果。值为默认值时表示无效果",
      properties: {
        filterBlur: { $ref: "#/definitions/SizeValue" },
        filterBrightness: {
          type: "number",
          minimum: 0,
          maximum: 500,
          default: 100,
          description: "亮度%（100=正常）",
        },
        filterContrast: {
          type: "number",
          minimum: 0,
          maximum: 500,
          default: 100,
          description: "对比度%（100=正常）",
        },
        filterGrayscale: {
          type: "number",
          minimum: 0,
          maximum: 100,
          default: 0,
          description: "灰度%",
        },
        filterHueRotate: {
          type: "number",
          minimum: 0,
          maximum: 360,
          default: 0,
          description: "色相旋转（度）",
        },
        filterInvert: {
          type: "number",
          minimum: 0,
          maximum: 100,
          default: 0,
          description: "反转%",
        },
        filterOpacity: {
          type: "number",
          minimum: 0,
          maximum: 100,
          default: 100,
          description: "不透明度%",
        },
        filterSaturate: {
          type: "number",
          minimum: 0,
          maximum: 500,
          default: 100,
          description: "饱和度%（100=正常）",
        },
        filterSepia: {
          type: "number",
          minimum: 0,
          maximum: 100,
          default: 0,
          description: "褐色%",
        },
      },
      additionalProperties: false,
    },
    Transform: {
      type: "object",
      description: "CSS Transform 变换。值为默认值时表示无变换",
      properties: {
        translateX: { $ref: "#/definitions/SizeValue" },
        translateY: { $ref: "#/definitions/SizeValue" },
        translateZ: { $ref: "#/definitions/SizeValue" },
        perspective: { $ref: "#/definitions/SizeValue" },
        scaleX: { type: "number", default: 1 },
        scaleY: { type: "number", default: 1 },
        scaleZ: { type: "number", default: 1 },
        rotateX: { type: "number", default: 0, description: "X轴旋转（度）" },
        rotateY: { type: "number", default: 0, description: "Y轴旋转（度）" },
        rotateZ: { type: "number", default: 0, description: "Z轴旋转（度）" },
        skewX: { type: "number", default: 0, description: "X轴倾斜（度）" },
        skewY: { type: "number", default: 0, description: "Y轴倾斜（度）" },
      },
      additionalProperties: false,
    },
    TextShadow: {
      type: "object",
      description: "文字阴影项。disabled=true 时不生效",
      properties: {
        horizontal: { $ref: "#/definitions/SizeValue" },
        vertical: { $ref: "#/definitions/SizeValue" },
        blur: { $ref: "#/definitions/SizeValue" },
        color: { $ref: "#/definitions/ColorValue" },
        disabled: { type: "boolean", default: false },
      },
      additionalProperties: false,
    },
    BorderRadius: {
      type: "object",
      description: "圆角（四个角分别设置）",
      properties: {
        leftTop: { $ref: "#/definitions/SizeValue" },
        rightTop: { $ref: "#/definitions/SizeValue" },
        leftBottom: { $ref: "#/definitions/SizeValue" },
        rightBottom: { $ref: "#/definitions/SizeValue" },
      },
      additionalProperties: false,
    },
    ImagePrintEffect: {
      type: "object",
      description: "图片平铺配置。preset、outline、shadow 为历史兼容字段，新生成配置不建议使用；视觉滤镜请使用通用 filter。",
      properties: {
        preset: {
          type: "string",
          enum: [
            "original",
            "sticker",
            "vintage",
            "blackWhite",
            "redStamp",
            "golden",
          ],
          default: "original",
          description: "历史兼容字段，新生成配置保持 original；视觉风格请使用通用 filter。",
        },
        fillMode: {
          type: "string",
          enum: ["single", "tile"],
          default: "single",
          description: "单图展示或图案平铺",
        },
        pattern: {
          type: "object",
          description: "平铺模式配置（fillMode=tile 时生效）",
          properties: {
            repeatMode: {
              type: "string",
              enum: ["repeat", "repeat-x", "repeat-y", "no-repeat"],
              default: "repeat",
            },
            tileWidth: { $ref: "#/definitions/SizeValue" },
            offsetX: { $ref: "#/definitions/SizeValue" },
            offsetY: { $ref: "#/definitions/SizeValue" },
          },
          additionalProperties: false,
        },
        outline: {
          type: "object",
          description: "白边/描边效果",
          properties: {
            enabled: { type: "boolean", default: false },
            width: { $ref: "#/definitions/SizeValue" },
            color: { $ref: "#/definitions/ColorValue" },
          },
          additionalProperties: false,
        },
        shadow: {
          type: "object",
          description: "投影效果",
          properties: {
            enabled: { type: "boolean", default: false },
            blur: { $ref: "#/definitions/SizeValue" },
            offsetX: { $ref: "#/definitions/SizeValue" },
            offsetY: { $ref: "#/definitions/SizeValue" },
            color: { $ref: "#/definitions/ColorValue" },
          },
          additionalProperties: false,
        },
      },
      additionalProperties: false,
    },
    CanvasChild: {
      type: "object",
      description:
        "画布子元素，由 type 字段区分类型。只提供你需要设定的字段，其余自动使用默认值。",
      required: ["type"],
      properties: {
        type: {
          type: "string",
          enum: [
            "canvas",
            "text",
            "background",
            "image",
            "rect",
            "ellipse",
            "qrcode",
            "barcode",
            "html",
            "rawCanvas",
            "wordCloud",
            "threeScene",
            "echart",
            "math",
            "mermaid",
            "codeBlock",
            "molecule",
            "threeMol",
          ],
        },
      },
      oneOf: [
        { $ref: "#/definitions/CanvasBase" },
        { $ref: "#/definitions/TextChild" },
        { $ref: "#/definitions/BackgroundChild" },
        { $ref: "#/definitions/ImageChild" },
        { $ref: "#/definitions/RectChild" },
        { $ref: "#/definitions/EllipseChild" },
        { $ref: "#/definitions/QrcodeChild" },
        { $ref: "#/definitions/BarcodeChild" },
        { $ref: "#/definitions/HtmlChild" },
        { $ref: "#/definitions/RawCanvasChild" },
        { $ref: "#/definitions/WordCloudChild" },
        { $ref: "#/definitions/ThreeSceneChild" },
        { $ref: "#/definitions/EchartChild" },
        { $ref: "#/definitions/MathChild" },
        { $ref: "#/definitions/MermaidChild" },
        { $ref: "#/definitions/CodeBlockChild" },
        { $ref: "#/definitions/MoleculeChild" },
        { $ref: "#/definitions/ThreeMolChild" },
      ],
    },
    CanvasBase: {
      type: "object",
      description:
        "画布底板（必须存在，不可删除，只能有一个）。定义画布整体尺寸。",
      required: ["type", "width", "height"],
      properties: {
        type: { const: "canvas" },
        width: {
          type: "object",
          description: "画布宽度（只能用 px）",
          properties: {
            value: { type: "number", minimum: 1 },
            unit: { const: "px" },
          },
          required: ["value", "unit"],
          additionalProperties: false,
        },
        height: {
          type: "object",
          description: "画布高度（只能用 px）",
          properties: {
            value: { type: "number", minimum: 1 },
            unit: { const: "px" },
          },
          required: ["value", "unit"],
          additionalProperties: false,
        },
        fontSize: {
          type: "object",
          description: "画布基础字号，HTML 元素可用 em 继承缩放",
          properties: {
            value: { type: "number", minimum: 1 },
            unit: { type: "string", enum: ["px", "vw", "vh"], default: "px" },
          },
          required: ["value", "unit"],
          additionalProperties: false,
        },
        backgroundColor: {
          type: "object",
          description: "画布背景色（注意：无 type 字段，直接 color）",
          properties: { color: { type: "string", description: "CSS颜色值" } },
          required: ["color"],
          additionalProperties: false,
        },
        filter: { $ref: "#/definitions/Filter" },
      },
      additionalProperties: false,
    },
    TextChild: {
      type: "object",
      description: "文字元素。支持描边、阴影、圆形排列、繁简转换等。",
      required: ["type", "textContent"],
      properties: {
        type: { const: "text" },
        textContent: { type: "string", description: "文字内容" },
        fontSize: {
          type: "object",
          description: "文字大小",
          properties: {
            value: { type: "number", minimum: 1 },
            unit: { const: "px" },
          },
          required: ["value", "unit"],
          additionalProperties: false,
        },
        fontWeight: {
          type: "string",
          enum: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
          default: "500",
        },
        fontColor: { $ref: "#/definitions/ColorValue" },
        fontFamilyInfo: {
          type: "object",
          description: "字体信息（id 标识）",
          properties: { id: { type: "string" } },
          additionalProperties: true,
        },
        lineHeight: {
          type: "number",
          minimum: 0,
          default: 1,
          description: "行高倍数",
        },
        letterSpacing: { type: "number", default: 0, description: "字间距" },
        textAlign: {
          type: "string",
          enum: ["left", "center", "right"],
          default: "left",
        },
        writingMode: {
          type: "string",
          enum: ["htb", "vlr", "vrl"],
          default: "htb",
          description: "书写方向：htb=横排, vlr=竖排左起, vrl=竖排右起",
        },
        textShadow: {
          type: "array",
          items: { $ref: "#/definitions/TextShadow" },
          description: "文字阴影数组",
        },
        textStrokeWidth: {
          type: "object",
          description: "描边宽度",
          properties: {
            value: { type: "number", minimum: 0 },
            unit: { const: "px" },
          },
          required: ["value", "unit"],
          additionalProperties: false,
        },
        textStrokeColor: { $ref: "#/definitions/ColorValue" },
        isTraditionalChinese: {
          type: "boolean",
          default: false,
          description: "是否转繁体字",
        },
        isRoundText: {
          type: "boolean",
          default: false,
          description: "是否沿圆形排列文字",
        },
        isMultipleLineOutExpand: {
          type: "boolean",
          default: false,
          description: "圆形文字多行时是否向外扩张",
        },
        roundTextHorizontalRadius: {
          type: "object",
          description: "圆形文字水平半径",
          properties: {
            value: { type: "number", minimum: 1 },
            unit: { const: "px" },
          },
          required: ["value", "unit"],
          additionalProperties: false,
        },
        roundTextVerticalRadius: {
          type: "object",
          description: "圆形文字垂直半径",
          properties: {
            value: { type: "number", minimum: 1 },
            unit: { const: "px" },
          },
          required: ["value", "unit"],
          additionalProperties: false,
        },
        roundTextStartDeg: {
          type: "number",
          default: 0,
          description: "圆形文字起始角度",
        },
        isCounterclockwise: {
          type: "boolean",
          default: false,
          description: "文字是否指向圆心",
        },
        isPointingToCenter: {
          type: "boolean",
          default: true,
          description: "是否指向圆心",
        },
        isReverseLetter: {
          type: "boolean",
          default: false,
          description: "文字旋转180度（凹凸文字效果）",
        },
        zIndex: { type: "number", default: 0, description: "层级，越大越靠前" },
        position: { $ref: "#/definitions/Position" },
        transform: { $ref: "#/definitions/Transform" },
        filter: { $ref: "#/definitions/Filter" },
        imageInfo: {
          type: "object",
          description: "文字背景图",
          properties: { url: { type: "string" } },
          additionalProperties: false,
        },
      },
      additionalProperties: false,
    },
    BackgroundChild: {
      type: "object",
      description: "背景元素。默认铺满整个画布（width=100vw, height=100vh）。",
      required: ["type"],
      properties: {
        type: { const: "background" },
        backgroundColor: { $ref: "#/definitions/ColorValue" },
        width: { $ref: "#/definitions/SizeValue" },
        height: { $ref: "#/definitions/SizeValue" },
        zIndex: { type: "number", default: 0 },
        position: { $ref: "#/definitions/Position" },
        transform: { $ref: "#/definitions/Transform" },
        filter: { $ref: "#/definitions/Filter" },
        customBackground: {
          type: "object",
          description: "内置背景模板",
          properties: { id: { type: "string" }, label: { type: "string" } },
          additionalProperties: false,
        },
      },
      additionalProperties: false,
    },
    ImageChild: {
      type: "object",
      description: "图片元素。默认铺满画布。支持 objectFit 控制填充方式。",
      required: ["type"],
      properties: {
        type: { const: "image" },
        imageInfo: {
          type: "object",
          description: "图片信息",
          properties: { url: { type: "string", description: "图片URL" } },
          required: ["url"],
          additionalProperties: false,
        },
        objectFit: {
          type: "string",
          enum: ["contain", "cover", "fill", "none", "scale-down"],
          default: "contain",
        },
        width: { $ref: "#/definitions/SizeValue" },
        height: { $ref: "#/definitions/SizeValue" },
        zIndex: { type: "number", default: 0 },
        position: { $ref: "#/definitions/Position" },
        transform: { $ref: "#/definitions/Transform" },
        filter: { $ref: "#/definitions/Filter" },
        printEffect: { $ref: "#/definitions/ImagePrintEffect" },
      },
      additionalProperties: false,
    },
    RectChild: {
      type: "object",
      description: "矩形元素。可设置背景色、边框、圆角。",
      required: ["type"],
      properties: {
        type: { const: "rect" },
        backgroundColor: { $ref: "#/definitions/ColorValue" },
        borderColor: { $ref: "#/definitions/ColorValue" },
        borderWidth: {
          type: "object",
          description: "边框宽度",
          properties: {
            value: { type: "number", minimum: 0 },
            unit: { const: "px" },
          },
          required: ["value", "unit"],
          additionalProperties: false,
        },
        borderRadius: {
          type: "object",
          description: "圆角（水平/垂直方向）",
          properties: {
            horizontal: {
              type: "object",
              properties: {
                value: { type: "number", minimum: 0 },
                unit: { const: "px" },
              },
              required: ["value", "unit"],
              additionalProperties: false,
            },
            vertical: {
              type: "object",
              properties: {
                value: { type: "number", minimum: 0 },
                unit: { const: "px" },
              },
              required: ["value", "unit"],
              additionalProperties: false,
            },
          },
          additionalProperties: false,
        },
        width: {
          type: "object",
          description: "矩形宽度",
          properties: {
            value: { type: "number", minimum: 1 },
            unit: { const: "px" },
          },
          required: ["value", "unit"],
          additionalProperties: false,
        },
        height: {
          type: "object",
          description: "矩形高度",
          properties: {
            value: { type: "number", minimum: 1 },
            unit: { const: "px" },
          },
          required: ["value", "unit"],
          additionalProperties: false,
        },
        zIndex: { type: "number", default: 0 },
        position: { $ref: "#/definitions/Position" },
        transform: { $ref: "#/definitions/Transform" },
        filter: { $ref: "#/definitions/Filter" },
      },
      additionalProperties: false,
    },
    EllipseChild: {
      type: "object",
      description: "椭圆/圆形元素。width=height 时为正圆。",
      required: ["type"],
      properties: {
        type: { const: "ellipse" },
        backgroundColor: { $ref: "#/definitions/ColorValue" },
        borderColor: { $ref: "#/definitions/ColorValue" },
        borderWidth: {
          type: "object",
          description: "边框宽度",
          properties: {
            value: { type: "number", minimum: 0 },
            unit: { const: "px" },
          },
          required: ["value", "unit"],
          additionalProperties: false,
        },
        width: {
          type: "object",
          description: "椭圆宽度",
          properties: {
            value: { type: "number", minimum: 1 },
            unit: { const: "px" },
          },
          required: ["value", "unit"],
          additionalProperties: false,
        },
        height: {
          type: "object",
          description: "椭圆高度",
          properties: {
            value: { type: "number", minimum: 1 },
            unit: { const: "px" },
          },
          required: ["value", "unit"],
          additionalProperties: false,
        },
        zIndex: { type: "number", default: 0 },
        position: { $ref: "#/definitions/Position" },
        transform: { $ref: "#/definitions/Transform" },
        filter: { $ref: "#/definitions/Filter" },
      },
      additionalProperties: false,
    },
    QrcodeChild: {
      type: "object",
      description: "二维码元素。qrcodeContent 为二维码内容。",
      required: ["type", "qrcodeContent"],
      properties: {
        type: { const: "qrcode" },
        qrcodeContent: {
          type: "string",
          description: "二维码内容（URL或文本）",
        },
        qrCodeColor: { $ref: "#/definitions/ColorValue" },
        errorCorrectionLevel: {
          type: "string",
          enum: ["L", "M", "Q", "H"],
          default: "H",
          description: "纠错级别",
        },
        qrcodeDotType: {
          type: "string",
          enum: [
            "square",
            "rounded",
            "dots",
            "classy",
            "classy-rounded",
            "extra-rounded",
          ],
          default: "square",
          description: "码点样式",
        },
        backgroundColor: { $ref: "#/definitions/ColorValue" },
        width: {
          type: "object",
          description: "二维码宽度",
          properties: {
            value: { type: "number", minimum: 1 },
            unit: { const: "px" },
          },
          required: ["value", "unit"],
          additionalProperties: false,
        },
        height: {
          type: "object",
          description: "二维码高度",
          properties: {
            value: { type: "number", minimum: 1 },
            unit: { const: "px" },
          },
          required: ["value", "unit"],
          additionalProperties: false,
        },
        zIndex: { type: "number", default: 0 },
        position: { $ref: "#/definitions/Position" },
        borderRadius: { $ref: "#/definitions/BorderRadius" },
        scaleX: { type: "number", default: 1 },
        scaleY: { type: "number", default: 1 },
        scaleZ: { type: "number", default: 1 },
        rotateX: { type: "number", default: 0 },
        rotateY: { type: "number", default: 0 },
        rotateZ: { type: "number", default: 0 },
        skewX: { type: "number", default: 0 },
        skewY: { type: "number", default: 0 },
      },
      additionalProperties: false,
    },
    BarcodeChild: {
      type: "object",
      description: "条形码元素。barcodeContent 为条形码内容。",
      required: ["type", "barcodeContent"],
      properties: {
        type: { const: "barcode" },
        barcodeContent: { type: "string", description: "条形码内容" },
        barcodeFormat: {
          type: "string",
          default: "",
          description: "条形码格式（空字符串=自动检测）",
        },
        lineColor: { $ref: "#/definitions/ColorValue" },
        background: { $ref: "#/definitions/ColorValue" },
        width: {
          type: "object",
          description: "条形码宽度",
          properties: {
            value: { type: "number", minimum: 1 },
            unit: { const: "px" },
          },
          required: ["value", "unit"],
          additionalProperties: false,
        },
        height: {
          type: "object",
          description: "条形码高度",
          properties: {
            value: { type: "number", minimum: 1 },
            unit: { const: "px" },
          },
          required: ["value", "unit"],
          additionalProperties: false,
        },
        zIndex: { type: "number", default: 0 },
        position: { $ref: "#/definitions/Position" },
        scaleX: { type: "number", default: 1 },
        scaleY: { type: "number", default: 1 },
        scaleZ: { type: "number", default: 1 },
        rotateX: { type: "number", default: 0 },
        rotateY: { type: "number", default: 0 },
        rotateZ: { type: "number", default: 0 },
        skewX: { type: "number", default: 0 },
        skewY: { type: "number", default: 0 },
      },
      additionalProperties: false,
    },
    HtmlChild: {
      type: "object",
      description: "HTML代码元素。直接渲染自定义HTML内容。",
      required: ["type", "htmlContent"],
      properties: {
        type: { const: "html" },
        htmlContent: { type: "string", description: "HTML代码内容" },
        htmlBindings: {
          type: "object",
          description: "HTML模板绑定的变量键值对",
        },
        htmlTemplateFields: {
          type: "array",
          description: "模板字段定义",
          items: { type: "object" },
        },
        htmlTemplateDefaultBindings: {
          type: "object",
          description: "模板默认绑定值",
        },
        htmlTemplateMeta: { type: "object", description: "模板元信息" },
        zIndex: { type: "number", default: 0 },
        transform: { $ref: "#/definitions/Transform" },
        filter: { $ref: "#/definitions/Filter" },
      },
      additionalProperties: false,
    },
    RawCanvasChild: {
      type: "object",
      description:
        "Canvas元素。作为受控程序化绘制容器，绘制逻辑由系统组件执行，导出时参与 html-to-image 捕获。",
      required: ["type"],
      properties: {
        type: { const: "rawCanvas" },
        width: { $ref: "#/definitions/SizeValue" },
        height: { $ref: "#/definitions/SizeValue" },
        zIndex: { type: "number", default: 0 },
        position: { $ref: "#/definitions/Position" },
        transform: { $ref: "#/definitions/Transform" },
        filter: { $ref: "#/definitions/Filter" },
        drawConfig: {
          type: "object",
          description:
            "预留绘制配置。当前 type=empty 表示透明画布，后续可扩展为纹理/粒子/程序图案等。",
          properties: {
            type: { type: "string", default: "empty" },
            version: { type: "number", default: 0 },
          },
          additionalProperties: true,
        },
      },
      additionalProperties: false,
    },
    WordCloudListItem: {
      type: "array",
      description: "wordcloud2 list 项，格式为 [word, size, ...extraData]",
      minItems: 2,
      items: [{ type: "string" }, { type: "number", minimum: 0 }],
      additionalItems: true,
    },
    WordCloud2EngineOptions: {
      type: "object",
      description: "wordcloud2.js 参数。事件/交互回调不作为可保存 meta 暴露。",
      properties: {
        list: {
          type: "array",
          items: { $ref: "#/definitions/WordCloudListItem" },
        },
        fontFamilyInfo: {
          type: ["object", "null"],
          description: "字体资源信息。存在 id 时渲染为 font_${id}",
          additionalProperties: true,
        },
        fontFamily: { type: "string", default: "sans-serif" },
        fontWeight: { type: ["string", "number"], default: "600" },
        colorMode: {
          type: "string",
          enum: ["fixed", "palette", "random-dark", "random-light"],
          default: "palette",
        },
        color: { type: "string", default: "#111111" },
        colors: { type: "array", items: { type: "string" } },
        minSize: { type: "number", minimum: 0, default: 8 },
        weightFactor: { type: "number", minimum: 0, default: 1 },
        clearCanvas: { type: "boolean", default: true },
        backgroundColor: { type: "string", default: "rgba(0,0,0,0)" },
        gridSize: { type: "number", minimum: 1, default: 8 },
        origin: {
          type: ["array", "null"],
          items: { type: "number" },
          minItems: 2,
          maxItems: 2,
        },
        drawOutOfBound: { type: "boolean", default: false },
        shrinkToFit: { type: "boolean", default: true },
        drawMask: { type: "boolean", default: false },
        maskColor: { type: "string", default: "rgba(255,0,0,0.3)" },
        maskGapWidth: { type: "number", minimum: 0, default: 0.3 },
        wait: { type: "number", minimum: 0, default: 0 },
        abortThreshold: { type: "number", minimum: 0, default: 0 },
        minRotation: { type: "number", default: -1.5707963267948966 },
        maxRotation: { type: "number", default: 1.5707963267948966 },
        rotationSteps: { type: "number", minimum: 0, default: 2 },
        shuffle: { type: "boolean", default: true },
        rotateRatio: { type: "number", minimum: 0, maximum: 1, default: 0.35 },
        shape: {
          type: "string",
          enum: [
            "circle",
            "cardioid",
            "diamond",
            "square",
            "triangle-forward",
            "triangle",
            "pentagon",
            "star",
          ],
          default: "circle",
        },
        ellipticity: { type: "number", minimum: 0, default: 1 },
      },
      additionalProperties: false,
    },
    WordCloudChild: {
      type: "object",
      description:
        "词云元素。当前使用 wordcloud2 引擎绘制到 canvas，导出时捕获 canvas 像素。",
      required: ["type"],
      properties: {
        type: { const: "wordCloud" },
        width: { $ref: "#/definitions/SizeValue" },
        height: { $ref: "#/definitions/SizeValue" },
        zIndex: { type: "number", default: 0 },
        position: { $ref: "#/definitions/Position" },
        transform: { $ref: "#/definitions/Transform" },
        filter: { $ref: "#/definitions/Filter" },
        wordCloud: {
          type: "object",
          properties: {
            version: { type: "number", default: 1 },
            engine: {
              type: "string",
              enum: ["wordcloud2"],
              default: "wordcloud2",
            },
            engines: {
              type: "object",
              properties: {
                wordcloud2: { $ref: "#/definitions/WordCloud2EngineOptions" },
              },
              required: ["wordcloud2"],
              additionalProperties: true,
            },
          },
          required: ["engine", "engines"],
          additionalProperties: false,
        },
      },
      additionalProperties: false,
    },
    ThreeSceneThreejsEngineOptions: {
      type: "object",
      description: "threejs 引擎参数。用于在子元素内渲染基础 3D 场景。",
      properties: {
        background: {
          type: "string",
          default: "transparent",
          description: "transparent 或 CSS 颜色值",
        },
        camera: {
          type: "object",
          properties: {
            fov: { type: "number", minimum: 1, maximum: 120, default: 45 },
            near: { type: "number", minimum: 0.001, default: 0.1 },
            far: { type: "number", minimum: 1, default: 1000 },
            position: {
              type: "object",
              properties: {
                x: { type: "number", default: 0 },
                y: { type: "number", default: 0 },
                z: { type: "number", default: 3.5 },
              },
              additionalProperties: false,
            },
          },
          additionalProperties: false,
        },
        lights: {
          type: "object",
          properties: {
            ambient: {
              type: "object",
              properties: {
                color: { type: "string", default: "#ffffff" },
                intensity: { type: "number", minimum: 0, default: 0.9 },
              },
              additionalProperties: false,
            },
            directional: {
              type: "object",
              properties: {
                color: { type: "string", default: "#ffffff" },
                intensity: { type: "number", minimum: 0, default: 1.1 },
                position: {
                  type: "object",
                  properties: {
                    x: { type: "number", default: 2 },
                    y: { type: "number", default: 2 },
                    z: { type: "number", default: 3 },
                  },
                  additionalProperties: false,
                },
              },
              additionalProperties: false,
            },
          },
          additionalProperties: false,
        },
        object: {
          type: "object",
          properties: {
            shape: {
              type: "string",
              enum: ["box", "sphere", "torus", "plane"],
              default: "box",
            },
            color: { type: "string", default: "#4f46e5" },
            metalness: {
              type: "number",
              minimum: 0,
              maximum: 1,
              default: 0.25,
            },
            roughness: {
              type: "number",
              minimum: 0,
              maximum: 1,
              default: 0.35,
            },
            wireframe: { type: "boolean", default: false },
            scale: {
              type: "object",
              properties: {
                x: { type: "number", default: 1 },
                y: { type: "number", default: 1 },
                z: { type: "number", default: 1 },
              },
              additionalProperties: false,
            },
            rotation: {
              type: "object",
              properties: {
                x: { type: "number", default: 0 },
                y: { type: "number", default: 0 },
                z: { type: "number", default: 0 },
              },
              additionalProperties: false,
            },
          },
          additionalProperties: false,
        },
        animation: {
          type: "object",
          properties: {
            autoRotate: { type: "boolean", default: true },
            speedX: { type: "number", default: 0.01 },
            speedY: { type: "number", default: 0.02 },
            speedZ: { type: "number", default: 0 },
          },
          additionalProperties: false,
        },
      },
      additionalProperties: false,
    },
    ThreeSceneChild: {
      type: "object",
      description:
        "Three.js 子元素。当前使用 threejs 引擎渲染到子 canvas，导出时捕获其像素。",
      required: ["type"],
      properties: {
        type: { const: "threeScene" },
        width: { $ref: "#/definitions/SizeValue" },
        height: { $ref: "#/definitions/SizeValue" },
        zIndex: { type: "number", default: 0 },
        position: { $ref: "#/definitions/Position" },
        transform: { $ref: "#/definitions/Transform" },
        filter: { $ref: "#/definitions/Filter" },
        threeScene: {
          type: "object",
          properties: {
            version: { type: "number", default: 1 },
            engine: { type: "string", enum: ["threejs"], default: "threejs" },
            engines: {
              type: "object",
              properties: {
                threejs: {
                  $ref: "#/definitions/ThreeSceneThreejsEngineOptions",
                },
              },
              required: ["threejs"],
              additionalProperties: true,
            },
          },
          required: ["engine", "engines"],
          additionalProperties: false,
        },
      },
      additionalProperties: false,
    },
    EchartChild: {
      type: "object",
      description:
        "ECharts 子元素。直接透传原生 ECharts option，保持最大通用性；option 必须是可序列化 JSON 对象。",
      required: ["type"],
      properties: {
        type: { const: "echart" },
        width: { $ref: "#/definitions/SizeValue" },
        height: { $ref: "#/definitions/SizeValue" },
        zIndex: { type: "number", default: 0 },
        position: { $ref: "#/definitions/Position" },
        transform: { $ref: "#/definitions/Transform" },
        filter: { $ref: "#/definitions/Filter" },
        echart: {
          type: "object",
          properties: {
            version: { type: "number", default: 1 },
            engine: { type: "string", enum: ["echarts"], default: "echarts" },
            engines: {
              type: "object",
              properties: {
                echarts: {
                  type: "object",
                  properties: {
                    renderer: {
                      type: "string",
                      enum: ["canvas", "svg"],
                      default: "canvas",
                    },
                    theme: { type: "string", default: "" },
                    option: {
                      type: "object",
                      description:
                        "原生 ECharts setOption(option) 配置。只能使用 JSON，可包含任意 ECharts 支持的配置字段。",
                      additionalProperties: true,
                    },
                  },
                  required: ["option"],
                  additionalProperties: true,
                },
              },
              required: ["echarts"],
              additionalProperties: true,
            },
          },
          required: ["engine", "engines"],
          additionalProperties: false,
        },
      },
      additionalProperties: false,
    },
    MathChild: {
      type: "object",
      description:
        "数学公式子元素。使用 KaTeX 渲染 LaTeX 公式，并通过 mhchem 支持化学式、离子、反应方程式和单位，适合静态理科公式贴纸。",
      required: ["type", "formula"],
      properties: {
        type: { const: "math" },
        formula: {
          type: "string",
          description:
            "LaTeX/mhchem 公式字符串，例如 E=mc^2、\\frac{a}{b}=c、\\ce{2H2 + O2 -> 2H2O} 或 \\pu{9.8 m/s2}。JSON 中反斜杠需要转义。",
        },
        displayMode: {
          type: "boolean",
          default: true,
          description: "是否使用块级公式显示",
        },
        throwOnError: {
          type: "boolean",
          default: false,
          description: "公式错误时是否抛出错误",
        },
        strict: {
          type: "string",
          enum: ["warn", "ignore", "error"],
          default: "warn",
        },
        trust: {
          type: "boolean",
          default: false,
          description: "是否信任 KaTeX HTML/URL 等命令",
        },
        fontSize: {
          type: "object",
          description: "公式整体字号",
          properties: {
            value: { type: "number", minimum: 1 },
            unit: { const: "px" },
          },
          required: ["value", "unit"],
          additionalProperties: false,
        },
        fontFamilyInfo: {
          type: ["object", "null"],
          description:
            "字体资源信息。存在 id 时渲染为 font_${id}，存在 url 时会尝试加载字体",
          properties: {
            id: { type: "string" },
            url: { type: "string" },
            name: { type: "string" },
          },
          additionalProperties: true,
        },
        fontFamily: {
          type: "string",
          default: "",
          description:
            "CSS 字体族兜底值，例如 serif 或 sans-serif；fontFamilyInfo 优先",
        },
        fontColor: { $ref: "#/definitions/ColorValue" },
        backgroundColor: { $ref: "#/definitions/ColorValue" },
        textAlign: {
          type: "string",
          enum: ["left", "center", "right"],
          default: "center",
        },
        width: { $ref: "#/definitions/SizeValue" },
        height: { $ref: "#/definitions/SizeValue" },
        zIndex: { type: "number", default: 0 },
        position: { $ref: "#/definitions/Position" },
        transform: { $ref: "#/definitions/Transform" },
        filter: { $ref: "#/definitions/Filter" },
      },
      additionalProperties: false,
    },
    MermaidChild: {
      type: "object",
      description:
        "Mermaid 图表子元素。使用 Mermaid DSL 渲染静态 SVG，适合流程图、时序图、类图、ER 图、甘特图、思维导图、时间轴等结构化视觉。",
      required: ["type", "source"],
      properties: {
        type: { const: "mermaid" },
        source: {
          type: "string",
          description:
            "Mermaid DSL 源码，例如 flowchart TD\\n  A[开始] --> B[完成]。JSON 中换行可用 \\n。",
        },
        config: {
          type: "object",
          description:
            "Mermaid 原生配置对象，可写 theme、themeVariables、flowchart、sequence、gantt、securityLevel 等 Mermaid 支持字段。",
          additionalProperties: true,
        },
        fontSize: {
          type: "object",
          description:
            "容器基础字号，主要用于错误提示；Mermaid 图中文字建议通过 config.themeVariables.fontSize 控制",
          properties: {
            value: { type: "number", minimum: 1 },
            unit: { const: "px" },
          },
          required: ["value", "unit"],
          additionalProperties: false,
        },
        backgroundColor: { $ref: "#/definitions/ColorValue" },
        width: { $ref: "#/definitions/SizeValue" },
        height: { $ref: "#/definitions/SizeValue" },
        zIndex: { type: "number", default: 0 },
        position: { $ref: "#/definitions/Position" },
        transform: { $ref: "#/definitions/Transform" },
        filter: { $ref: "#/definitions/Filter" },
      },
      additionalProperties: false,
    },
    CodeBlockChild: {
      type: "object",
      description:
        "代码块子元素。使用 Shiki 渲染静态代码高亮卡片，适合程序员贴纸、教程图、技术海报。",
      required: ["type", "source"],
      properties: {
        type: { const: "codeBlock" },
        source: {
          type: "string",
          description: "代码内容。JSON 中换行可用 \\n。",
        },
        language: {
          type: "string",
          default: "ts",
          description:
            "Shiki 语言标识，例如 ts、js、vue、python、go、rust、json、html、css、shell。",
        },
        theme: {
          type: "string",
          default: "github-dark",
          description:
            "Shiki 主题，例如 github-dark、github-light、vitesse-dark、nord、dracula。",
        },
        filename: { type: "string", default: "example.ts" },
        showHeader: { type: "boolean", default: true },
        showLineNumbers: { type: "boolean", default: true },
        wrap: { type: "boolean", default: false, description: "是否自动换行" },
        fontSize: {
          type: "object",
          description: "代码字号",
          properties: {
            value: { type: "number", minimum: 1 },
            unit: { const: "px" },
          },
          required: ["value", "unit"],
          additionalProperties: false,
        },
        fontFamilyInfo: {
          type: ["object", "null"],
          description: "字体资源信息。存在 id 时渲染为 font_${id}",
          properties: {
            id: { type: "string" },
            url: { type: "string" },
            name: { type: "string" },
          },
          additionalProperties: true,
        },
        fontFamily: {
          type: "string",
          default: 'Consolas, Monaco, "Courier New", monospace',
        },
        lineHeight: { type: "number", minimum: 0.8, default: 1.55 },
        padding: { $ref: "#/definitions/SizeValue" },
        borderRadius: { $ref: "#/definitions/SizeValue" },
        backgroundColor: { $ref: "#/definitions/ColorValue" },
        config: {
          type: "object",
          description:
            "Shiki codeToHtml 原生扩展配置。lang/theme 由 language/theme 字段控制。",
          additionalProperties: true,
        },
        width: { $ref: "#/definitions/SizeValue" },
        height: { $ref: "#/definitions/SizeValue" },
        zIndex: { type: "number", default: 0 },
        position: { $ref: "#/definitions/Position" },
        transform: { $ref: "#/definitions/Transform" },
        filter: { $ref: "#/definitions/Filter" },
      },
      additionalProperties: false,
    },
    MoleculeChild: {
      type: "object",
      description:
        "分子结构子元素。使用 RDKit.js 渲染静态分子结构 SVG，适合化学分子、有机物、药物结构贴纸。",
      required: ["type", "source"],
      properties: {
        type: { const: "molecule" },
        inputType: {
          type: "string",
          enum: ["smiles", "molblock"],
          default: "smiles",
          description: "输入类型：smiles 或 molblock",
        },
        source: {
          type: "string",
          description:
            "SMILES 或 MolBlock 字符串，例如 c1ccccc1（苯）或 CC(=O)Oc1ccccc1C(=O)O（阿司匹林）",
        },
        drawOptions: {
          type: "object",
          description: "RDKit get_svg_with_highlights 的渲染配置，直接透传",
          additionalProperties: true,
        },
        backgroundColor: { $ref: "#/definitions/ColorValue" },
        width: { $ref: "#/definitions/SizeValue" },
        height: { $ref: "#/definitions/SizeValue" },
        zIndex: { type: "number", default: 0 },
        position: { $ref: "#/definitions/Position" },
        transform: { $ref: "#/definitions/Transform" },
        filter: { $ref: "#/definitions/Filter" },
      },
      additionalProperties: false,
    },
    ThreeMolChild: {
      type: "object",
      description:
        "3D分子子元素。使用 3Dmol.js 渲染交互式 3D 分子结构，支持 PDB/SDF/XYZ/MOL2 格式。",
      required: ["type"],
      properties: {
        type: { const: "threeMol" },
        data: {
          type: "string",
          description: "分子数据字符串（PDB/SDF/XYZ/MOL2 格式）",
        },
        format: {
          type: "string",
          enum: ["pdb", "sdf", "xyz", "mol2"],
          default: "pdb",
          description: "数据格式",
        },
        pdbId: {
          type: "string",
          description: "PDB 数据库 ID，例如 1BNA、4HHB，设置后会自动下载",
        },
        style: {
          type: "string",
          enum: ["stick", "sphere", "cartoon", "line", "cross"],
          default: "stick",
          description: "渲染样式",
        },
        backgroundColor: { $ref: "#/definitions/ColorValue" },
        width: { $ref: "#/definitions/SizeValue" },
        height: { $ref: "#/definitions/SizeValue" },
        zIndex: { type: "number", default: 0 },
        position: { $ref: "#/definitions/Position" },
        transform: { $ref: "#/definitions/Transform" },
        filter: { $ref: "#/definitions/Filter" },
      },
      additionalProperties: false,
    },
    AbcNotationChild: {
      type: "object",
      description:
        "ABC 记谱法乐谱子元素。使用 abcjs 渲染 ABC 记谱法文本为 SVG 乐谱。",
      required: ["type"],
      properties: {
        type: { const: "abcNotation" },
        source: {
          type: "string",
          description: "ABC 记谱法文本，例如 X:1\\nT:小星星\\nM:4/4\\nK:C\\nC C G G | A A G2",
        },
        abcOptions: {
          type: "object",
          description: "abcjs 渲染选项，直接透传",
          additionalProperties: true,
        },
        backgroundColor: { $ref: "#/definitions/ColorValue" },
        width: { $ref: "#/definitions/SizeValue" },
        height: { $ref: "#/definitions/SizeValue" },
        zIndex: { type: "number", default: 0 },
        position: { $ref: "#/definitions/Position" },
        transform: { $ref: "#/definitions/Transform" },
        filter: { $ref: "#/definitions/Filter" },
      },
      additionalProperties: false,
    },
    VexFlowChild: {
      type: "object",
      description:
        "VexFlow 五线谱子元素。使用 VexFlow 渲染专业五线谱。",
      required: ["type"],
      properties: {
        type: { const: "vexFlow" },
        notes: {
          type: "array",
          description: "音符数组，每个音符包含 keys 和 duration",
          items: {
            type: "object",
            properties: {
              keys: {
                type: "array",
                items: { type: "string" },
                description: "音符键，例如 ['c/4'] 或 ['c/4', 'e/4']",
              },
              duration: {
                type: "string",
                enum: ["w", "h", "q", "8", "16"],
                default: "q",
                description: "音符时值：w=全音符, h=二分, q=四分, 8=八分, 16=十六分",
              },
            },
            required: ["keys"],
          },
        },
        clef: {
          type: "string",
          enum: ["treble", "bass", "alto", "tenor"],
          default: "treble",
          description: "谱号",
        },
        timeSignature: {
          type: "string",
          default: "4/4",
          description: "拍号，例如 4/4、3/4、6/8",
        },
        backgroundColor: { $ref: "#/definitions/ColorValue" },
        width: { $ref: "#/definitions/SizeValue" },
        height: { $ref: "#/definitions/SizeValue" },
        zIndex: { type: "number", default: 0 },
        position: { $ref: "#/definitions/Position" },
        transform: { $ref: "#/definitions/Transform" },
        filter: { $ref: "#/definitions/Filter" },
      },
      additionalProperties: false,
    },
  },
};

export function buildDirectDesignPrompt(currentCanvas?: any): string {
  const lines: string[] = [STICKER_DESIGN_SYSTEM, ""];

  if (currentCanvas) {
    lines.push("## 当前画布状态（可完全替换）");
    lines.push("");
    lines.push("```json");
    lines.push(JSON.stringify(currentCanvas, null, 2));
    lines.push("```");
    lines.push("");
  }

  lines.push("## 热门配色参考");
  lines.push("");
  lines.push("以下配色可参考使用（也可自由发挥）：");
  lines.push(
    "红:#FF0000 橙:#FF6B35 金:#FFD700 深红:#DC143C 粉:#FF69B4 蓝:#1E90FF 绿:#228B22 青:#00CED1 紫:#9370DB 黑:#000000 白:#FFFFFF",
  );
  lines.push("");

  return lines.join("\n");
}

export function parseDirectDesignResult(text: string): any | null {
  const re = /```canvas-design\s*\n([\s\S]*?)```/g;
  const match = re.exec(text);
  if (!match) return null;
  try {
    return JSON.parse(match[1].trim());
  } catch {
    return null;
  }
}

export function stripDesignBlocks(text: string): string {
  return text.replace(/```canvas-design\s*\n[\s\S]*?```/g, "").trim();
}

function deepMergeDefaults(target: any, source: any): any {
  if (!source || typeof source !== "object") return source ?? target;
  if (!target || typeof target !== "object") return source;

  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (key in result) {
      if (
        result[key] !== null &&
        source[key] !== null &&
        typeof result[key] === "object" &&
        typeof source[key] === "object" &&
        !Array.isArray(result[key]) &&
        !Array.isArray(source[key])
      ) {
        result[key] = deepMergeDefaults(result[key], source[key]);
      } else {
        result[key] = source[key];
      }
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

export function validateDesignData(data: any): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!data || typeof data !== "object") {
    return { valid: false, errors: ["数据不是有效对象"] };
  }
  if (!Array.isArray(data.children) || data.children.length === 0) {
    errors.push("children 数组不能为空");
    return { valid: false, errors };
  }

  const baseChild = data.children.find((c: any) => c.type === "canvas");
  if (!baseChild) {
    errors.push('children 中缺少 type="canvas" 的画布底板');
  } else if (!baseChild.width || !baseChild.height) {
    errors.push("画布底板必须包含 width 和 height");
  }

  const canvasCount = data.children.filter(
    (c: any) => c.type === "canvas",
  ).length;
  if (canvasCount > 1) {
    errors.push("画布底板只能有一个");
  }

  for (let i = 0; i < data.children.length; i++) {
    const child = data.children[i];
    if (!child.type) {
      errors.push(`children[${i}] 缺少 type 字段`);
    }
    if (CHILD_DEFAULT_FACTORIES[child.type] === undefined) {
      errors.push(`children[${i}].type="${child.type}" 不是有效的类型`);
    }
  }

  return { valid: errors.length === 0, errors };
}

const FONT_WEIGHT_MAP: Record<string, string> = {
  thin: "100",
  hairline: "100",
  extralight: "200",
  "ultra-light": "200",
  light: "300",
  normal: "400",
  regular: "400",
  medium: "500",
  semibold: "600",
  "semi-bold": "600",
  demibold: "600",
  bold: "700",
  extrabold: "800",
  "ultra-bold": "800",
  black: "900",
  heavy: "900",
};

function normalizeFontWeight(value: any): string {
  if (typeof value === "number") return String(value);
  if (typeof value !== "string") return "500";
  const lower = value.toLowerCase().replace(/\s+/g, "");
  return FONT_WEIGHT_MAP[lower] || value;
}

function isSizeValue(obj: any): boolean {
  return obj && typeof obj === "object" && "value" in obj && "unit" in obj;
}

function toSizeValue(val: any, fallbackUnit = "px"): any {
  if (typeof val === "number") return { value: val, unit: fallbackUnit };
  if (typeof val === "string") {
    const num = parseFloat(val);
    if (!isNaN(num)) return { value: num, unit: fallbackUnit };
  }
  return val;
}

function normalizeDefaultsMismatch(defaults: any, source: any): any {
  if (!source || typeof source !== "object") return source;
  if (!defaults || typeof defaults !== "object") return source;

  const result = { ...source };
  for (const key of Object.keys(source)) {
    const dv = defaults[key];
    const sv = source[key];
    if (dv === undefined) continue;

    if (isSizeValue(dv) && !isSizeValue(sv)) {
      result[key] = toSizeValue(sv, dv.unit);
    } else if (
      dv &&
      typeof dv === "object" &&
      !Array.isArray(dv) &&
      sv &&
      typeof sv === "object" &&
      !Array.isArray(sv)
    ) {
      result[key] = normalizeDefaultsMismatch(dv, sv);
    }
  }
  return result;
}

function normalizeChildOptions(child: any, defaults?: any): any {
  if (defaults) {
    return normalizeDefaultsMismatch(defaults, child);
  }
  if (child.type === "text" && child.fontWeight) {
    child.fontWeight = normalizeFontWeight(child.fontWeight);
  }
  return child;
}

export function applyDesignToCanvas(data: any): void {
  const canvas = canvasStickerOptions.value;

  if (data.unit) canvas.unit = data.unit;
  if (data.supportBackgroundColor)
    canvas.supportBackgroundColor = data.supportBackgroundColor;

  const newChildren: any[] = [];
  for (const child of data.children) {
    const factory = CHILD_DEFAULT_FACTORIES[child.type];
    if (!factory) continue;

    const defaults = factory();
    const normalized = normalizeDefaultsMismatch(defaults, child);
    if (normalized.type === "text" && normalized.fontWeight) {
      normalized.fontWeight = normalizeFontWeight(normalized.fontWeight);
    }
    const merged = deepMergeDefaults(defaults, normalized);

    if (!merged.id) {
      merged.id =
        "_" + String(Date.now()) + "_" + Math.random().toString(36).slice(2, 6);
    }

    newChildren.push(merged);
  }

  if (newChildren.length === 0) return;

  canvas.children = newChildren;
  const base = newChildren.find((c) => c.type === "canvas");
  if (base) {
    currentOperatingCanvasChildId.value = base.id;
  }
}
