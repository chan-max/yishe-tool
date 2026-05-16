import { instance } from "@viz-js/viz";
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

export const createDefaultCanvasChildGraphvizOptions = () => {
  const canvasUnit = canvasStickerOptionsOnlyChild.value.width.unit;

  return {
    type: "graphviz",
    dot: "digraph { a -> b }",
    backgroundColor: {
      type: "pure",
      color: "transparent",
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

export function createCanvasChildGraphviz(options) {
  return (
    <GraphvizChild
      options={options}
      onVnodeUpdated={updateRenderingCanvas}
      onVnodeMounted={updateRenderingCanvas}
    ></GraphvizChild>
  );
}

export const GraphvizChild = defineComponent({
  props: {
    options: null,
  },
  setup(props) {
    const targetRef = ref<HTMLElement>();
    const svgHtml = ref("");
    const errorMessage = ref("");

    onCanvasChildSetup({
      targetEl: targetRef,
      options: props.options,
      props,
    });

    const dot = computed(() => String(props.options?.dot || "").trim());

    async function renderGraphviz() {
      const text = dot.value;
      if (!text) {
        svgHtml.value = "";
        errorMessage.value = "请输入 DOT 语法";
        await nextTick();
        updateRenderingCanvas();
        return;
      }

      try {
        errorMessage.value = "";
        const viz = await instance();
        const svgElement = viz.renderSVGElement(text);
        svgHtml.value = svgElement.outerHTML;
      } catch (error: any) {
        svgHtml.value = "";
        errorMessage.value = error?.message || "Graphviz 渲染失败";
      } finally {
        await nextTick();
        updateRenderingCanvas();
      }
    }

    watch(dot, renderGraphviz, {
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
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        boxSizing: "border-box",
        position: "relative",
        padding: 0,
        pointerEvents: "none",
        ..._style,
      };

      onBeforeReturnRender({
        style,
        options: props.options,
      });

      return (
        <div style={containerStyle}>
          <div ref={targetRef} class="canvas-graphviz-child" style={style}>
            <style>{`
                        .canvas-graphviz-child svg {
                            width: 100%;
                            height: 100%;
                            max-width: 100%;
                            max-height: 100%;
                            display: block;
                        }
                        .canvas-graphviz-child .canvas-graphviz-child__error {
                            color: #c45656;
                            font-size: 0.28em;
                            line-height: 1.4;
                            padding: 0.75em;
                            background: rgba(255, 245, 245, 0.92);
                            border: 1px solid rgba(196, 86, 86, 0.35);
                            border-radius: 4px;
                            white-space: pre-wrap;
                            max-width: 100%;
                            max-height: 100%;
                            overflow: hidden;
                            box-sizing: border-box;
                        }
                    `}</style>
            {errorMessage.value ? (
              <div class="canvas-graphviz-child__error">
                {errorMessage.value}
              </div>
            ) : (
              <div
                class="canvas-graphviz-child__content"
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                innerHTML={svgHtml.value}
              ></div>
            )}
          </div>
        </div>
      );
    };
  },
});
