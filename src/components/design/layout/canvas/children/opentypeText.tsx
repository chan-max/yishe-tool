import opentype from "opentype.js";
import {
  computed,
  defineComponent,
  nextTick,
  onMounted,
  ref,
  watch,
} from "vue";
import {
  canvasStickerOptionsOnlyChild,
  updateRenderingCanvas,
} from "../index.tsx";
import {
  createFilterFromOptions,
  createTransformString,
  formatToNativeSizeString,
  getPositionInfoFromOptions,
} from "../helper.tsx";
import {
  createBasicDefaultOptions,
  createFilterDefaultOptions,
  createPositionDefaultOptions,
  createTransformDefaultOptions,
} from "./defaultOptions.tsx";
import { onBeforeReturnRender, onCanvasChildSetup } from "./commonHooks.ts";

export const createDefaultCanvasChildOpentypeTextOptions = () => {
  const canvasUnit = canvasStickerOptionsOnlyChild.value.width.unit;

  return {
    type: "opentypeText",
    text: "Hello",
    fontUrl: "",
    fontSize: 72,
    fillColor: "#000000",
    width: {
      value: 400,
      unit: "px",
    },
    height: {
      value: 200,
      unit: "px",
    },
    position: createPositionDefaultOptions(canvasUnit),
    filter: createFilterDefaultOptions(canvasUnit),
    zIndex: 0,
    ...createBasicDefaultOptions(),
    transform: createTransformDefaultOptions(canvasUnit),
  };
};

export function createCanvasChildOpentypeText(options) {
  return (
    <OpentypeTextChild
      options={options}
      onVnodeUpdated={updateRenderingCanvas}
      onVnodeMounted={updateRenderingCanvas}
    ></OpentypeTextChild>
  );
}

export const OpentypeTextChild = defineComponent({
  props: {
    options: null,
  },
  setup(props) {
    const targetRef = ref<HTMLElement>();
    const containerRef = ref<HTMLElement>();
    const errorMessage = ref("");
    const svgPath = ref("");
    const loading = ref(false);

    onCanvasChildSetup({
      targetEl: targetRef,
      options: props.options,
      props,
    });

    const text = computed(() => String(props.options?.text || "").trim());
    const fontUrl = computed(() => String(props.options?.fontUrl || "").trim());
    const fontSize = computed(() => Number(props.options?.fontSize) || 72);
    const fillColor = computed(() =>
      String(props.options?.fillColor || "#000000"),
    );

    async function loadFontAndRender() {
      if (!containerRef.value) return;

      const currentText = text.value;
      const currentFontUrl = fontUrl.value;

      if (!currentText) {
        containerRef.value.innerHTML = "";
        svgPath.value = "";
        errorMessage.value = "请输入文字内容";
        updateRenderingCanvas();
        return;
      }

      if (!currentFontUrl) {
        containerRef.value.innerHTML = "";
        svgPath.value = "";
        errorMessage.value = "请输入字体文件URL";
        updateRenderingCanvas();
        return;
      }

      loading.value = true;
      errorMessage.value = "";

      try {
        const font = await opentype.load(currentFontUrl);
        const path = font.getPath(
          currentText,
          0,
          fontSize.value,
          fontSize.value,
        );
        const pathData = path.toPathData(2);
        svgPath.value = pathData;

        const bbox = path.getBoundingBox();
        const svgWidth = Math.ceil(bbox.x2 - bbox.x1) || 1000;
        const svgHeight = Math.ceil(bbox.y2 - bbox.y1) || 200;
        const viewBox = `${bbox.x1} ${bbox.y1} ${svgWidth} ${svgHeight}`;

        containerRef.value.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="100%" height="100%"><path d="${pathData}" fill="${fillColor.value}"/></svg>`;
      } catch (error: any) {
        containerRef.value.innerHTML = "";
        svgPath.value = "";
        errorMessage.value = error?.message || "字体加载失败";
      } finally {
        loading.value = false;
        updateRenderingCanvas();
      }
    }

    onMounted(() => {
      nextTick(loadFontAndRender);
    });

    watch(
      [text, fontUrl, fontSize, fillColor],
      () => {
        nextTick(loadFontAndRender);
      },
      {
        deep: true,
      },
    );

    return () => {
      const { containerStyle: _containerStyle, style: _style } =
        getPositionInfoFromOptions(props.options.position);

      const containerStyle: any = {
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        ..._containerStyle,
      };

      const style: any = {
        flexShrink: 0,
        width: formatToNativeSizeString(props.options.width),
        height: formatToNativeSizeString(props.options.height),
        transform: createTransformString(props.options.transform),
        filter: createFilterFromOptions(props.options.filter),
        zIndex: props.options.zIndex,
        overflow: "hidden",
        position: "relative",
        pointerEvents: "none",
        ..._style,
      };

      onBeforeReturnRender({
        style,
        options: props.options,
      });

      return (
        <div style={containerStyle}>
          <div ref={targetRef} style={style}>
            <style>{`
                        .canvas-opentype-text-child svg {
                            width: 100%;
                            height: 100%;
                            max-width: 100%;
                            max-height: 100%;
                            display: block;
                        }
                        .canvas-opentype-text-child__error {
                            color: #c45656;
                            font-size: 14px;
                            line-height: 1.4;
                            padding: 12px;
                            background: rgba(255, 245, 245, 0.92);
                            border: 1px solid rgba(196, 86, 86, 0.35);
                            border-radius: 4px;
                            white-space: pre-wrap;
                            max-width: 100%;
                            max-height: 100%;
                            overflow: hidden;
                            box-sizing: border-box;
                        }
                        .canvas-opentype-text-child__loading {
                            color: #666;
                            font-size: 14px;
                            padding: 12px;
                            text-align: center;
                        }
                    `}</style>
            {errorMessage.value ? (
              <div class="canvas-opentype-text-child__error">
                {errorMessage.value}
              </div>
            ) : loading.value ? (
              <div class="canvas-opentype-text-child__loading">加载中...</div>
            ) : (
              <div
                ref={containerRef}
                class="canvas-opentype-text-child"
                style={{
                  width: "100%",
                  height: "100%",
                  overflow: "hidden",
                }}
              ></div>
            )}
          </div>
        </div>
      );
    };
  },
});
