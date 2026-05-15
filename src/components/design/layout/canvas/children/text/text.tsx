import {
  canvasStickerOptions,
  canvasStickerOptionsOnlyChild,
  currentCanvasControllerInstance,
  updateRenderingCanvas,
} from "../../index.tsx";
import {
  getPositionInfoFromOptions,
  formatToNativeSizeOption,
  parseTextShadowOptionsToCSS,
  formatSizeOptionToPixelValue,
  formatToNativeSizeString,
  createFilterFromOptions,
  createTransformString,
} from "../../helper.tsx";
import {
  defineComponent,
  onMounted,
  onUpdated,
  ref,
  watchEffect,
  nextTick,
  watch,
} from "vue";
// import CircleType from "circletype";
import { tify, sify } from "chinese-conv";
import {
  createFilterDefaultOptions,
  createTransformDefaultOptions,
  createPositionDefaultOptions,
} from "../defaultOptions.tsx";
import { fetchFontFaceWithMessage } from "@/components/design/layout/canvas/operate/fontFamily/index.ts";
import Utils from "@/common/utils.ts";
import { defineCanvasChild } from "../define.tsx";
import { onCanvasChildSetup, onBeforeReturnRender } from "../commonHooks.ts";

export interface TextCanvasChildOptions {
  center: boolean | null | undefined;
}

enum WritingMode {
  HTB = "horizontal-tb",
  VLR = "vertical-lr",
  VRL = "vertical-rl",
}

export const createDefaultCanvasChildTextOptions = () => {
  const canvasUnit = canvasStickerOptionsOnlyChild.value.width.unit;

  return {
    type: "text",
    fontColor: {
      color: "#000",
      type: "pure",
    },
    zIndex: 0,
    position: createPositionDefaultOptions(canvasUnit),
    fontSize: {
      value: 160,
      unit: canvasUnit,
    },
    textShadow: [],
    fontWeight: "500",
    lineHeight: 1,
    letterSpacing: 0,
    textContent: "do something special",
    writingMode: "htb",
    isRoundText: false,
    roundTextRadius: {
      unit: canvasUnit,
      value: 200,
    },
    roundTextStartDeg: 0,
    isCounterclockwise: false,

    textStrokeWidth: {
      unit: canvasUnit,
      value: 0,
    },
    textStrokeColor: {
      type: "pure",
      color: "#fff",
    },
    transform: createTransformDefaultOptions(canvasUnit),
    filter: createFilterDefaultOptions(canvasUnit),
    // 是否使用繁体字
    isTraditionalChinese: false,
    // 文字对齐方式
    textAlign: "left",
    containerEl: null,
    targetComputedWidth: 0,
    targetComputedHeight: 0,

    imageInfo: null, // 文字背景图
  };
};

export function createCanvasChildText(options) {
  return (
    <Text
      options={options}
      onVnodeUpdated={updateRenderingCanvas}
      onVnodeMounted={updateRenderingCanvas}
    ></Text>
  );
}

export const Text = defineComponent({
  props: {
    options: null,
  },
  setup(props, ctx) {
    // 文字容器，用于布局
    const targetElRef = ref();

    onCanvasChildSetup({
      targetEl: targetElRef,
      options: props.options,
      props: props,
    });

    // 用来包裹文字单元块

    const roundTextContainer = ref();
    const roundTextInnerContainerRef = ref();

    // 文字单元格
    const textContentCells = ref([]);

    // key值，用于更新
    const key = ref(0);

    watchEffect(() => {
      let el = roundTextInnerContainerRef.value;
      let container = roundTextContainer.value;

      if (!el || !container) {
        return;
      }

      if (props.options.isRoundText) {
        createRoundText(container, el, props.options, textContentCells.value);
      }
    });

    return () => {
      const { containerStyle: _containerStyle, style: _style } =
        getPositionInfoFromOptions(props.options.position);

      var containerStyle: any = {
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        ..._containerStyle,
      };

      var style: any = {
        flexShrink: 0,
        fontSize: formatToNativeSizeString(props.options.fontSize),
        fontWeight: props.options.fontWeight,
        fontStyle: props.options.italic ? "italic" : "normal",
        lineHeight: props.options.lineHeight + "em",
        letterSpacing: props.options.letterSpacing + "em",
        fontFamily: "undefined", // 默认设置为一个不存在的字体，防止被本地字体影响
        writingMode:
          props.options.writingMode == "htb"
            ? WritingMode.HTB
            : props.options.writingMode == "vlr"
              ? WritingMode.VLR
              : props.options.writingMode == "vrl"
                ? WritingMode.VRL
                : null,
        filter: createFilterFromOptions(props.options.filter),
        textShadow: parseTextShadowOptionsToCSS(props.options.textShadow),
        textStroke:
          formatToNativeSizeString(props.options.textStrokeWidth) +
          " " +
          props.options.textStrokeColor.color,
        perspective: formatToNativeSizeString(
          props.options.transform.perspective,
        ),
        // 用于显示换行
        whiteSpace: "pre-wrap",
        textWrap: "nowrap",
        textAlign: props.options.textAlign || "left",
        zIndex: props.options.zIndex,
        ..._style,
      };

      // 文字字体
      if (props.options.fontFamilyInfo) {
        style.fontFamily = `font_${props.options.fontFamilyInfo.id}`;
        // 由于不确定字体是否加载，需要初始化一下
        fetchFontFaceWithMessage(props.options.fontFamilyInfo);
      }

      // 处理文字颜色
      if (props.options.fontColor) {
        if (props.options.fontColor.type == "gradient") {
          style.background = props.options.fontColor.color;
          style.backgroundClip = "text";
          style.color = "transparent";
        } else {
          style.color = props.options.fontColor.color;
        }
      }

      // 文字背景图
      if (props.options.imageInfo) {
        style.background = `url(${props.options.imageInfo.url})`;
        style.backgroundClip = "text";
        style.color = "transparent";
        style.backgroundSize = "cover"; // contain
      }

      const textContainerStyle = {
        background: "inherit",
        color: "inherit",
        backgroundClip: "inherit",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      };

      const innerStyle = {
        background: "inherit",
        color: "inherit",
        backgroundClip: "inherit",
      };

      const rowStyle = {
        background: "inherit",
        color: "inherit",
        backgroundClip: "inherit",
      };

      const cellStyle = {
        display: "inline-block",
        background: "inherit",
        color: "inherit",
        backgroundClip: "inherit",
      };

      var textContent = props.options.textContent;

      // 设置为繁体字
      if (props.options.isTraditionalChinese) {
        textContent = tify(textContent);
      }

      // 生成文字单元格
      const rows = textContent.split("\n").filter((item) => item !== "");

      textContentCells.value = rows.map((row) => {
        return row.split("").map((content) => {
          return {
            content,
          };
        });
      });

      let roundNode = (
        <div ref={roundTextContainer} style={textContainerStyle}>
          <div ref={roundTextInnerContainerRef} style={innerStyle}>
            {textContentCells.value.map((row, rowIndex) => {
              const cells = row.map((cell, columnIndex) => {
                return (
                  <div
                    id={`row-${rowIndex}-col-${columnIndex}`}
                    data-rowIndex={rowIndex}
                    data-columnIndex={columnIndex}
                    style={{ ...cellStyle, ...cell.style }}
                  >
                    {cell.content}
                  </div>
                );
              });
              return <div style={rowStyle}> {cells} </div>;
            })}
          </div>
        </div>
      );

      onBeforeReturnRender({
        containerStyle,
        style,
        options: props.options,
      });

      return (
        <div style={containerStyle} key={key.value}>
          <div ref={targetElRef} style={style}>
            {props.options.isRoundText ? roundNode : textContent}
          </div>
        </div>
      );
    };
  },
});

