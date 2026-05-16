import {
  computed,
  defineComponent,
  nextTick,
  onBeforeUnmount,
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

export const PARTICLES_EFFECT_PRESETS = [
  "stars",
  "bubbles",
  "snow",
  "fire",
  "custom",
] as const;

const PRESET_CONFIGS: Record<string, any> = {
  stars: {
    particles: {
      number: { value: 160, density: { enable: true, value_area: 800 } },
      color: { value: "#ffffff" },
      shape: { type: "circle" },
      opacity: {
        value: 1,
        random: true,
        anim: { enable: true, speed: 1, opacity_min: 0, sync: false },
      },
      size: { value: 3, random: true, anim: { enable: false } },
      line_linked: { enable: false },
      move: {
        enable: true,
        speed: 0.3,
        direction: "none",
        random: true,
        straight: false,
        out_mode: "out",
      },
    },
    interactivity: {
      detect_on: "canvas",
      events: { onhover: { enable: false }, onclick: { enable: false } },
    },
  },
  bubbles: {
    particles: {
      number: { value: 40, density: { enable: true, value_area: 800 } },
      color: { value: "#ffffff" },
      shape: { type: "circle" },
      opacity: {
        value: 0.5,
        random: true,
        anim: { enable: true, speed: 2, opacity_min: 0.1, sync: false },
      },
      size: {
        value: 20,
        random: true,
        anim: { enable: true, speed: 5, size_min: 5, sync: false },
      },
      line_linked: { enable: false },
      move: {
        enable: true,
        speed: 2,
        direction: "top",
        random: true,
        straight: false,
        out_mode: "out",
      },
    },
    interactivity: {
      detect_on: "canvas",
      events: { onhover: { enable: false }, onclick: { enable: false } },
    },
  },
  snow: {
    particles: {
      number: { value: 200, density: { enable: true, value_area: 800 } },
      color: { value: "#ffffff" },
      shape: { type: "circle" },
      opacity: { value: 0.7, random: true },
      size: { value: 4, random: true },
      line_linked: { enable: false },
      move: {
        enable: true,
        speed: 2,
        direction: "bottom",
        random: false,
        straight: false,
        out_mode: "out",
      },
    },
    interactivity: {
      detect_on: "canvas",
      events: { onhover: { enable: false }, onclick: { enable: false } },
    },
  },
  fire: {
    particles: {
      number: { value: 80, density: { enable: true, value_area: 400 } },
      color: { value: ["#ff6600", "#ff3300", "#ff9900", "#ffcc00"] },
      shape: { type: "circle" },
      opacity: {
        value: 0.8,
        random: true,
        anim: { enable: true, speed: 1, opacity_min: 0, sync: false },
      },
      size: {
        value: 6,
        random: true,
        anim: { enable: true, speed: 3, size_min: 1, sync: false },
      },
      line_linked: { enable: false },
      move: {
        enable: true,
        speed: 4,
        direction: "top",
        random: true,
        straight: false,
        out_mode: "out",
      },
    },
    interactivity: {
      detect_on: "canvas",
      events: { onhover: { enable: false }, onclick: { enable: false } },
    },
  },
};

function mergeDeep(target: any, source: any): any {
  const output = { ...target };
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          output[key] = source[key];
        } else {
          output[key] = mergeDeep(target[key], source[key]);
        }
      } else {
        output[key] = source[key];
      }
    });
  }
  return output;
}

function isObject(item: any): boolean {
  return item && typeof item === "object" && !Array.isArray(item);
}

function getConfigForPreset(preset: string, customConfig: any): any {
  const baseConfig = {
    fullScreen: false,
    detectRetina: true,
    background: { color: "transparent" },
  };

  let presetConfig = {};
  if (preset !== "custom" && PRESET_CONFIGS[preset]) {
    presetConfig = JSON.parse(JSON.stringify(PRESET_CONFIGS[preset]));
  }

  const userConfig = preset === "custom" ? customConfig || {} : {};

  return mergeDeep(mergeDeep(baseConfig, presetConfig), userConfig);
}

export const createDefaultCanvasChildParticlesEffectOptions = () => {
  const canvasUnit = canvasStickerOptionsOnlyChild.value.width.unit;

  return {
    type: "particlesEffect",
    preset: "stars",
    config: {},
    backgroundColor: {
      type: "pure",
      color: "#000000",
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

export function createCanvasChildParticlesEffect(options: any) {
  return (
    <ParticlesEffectChild
      options={options}
      onVnodeUpdated={updateRenderingCanvas}
      onVnodeMounted={updateRenderingCanvas}
    ></ParticlesEffectChild>
  );
}

let particlesJsInstance: any = null;

export const ParticlesEffectChild = defineComponent({
  props: {
    options: null,
  },
  setup(props) {
    const targetRef = ref<HTMLElement>();
    const containerRef = ref<HTMLElement>();
    let currentInstance: any = null;

    onCanvasChildSetup({
      targetEl: targetRef,
      options: props.options,
      props,
    });

    const preset = computed(() => props.options?.preset || "stars");
    const config = computed(() => props.options?.config || {});

    async function initParticles() {
      if (!containerRef.value) return;

      if (currentInstance) {
        try {
          currentInstance.destroys();
        } catch {}
        currentInstance = null;
      }

      try {
        if (!particlesJsInstance) {
          const module = await import("particles.js");
          particlesJsInstance = module.default || (window as any).particlesJS;
        }

        const finalConfig = getConfigForPreset(preset.value, config.value);
        const containerId = containerRef.value.id;

        if (typeof particlesJsInstance === "function") {
          particlesJsInstance(containerId, finalConfig);
        } else if (particlesJsInstance.load) {
          particlesJsInstance.load(containerId, finalConfig);
        }

        currentInstance = containerRef.value;
      } catch (error) {
        console.error("Particles effect init failed:", error);
      }

      nextTick(() => {
        updateRenderingCanvas();
      });
    }

    watch(() => [preset.value, config.value], initParticles, {
      immediate: true,
      deep: true,
    });

    watch(containerRef, () => {
      nextTick(initParticles);
    });

    onBeforeUnmount(() => {
      if (currentInstance) {
        try {
          currentInstance.destroys();
        } catch {}
        currentInstance = null;
      }
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
        ..._style,
      };

      onBeforeReturnRender({
        style,
        options: props.options,
      });

      const uniqueId = `particles-container-${props.options?.id || Math.random().toString(36).slice(2)}`;

      return (
        <div style={containerStyle}>
          <div
            ref={targetRef}
            class="canvas-particles-effect-child"
            style={style}
          >
            <div
              ref={containerRef}
              id={uniqueId}
              style={{ width: "100%", height: "100%" }}
            ></div>
          </div>
        </div>
      );
    };
  },
});
