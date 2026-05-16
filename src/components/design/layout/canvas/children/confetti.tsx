import { defineComponent, ref, onMounted, watch } from "vue";
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
import confetti from "canvas-confetti";

export const CONFETTI_PRESETS = [
  "default",
  "fireworks",
  "snow",
  "celebration",
  "school",
] as const;

export const createDefaultCanvasChildConfettiOptions = () => {
  const canvasUnit = canvasStickerOptionsOnlyChild.value.width.unit;

  return {
    type: "confetti",
    preset: "default",
    particleCount: 100,
    spread: 70,
    startVelocity: 45,
    decay: 0.9,
    gravity: 1,
    ticks: 200,
    colors: ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"],
    backgroundColor: { type: "pure", color: "transparent" },
    width: { value: 100, unit: "vw" },
    height: { value: 100, unit: "vh" },
    position: createPositionDefaultOptions(canvasUnit),
    filter: createFilterDefaultOptions(canvasUnit),
    zIndex: 0,
    ...createBasicDefaultOptions(),
    transform: createTransformDefaultOptions(canvasUnit),
  };
};

export function createCanvasChildConfetti(options: any) {
  return (
    <ConfettiChild
      options={options}
      onVnodeUpdated={updateRenderingCanvas}
      onVnodeMounted={updateRenderingCanvas}
    />
  );
}

function getPresetConfig(preset: string): any {
  switch (preset) {
    case "fireworks":
      return {
        particleCount: 80,
        spread: 100,
        startVelocity: 50,
        decay: 0.85,
        gravity: 0.8,
        ticks: 300,
        origin: { x: 0.5, y: 0.7 },
      };
    case "snow":
      return {
        particleCount: 150,
        spread: 180,
        startVelocity: 10,
        decay: 0.95,
        gravity: 0.3,
        ticks: 500,
        colors: ["#ffffff", "#e0e0ff", "#c0c0ff"],
        shapes: ["circle"],
        scalar: 0.8,
      };
    case "celebration":
      return {
        particleCount: 200,
        spread: 120,
        startVelocity: 60,
        decay: 0.8,
        gravity: 1.2,
        ticks: 250,
      };
    case "school":
      return {
        particleCount: 100,
        spread: 80,
        startVelocity: 35,
        decay: 0.9,
        gravity: 1,
        ticks: 200,
        colors: ["#ff6b35", "#ffd700", "#4169e1"],
      };
    default:
      return {};
  }
}

export const ConfettiChild = defineComponent({
  props: { options: null },
  setup(props) {
    const targetRef = ref<HTMLElement>();
    const canvasRef = ref<HTMLCanvasElement>();

    onCanvasChildSetup({
      targetEl: targetRef,
      options: props.options,
      props,
    });

    function fire() {
      const preset = props.options?.preset || "default";
      const presetConfig = getPresetConfig(preset);

      const config: any = {
        particleCount:
          props.options?.particleCount || presetConfig.particleCount || 100,
        spread: props.options?.spread || presetConfig.spread || 70,
        startVelocity:
          props.options?.startVelocity || presetConfig.startVelocity || 45,
        decay: props.options?.decay || presetConfig.decay || 0.9,
        gravity: props.options?.gravity || presetConfig.gravity || 1,
        ticks: props.options?.ticks || presetConfig.ticks || 200,
        colors: props.options?.colors?.length
          ? props.options.colors
          : presetConfig.colors,
        shapes: presetConfig.shapes,
        scalar: presetConfig.scalar,
        origin: presetConfig.origin || { x: 0.5, y: 0.5 },
      };

      if (canvasRef.value) {
        const myConfetti = confetti.create(canvasRef.value, {
          resize: true,
          useWorker: false,
        });
        myConfetti(config);
      }
    }

    onMounted(() => {
      setTimeout(fire, 100);
    });

    watch(
      () => [
        props.options?.preset,
        props.options?.particleCount,
        props.options?.spread,
        props.options?.colors,
      ],
      () => {
        setTimeout(fire, 50);
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
        background: props.options.backgroundColor?.color || "transparent",
        overflow: "hidden",
        pointerEvents: "none",
        ..._style,
      };

      onBeforeReturnRender({ style, options: props.options });

      return (
        <div ref={targetRef} style={containerStyle}>
          <canvas ref={canvasRef} style={style} />
        </div>
      );
    };
  },
});
