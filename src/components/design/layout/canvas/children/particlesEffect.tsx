import { defineComponent, ref, onMounted, onBeforeUnmount, watch } from "vue";
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

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
}

const PRESETS: Record<string, () => Partial<Particle>> = {
  stars: () => ({
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
    size: Math.random() * 2 + 0.5,
    opacity: Math.random() * 0.8 + 0.2,
    color: `hsl(${Math.random() * 60 + 40}, 100%, ${Math.random() * 30 + 70}%)`,
  }),
  bubbles: () => ({
    vx: (Math.random() - 0.5) * 0.3,
    vy: -Math.random() * 1 - 0.5,
    size: Math.random() * 8 + 2,
    opacity: Math.random() * 0.5 + 0.2,
    color: `hsla(${Math.random() * 40 + 180}, 70%, 70%, 0.6)`,
  }),
  snow: () => ({
    vx: (Math.random() - 0.5) * 0.5,
    vy: Math.random() * 1 + 0.3,
    size: Math.random() * 3 + 1,
    opacity: Math.random() * 0.6 + 0.4,
    color: `hsla(0, 0%, 100%, ${Math.random() * 0.5 + 0.5})`,
  }),
  fire: () => ({
    vx: (Math.random() - 0.5) * 1,
    vy: -Math.random() * 2 - 1,
    size: Math.random() * 4 + 2,
    opacity: 1,
    color: `hsl(${Math.random() * 30 + 10}, 100%, ${Math.random() * 30 + 40}%)`,
  }),
};

export const createDefaultCanvasChildParticlesEffectOptions = () => {
  const canvasUnit = canvasStickerOptionsOnlyChild.value.width.unit;

  return {
    type: "particlesEffect",
    preset: "stars",
    particleCount: 80,
    backgroundColor: { type: "pure", color: "#000000" },
    width: { value: 100, unit: "vw" },
    height: { value: 100, unit: "vh" },
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
    />
  );
}

export const ParticlesEffectChild = defineComponent({
  props: { options: null },
  setup(props) {
    const canvasRef = ref<HTMLCanvasElement>();
    const particles: Particle[] = [];
    let animationId: number | null = null;
    let renderToken = 0;

    onCanvasChildSetup({
      targetEl: canvasRef,
      options: props.options,
      props,
    });

    function createParticle(width: number, height: number): Particle {
      const preset = props.options?.preset || "stars";
      const presetFn = PRESETS[preset] || PRESETS.stars;
      const base = presetFn();

      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: base.vx || 0,
        vy: base.vy || 0,
        size: base.size || 2,
        opacity: base.opacity || 1,
        color: base.color || "#ffffff",
      };
    }

    function animate() {
      const token = renderToken;
      const canvas = canvasRef.value;
      if (!canvas || token !== renderToken) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(animate);
    }

    function initParticles() {
      const canvas = canvasRef.value;
      if (!canvas) return;

      const parent = canvas.parentElement;
      if (!parent) return;

      const rect = parent.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(rect.width));
      canvas.height = Math.max(1, Math.round(rect.height));

      const count = props.options?.particleCount || 80;
      particles.length = 0;
      for (let i = 0; i < count; i++) {
        particles.push(createParticle(canvas.width, canvas.height));
      }

      if (animationId) cancelAnimationFrame(animationId);
      animate();
    }

    onMounted(() => {
      const token = ++renderToken;
      setTimeout(() => {
        if (token === renderToken) initParticles();
      }, 50);
    });

    watch(
      () => [props.options?.preset, props.options?.particleCount],
      () => {
        const token = ++renderToken;
        setTimeout(() => {
          if (token === renderToken) initParticles();
        }, 50);
      },
    );

    onBeforeUnmount(() => {
      renderToken++;
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
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

      const bgColor = props.options?.backgroundColor?.color || "#000000";

      const style: any = {
        flexShrink: 0,
        width: formatToNativeSizeString(props.options.width),
        height: formatToNativeSizeString(props.options.height),
        transform: createTransformString(props.options.transform),
        filter: createFilterFromOptions(props.options.filter),
        zIndex: props.options.zIndex,
        background: bgColor,
        overflow: "hidden",
        ..._style,
      };

      onBeforeReturnRender({ style, options: props.options });

      return (
        <div style={containerStyle}>
          <canvas ref={canvasRef} style={style} />
        </div>
      );
    };
  },
});
