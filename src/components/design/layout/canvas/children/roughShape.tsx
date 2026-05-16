import {
  computed,
  defineComponent,
  nextTick,
  ref,
  watch,
  onMounted,
  onUpdated,
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
import rough from "roughjs";

export const ROUGH_SHAPE_TYPES = ["rect", "circle", "line", "ellipse"] as const;

export const createDefaultCanvasChildRoughShapeOptions = () => {
  const canvasUnit = canvasStickerOptionsOnlyChild.value.width.unit;

  return {
    type: "roughShape",
    shape: "rect" as const,
    fill: "#4ECDC4",
    stroke: "#000000",
    strokeWidth: 2,
    roughness: 1,
    width: {
      value: 100,
      unit: "px",
    },
    height: {
      value: 100,
      unit: "px",
    },
    position: createPositionDefaultOptions(canvasUnit),
    filter: createFilterDefaultOptions(canvasUnit),
    zIndex: 0,
    ...createBasicDefaultOptions(),
    transform: createTransformDefaultOptions(canvasUnit),
  };
};

export function createCanvasChildRoughShape(options: any) {
  return (
    <RoughShapeChild
      options={options}
      onVnodeUpdated={updateRenderingCanvas}
      onVnodeMounted={updateRenderingCanvas}
    ></RoughShapeChild>
  );
}

export const RoughShapeChild = defineComponent({
  props: {
    options: null,
  },
  setup(props) {
    const targetRef = ref<HTMLElement>();
    const canvasRef = ref<HTMLCanvasElement>();
    const errorMessage = ref("");
    let renderToken = 0;

    onCanvasChildSetup({
      targetEl: targetRef,
      options: props.options,
      props,
    });

    const shape = computed(() => props.options?.shape || "rect");
    const fill = computed(() => props.options?.fill || "#4ECDC4");
    const stroke = computed(() => props.options?.stroke || "#000000");
    const strokeWidth = computed(() => props.options?.strokeWidth || 2);
    const roughness = computed(() => props.options?.roughness || 1);

    function renderRoughShape() {
      const token = ++renderToken;
      const canvas = canvasRef.value;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const rc = rough.canvas(canvas);
      const width = canvas.width;
      const height = canvas.height;

      // 清除画布
      ctx.clearRect(0, 0, width, height);

      try {
        errorMessage.value = "";
        const options = {
          fill: fill.value,
          stroke: stroke.value,
          strokeWidth: strokeWidth.value,
          roughness: roughness.value,
        };

        switch (shape.value) {
          case "rect":
            rc.rectangle(10, 10, width - 20, height - 20, options);
            break;
          case "circle":
            const radius = Math.min(width, height) / 2 - 10;
            rc.circle(width / 2, height / 2, radius * 2, options);
            break;
          case "line":
            rc.line(10, 10, width - 10, height - 10, options);
            break;
          case "ellipse":
            rc.ellipse(width / 2, height / 2, width - 20, height - 20, options);
            break;
          default:
            rc.rectangle(10, 10, width - 20, height - 20, options);
        }
      } catch (error: any) {
        if (token !== renderToken) return;
        errorMessage.value = error?.message || "手绘图形渲染失败";
      } finally {
        if (token === renderToken) {
          nextTick().then(() => {
            updateRenderingCanvas();
          });
        }
      }
    }

    function updateCanvasSize() {
      const canvas = canvasRef.value;
      if (!canvas) return;

      const container = targetRef.value;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    }

    onMounted(() => {
      updateCanvasSize();
      renderRoughShape();
    });

    onUpdated(() => {
      updateCanvasSize();
      renderRoughShape();
    });

    watch(
      () => [
        shape.value,
        fill.value,
        stroke.value,
        strokeWidth.value,
        roughness.value,
      ],
      () => {
        nextTick().then(() => {
          updateCanvasSize();
          renderRoughShape();
        });
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

      return (
        <div style={containerStyle}>
          <div
            ref={targetRef}
            class="canvas-rough-shape-child"
            style={style}
            data-shape-type={shape.value}
          >
            <style>{`
              .canvas-rough-shape-child canvas {
                width: 100%;
                height: 100%;
              }
              .canvas-rough-shape-child__error {
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
              <div class="canvas-rough-shape-child__error">
                {errorMessage.value}
              </div>
            ) : (
              <canvas ref={canvasRef}></canvas>
            )}
          </div>
        </div>
      );
    };
  },
});
