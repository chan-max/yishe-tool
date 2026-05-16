import cytoscape from "cytoscape";
import {
  computed,
  defineComponent,
  nextTick,
  onBeforeUnmount,
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

export const createDefaultCanvasChildCytoscapeGraphOptions = () => {
  const canvasUnit = canvasStickerOptionsOnlyChild.value.width.unit;

  return {
    type: "cytoscapeGraph",
    elements: {
      nodes: [
        { data: { id: "a", label: "A" } },
        { data: { id: "b", label: "B" } },
      ],
      edges: [{ data: { source: "a", target: "b" } }],
    },
    layout: "preset",
    style: {
      nodeColor: "#4A90D9",
      nodeBorderColor: "#2C6FAC",
      edgeColor: "#666666",
      labelColor: "#333333",
    },
    width: {
      value: 100,
      unit: "vw",
    },
    height: {
      value: 100,
      unit: "vh",
    },
    backgroundColor: {
      type: "pure",
      color: "#ffffff",
    },
    position: createPositionDefaultOptions(canvasUnit),
    filter: createFilterDefaultOptions(canvasUnit),
    zIndex: 0,
    ...createBasicDefaultOptions(),
    transform: createTransformDefaultOptions(canvasUnit),
  };
};

export function createCanvasChildCytoscapeGraph(options) {
  return (
    <CytoscapeGraphChild
      options={options}
      onVnodeUpdated={updateRenderingCanvas}
      onVnodeMounted={updateRenderingCanvas}
    ></CytoscapeGraphChild>
  );
}

export const CytoscapeGraphChild = defineComponent({
  props: {
    options: null,
  },
  setup(props) {
    const targetRef = ref<HTMLElement>();
    const containerRef = ref<HTMLElement>();
    const errorMessage = ref("");
    let cyInstance: any = null;

    onCanvasChildSetup({
      targetEl: targetRef,
      options: props.options,
      props,
    });

    const elements = computed(() => {
      const el = props.options?.elements;
      if (!el) return [];
      if (Array.isArray(el)) return el;
      const nodes = el.nodes || [];
      const edges = el.edges || [];
      return [...nodes, ...edges];
    });

    const rawElements = computed(
      () => props.options?.elements || { nodes: [], edges: [] },
    );
    const layout = computed(() => String(props.options?.layout || "preset"));
    const styleConfig = computed(() => props.options?.style || {});

    function renderCytoscape() {
      if (!containerRef.value) return;

      if (cyInstance) {
        cyInstance.destroy();
        cyInstance = null;
      }

      if (elements.value.length === 0) {
        containerRef.value.innerHTML = "";
        errorMessage.value = "请输入节点和边数据";
        updateRenderingCanvas();
        return;
      }

      try {
        errorMessage.value = "";

        const nodeColor = styleConfig.value.nodeColor || "#4A90D9";
        const nodeBorderColor = styleConfig.value.nodeBorderColor || "#2C6FAC";
        const edgeColor = styleConfig.value.edgeColor || "#666666";
        const labelColor = styleConfig.value.labelColor || "#333333";

        cyInstance = cytoscape({
          container: containerRef.value,
          elements: elements.value,
          layout: {
            name: layout.value,
            ...getLayoutOptions(),
          },
          style: [
            {
              selector: "node",
              style: {
                "background-color": nodeColor,
                "border-color": nodeBorderColor,
                "border-width": 2,
                label: "data(label)",
                color: labelColor,
                "text-valign": "center",
                "text-halign": "center",
                "font-size": "12px",
                width: 40,
                height: 40,
              },
            },
            {
              selector: "edge",
              style: {
                width: 2,
                "line-color": edgeColor,
                "target-arrow-color": edgeColor,
                "target-arrow-shape": "triangle",
                "curve-style": "bezier",
              },
            },
          ],
          userZoomingEnabled: false,
          userPanningEnabled: false,
          boxSelectionEnabled: false,
          autoungrabify: true,
        });
      } catch (error: any) {
        containerRef.value.innerHTML = "";
        errorMessage.value = error?.message || "Cytoscape 渲染失败";
      } finally {
        updateRenderingCanvas();
      }
    }

    function getLayoutOptions() {
      const layoutName = layout.value;

      if (layoutName === "preset") {
        const nodes = elements.value.filter(
          (el: any) => el.data && !el.data.source,
        );
        const positions: any = {};
        nodes.forEach((node: any, index: number) => {
          if (!node.position) {
            positions[node.data.id] = {
              x: 50 + (index % 5) * 100,
              y: 50 + Math.floor(index / 5) * 100,
            };
          }
        });
        return { positions };
      }

      if (layoutName === "grid") {
        return { rows: undefined, cols: undefined };
      }

      if (layoutName === "circle") {
        return {};
      }

      if (layoutName === "concentric") {
        return {};
      }

      if (layoutName === "breadthfirst") {
        return { directed: true };
      }

      if (layoutName === "cose") {
        return {};
      }

      return {};
    }

    onMounted(() => {
      nextTick(renderCytoscape);
    });

    onBeforeUnmount(() => {
      if (cyInstance) {
        cyInstance.destroy();
        cyInstance = null;
      }
    });

    watch(
      [elements, layout, styleConfig],
      () => {
        nextTick(renderCytoscape);
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
        background: props.options.backgroundColor?.color || "transparent",
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
                        .canvas-cytoscape-graph-child__error {
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
                    `}</style>
            {errorMessage.value ? (
              <div class="canvas-cytoscape-graph-child__error">
                {errorMessage.value}
              </div>
            ) : (
              <div
                ref={containerRef}
                class="canvas-cytoscape-graph-child"
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
