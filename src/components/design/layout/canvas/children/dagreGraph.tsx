import dagre from "dagre";
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

export const createDefaultCanvasChildDagreGraphOptions = () => {
  const canvasUnit = canvasStickerOptionsOnlyChild.value.width.unit;

  return {
    type: "dagreGraph",
    nodes: [
      { id: "a", label: "A" },
      { id: "b", label: "B" },
    ],
    edges: [{ from: "a", to: "b" }],
    rankdir: "TB",
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

export function createCanvasChildDagreGraph(options) {
  return (
    <DagreGraphChild
      options={options}
      onVnodeUpdated={updateRenderingCanvas}
      onVnodeMounted={updateRenderingCanvas}
    ></DagreGraphChild>
  );
}

export const DagreGraphChild = defineComponent({
  props: {
    options: null,
  },
  setup(props) {
    const targetRef = ref<HTMLElement>();
    const containerRef = ref<HTMLElement>();
    const errorMessage = ref("");

    onCanvasChildSetup({
      targetEl: targetRef,
      options: props.options,
      props,
    });

    const nodes = computed(() => {
      const n = props.options?.nodes;
      if (!n || !Array.isArray(n)) return [];
      return n;
    });

    const edges = computed(() => {
      const e = props.options?.edges;
      if (!e || !Array.isArray(e)) return [];
      return e;
    });

    const rankdir = computed(() => {
      return props.options?.rankdir || "TB";
    });

    function renderDagreGraph() {
      if (!containerRef.value) return;

      if (nodes.value.length === 0) {
        containerRef.value.innerHTML = "";
        errorMessage.value = "请输入节点数据";
        updateRenderingCanvas();
        return;
      }

      try {
        errorMessage.value = "";

        const g = new dagre.graphlib.Graph();
        g.setGraph({ rankdir: rankdir.value });
        g.setDefaultEdgeLabel(() => ({}));

        // 添加节点
        nodes.value.forEach((node: any) => {
          g.setNode(node.id, {
            label: node.label || node.id,
            width: 80,
            height: 40,
          });
        });

        // 添加边
        edges.value.forEach((edge: any) => {
          g.setEdge(edge.from, edge.to);
        });

        // 计算布局
        dagre.layout(g);

        // 生成 SVG
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");

        // 计算边界
        let minX = Infinity,
          minY = Infinity,
          maxX = -Infinity,
          maxY = -Infinity;
        g.nodes().forEach((v: string) => {
          const node = g.node(v);
          minX = Math.min(minX, node.x - node.width / 2);
          minY = Math.min(minY, node.y - node.height / 2);
          maxX = Math.max(maxX, node.x + node.width / 2);
          maxY = Math.max(maxY, node.y + node.height / 2);
        });

        const padding = 20;
        const width = maxX - minX + padding * 2;
        const height = maxY - minY + padding * 2;

        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");
        svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
        svg.style.display = "block";

        // 绘制边
        g.edges().forEach((e: any) => {
          const edge = g.edge(e);
          const points = edge.points;
          if (points && points.length > 0) {
            const path = document.createElementNS(svgNS, "path");
            let d = `M ${points[0].x - minX + padding} ${points[0].y - minY + padding}`;
            for (let i = 1; i < points.length; i++) {
              d += ` L ${points[i].x - minX + padding} ${points[i].y - minY + padding}`;
            }
            path.setAttribute("d", d);
            path.setAttribute("stroke", "#666666");
            path.setAttribute("stroke-width", "2");
            path.setAttribute("fill", "none");
            path.setAttribute("marker-end", "url(#arrowhead)");
            svg.appendChild(path);
          }
        });

        // 定义箭头
        const defs = document.createElementNS(svgNS, "defs");
        const marker = document.createElementNS(svgNS, "marker");
        marker.setAttribute("id", "arrowhead");
        marker.setAttribute("markerWidth", "10");
        marker.setAttribute("markerHeight", "7");
        marker.setAttribute("refX", "10");
        marker.setAttribute("refY", "3.5");
        marker.setAttribute("orient", "auto");
        const polygon = document.createElementNS(svgNS, "polygon");
        polygon.setAttribute("points", "0 0, 10 3.5, 0 7");
        polygon.setAttribute("fill", "#666666");
        marker.appendChild(polygon);
        defs.appendChild(marker);
        svg.insertBefore(defs, svg.firstChild);

        // 绘制节点
        g.nodes().forEach((v: string) => {
          const node = g.node(v);

          // 节点矩形
          const rect = document.createElementNS(svgNS, "rect");
          rect.setAttribute(
            "x",
            String(node.x - node.width / 2 - minX + padding),
          );
          rect.setAttribute(
            "y",
            String(node.y - node.height / 2 - minY + padding),
          );
          rect.setAttribute("width", String(node.width));
          rect.setAttribute("height", String(node.height));
          rect.setAttribute("rx", "4");
          rect.setAttribute("ry", "4");
          rect.setAttribute("fill", "#4A90D9");
          rect.setAttribute("stroke", "#2C6FAC");
          rect.setAttribute("stroke-width", "2");
          svg.appendChild(rect);

          // 节点文字
          const text = document.createElementNS(svgNS, "text");
          text.setAttribute("x", String(node.x - minX + padding));
          text.setAttribute("y", String(node.y - minY + padding));
          text.setAttribute("text-anchor", "middle");
          text.setAttribute("dominant-baseline", "central");
          text.setAttribute("fill", "#ffffff");
          text.setAttribute("font-size", "14");
          text.setAttribute("font-family", "Arial, sans-serif");
          text.textContent = node.label;
          svg.appendChild(text);
        });

        containerRef.value.innerHTML = "";
        containerRef.value.appendChild(svg);
      } catch (error: any) {
        containerRef.value.innerHTML = "";
        errorMessage.value = error?.message || "Dagre 图渲染失败";
      } finally {
        updateRenderingCanvas();
      }
    }

    onMounted(() => {
      nextTick(renderDagreGraph);
    });

    watch(
      [nodes, edges, rankdir],
      () => {
        nextTick(renderDagreGraph);
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
                        .canvas-dagre-graph-child__error {
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
              <div class="canvas-dagre-graph-child__error">
                {errorMessage.value}
              </div>
            ) : (
              <div
                ref={containerRef}
                class="canvas-dagre-graph-child"
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
