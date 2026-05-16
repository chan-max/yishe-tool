import {
  canvasStickerOptionsOnlyChild,
  updateRenderingCanvas,
} from "../index.tsx";
import {
  getPositionInfoFromOptions,
  formatToNativeSizeString,
  createFilterFromOptions,
  createTransformString,
} from "../helper.tsx";
import { defineComponent, onBeforeUnmount, onMounted, ref, watch } from "vue";
import {
  createFilterDefaultOptions,
  createPositionDefaultOptions,
  createTransformDefaultOptions,
  createBasicDefaultOptions,
} from "./defaultOptions.tsx";
import { onBeforeReturnRender, onCanvasChildSetup } from "./commonHooks.ts";
import WaveSurfer from "wavesurfer.js";

export const createDefaultCanvasChildWaveformOptions = () => {
  const canvasUnit = canvasStickerOptionsOnlyChild.value.width.unit;

  return {
    type: "waveform",
    ...createBasicDefaultOptions(),
    position: createPositionDefaultOptions(canvasUnit),
    width: {
      value: 100,
      unit: "vw",
    },
    height: {
      value: 100,
      unit: "vh",
    },
    audioUrl: "",
    waveColor: "#4ECDC4",
    progressColor: "#FF6B6B",
    backgroundColor: {
      type: "pure",
      color: "#ffffff",
    },
    filter: createFilterDefaultOptions(canvasUnit),
    transform: createTransformDefaultOptions(canvasUnit),
    zIndex: 0,
  };
};

export function createCanvasChildWaveform(options) {
  return (
    <Waveform
      options={options}
      onVnodeUpdated={updateRenderingCanvas}
      onVnodeMounted={updateRenderingCanvas}
    ></Waveform>
  );
}

export const Waveform = defineComponent({
  props: {
    options: null,
  },
  setup(props, ctx) {
    const containerRef = ref();
    let wavesurfer: WaveSurfer | null = null;

    onCanvasChildSetup({
      targetEl: containerRef,
      options: props.options,
      props: props,
    });

    function destroyWaveSurfer() {
      if (wavesurfer) {
        wavesurfer.destroy();
        wavesurfer = null;
      }
    }

    function initWaveSurfer() {
      destroyWaveSurfer();

      if (!containerRef.value || !props.options.audioUrl) {
        return;
      }

      wavesurfer = WaveSurfer.create({
        container: containerRef.value,
        waveColor: props.options.waveColor,
        progressColor: props.options.progressColor,
        height: props.options.height,
        cursorWidth: 0,
        interact: false,
      });

      wavesurfer.load(props.options.audioUrl);

      wavesurfer.on("ready", () => {
        updateRenderingCanvas();
      });
    }

    onMounted(() => {
      initWaveSurfer();
    });

    watch(
      () => props.options.audioUrl,
      () => {
        initWaveSurfer();
      },
    );

    watch(
      () => props.options.waveColor,
      (val) => {
        if (wavesurfer) {
          wavesurfer.setOptions({ waveColor: val });
        }
      },
    );

    watch(
      () => props.options.progressColor,
      (val) => {
        if (wavesurfer) {
          wavesurfer.setOptions({ progressColor: val });
        }
      },
    );

    onBeforeUnmount(() => {
      destroyWaveSurfer();
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
        transform: createTransformString(props.options.transform),
        width: formatToNativeSizeString(props.options.width),
        height: formatToNativeSizeString(props.options.height),
        background: props.options.backgroundColor?.color || "#ffffff",
        filter: createFilterFromOptions(props.options.filter),
        zIndex: props.options.zIndex,
        overflow: "hidden",
        ..._style,
      };

      onBeforeReturnRender({
        style,
        options: props.options,
      });

      return (
        <div style={containerStyle}>
          <div ref={containerRef} style={style}>
            {!props.options.audioUrl && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  height: "100%",
                  color: "#999",
                  fontSize: "14px",
                }}
              >
                请设置音频URL
              </div>
            )}
          </div>
        </div>
      );
    };
  },
});
