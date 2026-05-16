import ApexCharts from "apexcharts";
import {
  computed,
  defineComponent,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";
import { useDebounceFn } from "@vueuse/core";
import {
  canvasStickerOptionsOnlyChild,
  updateRenderingCanvas,
} from "../index.tsx";
import {
  createBasicDefaultOptions,
  createFilterDefaultOptions,
  createPositionDefaultOptions,
  createTransformDefaultOptions,
} from "./defaultOptions.tsx";
import {
  createFilterFromOptions,
  createTransformString,
  formatToNativeSizeString,
  getPositionInfoFromOptions,
} from "../helper.tsx";
import { onBeforeReturnRender, onCanvasChildSetup } from "./commonHooks.ts";

export const createDefaultCanvasChildApexChartOptions = () => {
  const canvasUnit = canvasStickerOptionsOnlyChild.value.width.unit;

  return {
    type: "apexChart",
    options: {
      chart: { type: "bar" },
      series: [{ name: "Sample", data: [30, 40, 35, 50, 49] }],
      xaxis: { categories: ["A", "B", "C", "D", "E"] },
    },
    backgroundColor: {
      type: "pure",
      color: "#ffffff",
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

export function createCanvasChildApexChart(options: any) {
  return (
    <ApexChartChild
      options={options}
      onVnodeUpdated={updateRenderingCanvas}
      onVnodeMounted={updateRenderingCanvas}
    ></ApexChartChild>
  );
}

export const ApexChartChild = defineComponent({
  props: {
    options: null,
  },
  setup(props) {
    const chartRef = ref<HTMLElement>();
    let chartInstance: ApexCharts | null = null;

    onCanvasChildSetup({
      targetEl: chartRef,
      options: props.options,
      props,
    });

    function destroyChart() {
      if (chartInstance) {
        chartInstance.destroy();
        chartInstance = null;
      }
    }

    const renderChart = useDebounceFn(async () => {
      await nextTick();
      const el = chartRef.value;
      if (!el) return;

      destroyChart();

      const chartOptions = props.options.options || {};

      try {
        chartInstance = new ApexCharts(
          el,
          JSON.parse(JSON.stringify(chartOptions)),
        );
        chartInstance.render();
        updateRenderingCanvas();
      } catch (error: any) {
        console.warn("ApexCharts render failed:", error);
      }
    }, 120);

    onMounted(renderChart);
    watch(() => props.options.options, renderChart, { deep: true });

    onBeforeUnmount(() => {
      destroyChart();
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
        position: "relative",
        ..._style,
      };

      onBeforeReturnRender({
        style,
        options: props.options,
      });

      return (
        <div style={containerStyle}>
          <div ref={chartRef} style={style}></div>
        </div>
      );
    };
  },
});
