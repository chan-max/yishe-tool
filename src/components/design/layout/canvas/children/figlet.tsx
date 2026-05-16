import { computed, defineComponent, nextTick, ref, watch } from "vue";
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

export const FIGLET_FONTS = [
  "Standard",
  "Ghost",
  "Big",
  "Banner",
  "Slant",
] as const;

export const createDefaultCanvasChildFigletOptions = () => {
  const canvasUnit = canvasStickerOptionsOnlyChild.value.width.unit;

  return {
    type: "figlet",
    text: "Hello",
    font: "Standard" as const,
    backgroundColor: {
      type: "pure",
      color: "transparent",
    },
    fontSize: {
      value: 14,
      unit: "px",
    },
    width: {
      value: 100,
      unit: "vw",
    },
    height: {
      value: 100,
      unit: "vh",
    },
    position: createPositionDefaultOptions(canvasUnit),
    filter: createFilterDefaultOptions(canvasUnit),
    zIndex: 0,
    ...createBasicDefaultOptions(),
    transform: createTransformDefaultOptions(canvasUnit),
  };
};

export function createCanvasChildFiglet(options: any) {
  return (
    <FigletChild
      options={options}
      onVnodeUpdated={updateRenderingCanvas}
      onVnodeMounted={updateRenderingCanvas}
    ></FigletChild>
  );
}

export const FigletChild = defineComponent({
  props: {
    options: null,
  },
  setup(props) {
    const targetRef = ref<HTMLElement>();
    const asciiArt = ref("");
    const errorMessage = ref("");
    let renderToken = 0;

    onCanvasChildSetup({
      targetEl: targetRef,
      options: props.options,
      props,
    });

    const text = computed(() => String(props.options?.text || ""));
    const font = computed(() => String(props.options?.font || "Standard"));

    async function renderFiglet() {
      const token = ++renderToken;

      try {
        errorMessage.value = "";

        // 动态加载 figlet
        const figletModule = await import("figlet");
        const figlet: any = figletModule.default || figletModule;

        const fontName = font.value;

        // 从 importable-fonts 加载字体
        try {
          // @ts-ignore
          const fontModule = await import(
            `figlet/importable-fonts/${fontName}.js`
          );
          figlet.registerFont(fontName, fontModule.default || fontModule);
        } catch {
          // 如果本地字体加载失败，从 CDN 加载
          const fontUrl = `https://unpkg.com/figlet@1.8.0/fonts/${fontName}.flf`;
          const response = await fetch(fontUrl);
          if (!response.ok) {
            throw new Error(`字体 ${fontName} 加载失败`);
          }
          const fontData = await response.text();
          figlet.parseFont(fontName, fontData);
        }

        const result = await new Promise<string>((resolve, reject) => {
          figlet.text(text.value, { font: fontName }, (err: any, data: any) => {
            if (err) {
              reject(err);
            } else {
              resolve(data || "");
            }
          });
        });

        if (token !== renderToken) return;
        asciiArt.value = result;
      } catch (error: any) {
        if (token !== renderToken) return;
        asciiArt.value = "";
        errorMessage.value = error?.message || "Figlet 渲染失败";
      } finally {
        if (token === renderToken) {
          await nextTick();
          updateRenderingCanvas();
        }
      }
    }

    watch(() => [text.value, font.value], renderFiglet, {
      immediate: true,
    });

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
        background: props.options.backgroundColor?.color || "transparent",
        overflow: "hidden",
        boxSizing: "border-box",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        ..._style,
      };

      onBeforeReturnRender({
        style,
        options: props.options,
      });

      const fontSize = props.options.fontSize?.value || 14;
      const fontSizeUnit = props.options.fontSize?.unit || "px";

      return (
        <div style={containerStyle}>
          <div
            ref={targetRef}
            class="canvas-figlet-child"
            style={style}
            data-figlet-font={font.value}
          >
            <style>{`
              .canvas-figlet-child pre {
                margin: 0;
                padding: 0;
                font-family: "Courier New", Courier, monospace;
                font-size: ${fontSize}${fontSizeUnit};
                line-height: 1.2;
                white-space: pre;
                text-align: center;
                color: inherit;
              }
              .canvas-figlet-child__error {
                color: #c45656;
                font-size: 14px;
                line-height: 1.4;
                padding: 12px;
                background: rgba(255, 245, 245, 0.92);
                border: 1px solid rgba(196, 86, 86, 0.35);
                border-radius: 4px;
                max-width: 80%;
                text-align: center;
              }
            `}</style>
            {errorMessage.value ? (
              <div class="canvas-figlet-child__error">{errorMessage.value}</div>
            ) : (
              <pre>{asciiArt.value}</pre>
            )}
          </div>
        </div>
      );
    };
  },
});