/*
    input
    环形的半径，默认为最小尺寸，即以圆形铺满，
    起始位置的角度
        - 自适应对称
        - 正上方开始    
    换行文字已最外行为基准 
*/

function createRoundText(container, innerContainer, options, textContentCells) {
  innerContainer.style.position = "relative";

  const startDeg = options.roundTextStartDeg;
  const isCounterclockwise = options.isCounterclockwise;
  const radius = formatSizeOptionToPixelValue(options.roundTextRadius);
  const fontSize = options.fontSize.value;
  const lineHeightPixelValue = formatSizeOptionToPixelValue({
    value: options.lineHeight * fontSize,
    unit: options.fontSize.unit,
  });
  const letterSpacingPixelValue = formatSizeOptionToPixelValue({
    value: options.letterSpacing * fontSize,
    unit: options.fontSize.unit,
  });

  const dir = isCounterclockwise ? -1 : 1;

  // 元素插入页面后再计算真实宽度
  textContentCells.forEach((row, rowIndex) => {
    row.forEach((item, columnIndex) => {
      const el = innerContainer.querySelector(
        `#row-${rowIndex}-col-${columnIndex}`,
      );
      if (!el) return;
      el.style.position = "absolute";
      item.el = el;

      const width = Utils.getComputedWidth(el);
      const height = Utils.getComputedHeight(el);
      item.width = width;
      item.height = height;
      item.rawWidth = width - letterSpacingPixelValue;
    });
  });

  textContentCells.forEach((row, rowIndex) => {
    // 多行时半径递减
    const r = radius - rowIndex * lineHeightPixelValue;
    if (r < 10) return;

    // CircleType: innerRadius = radius - lineHeight
    const innerRadius = r - lineHeightPixelValue;

    // CircleType: originY = dir === -1 ? (-radius + lineHeight) : radius
    const originY = dir === -1 ? -r + lineHeightPixelValue : r;
    const origin = `center ${originY / fontSize}em`;

    // 计算每个字符的旋转角（参照 getLetterRotations）
    const rotations: number[] = [];
    let totalAngle = 0;
    row.forEach((item) => {
      const rotationDeg = (item.width / innerRadius) * (180 / Math.PI);
      rotations.push(totalAngle + rotationDeg / 2);
      totalAngle += rotationDeg;
    });

    row.forEach((item, index) => {
      if (!item.el) return;

      // CircleType: rotate = ((θ * -0.5) + rotations[index]) * dir
      const rotate =
        (totalAngle * -0.5 + rotations[index]) * dir + startDeg * dir;

      // CircleType: translateX = (width * -0.5) / fontSize (em 单位)
      const translateX = (item.width * -0.5) / fontSize;

      item.el.style.left = "50%";
      item.el.style.bottom = dir === -1 ? "0" : "auto";
      item.el.style.top = dir === -1 ? "auto" : "0";
      item.el.style.transform = `translateX(${translateX}em) rotate(${rotate}deg)`;
      item.el.style.transformOrigin = origin;
    });

    // CircleType: 用 sagitta 算容器高度
    const sagitta = (radius: number, angleDeg: number) =>
      radius * (1 - Math.cos((angleDeg * Math.PI) / 360));
    const height =
      totalAngle > 180
        ? sagitta(r, totalAngle)
        : sagitta(innerRadius, totalAngle) + lineHeightPixelValue;
    container.style.height = `${height / fontSize}em`;
  });
}
