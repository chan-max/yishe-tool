import {
  defineComponent,
  computed,
  ref,
  onMounted,
  watch,
  PropType,
} from "vue";
import * as d3 from "d3-sankey";
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

export const createDefaultCanvasChildD3SankeyOptions = () => {
  const canvasUnit = canvasStickerOptionsOnlyChild.value.width.unit;

  return {
    type: "d3Sankey",
    nodes: [
      { id: "A", name: "Node A" },
      { id: "B", name: "Node B" },
      { id: "C", name: "Node C" },
    ],
    links: [
      { source: "A", target: "B", value: 10 },
      { source: "A", target: "C", value: 5 },
    ],
    nodeWidth: 20,
    nodePadding: 10,
    backgroundColor: { type: "pure", color: "#ffffff" },
    width: { value: 100, unit: "vw" },
    height: { value: 100, unit: "vh" },
    position: createPositionDefaultOptions(canvasUnit),
    filter: createFilterDefaultOptions(canvasUnit),
    zIndex: 0,
    ...createBasicDefaultOptions(),
    transform: createTransformDefaultOptions(canvasUnit),
  };
};

export function createCanvasChildD3Sankey(options: any) {
  return (
    <D3SankeyChild
      options={options}
      onVnodeUpdated={updateRenderingCanvas}
      onVnodeMounted={updateRenderingCanvas}
    />
  );
}

export const D3SankeyChild = defineComponent({
  props: {
    options: null,
  },
  setup(props) {
    const svgRef = ref<SVGSVGElement>();

    onCanvasChildSetup({
      targetEl: svgRef,
      options: props.options,
      props,
    });

    function renderSankey() {
      if (!svgRef.value) return;

      const svg = svgRef.value;
      const nodes = props.options?.nodes || [];
      const links = props.options?.links || [];
      const nodeWidth = props.options?.nodeWidth || 20;
      const nodePadding = props.options?.nodePadding || 10;

      if (!nodes.length || !links.length) {
        svg.innerHTML = "";
        return;
      }

      const nodeMap = new Map<string, number>();
      nodes.forEach((node: any, index: number) => {
        nodeMap.set(node.id, index);
      });

      const sankeyNodes = nodes.map((node: any, index: number) => ({
        ...node,
        index,
      }));

      const sankeyLinks = links
        .filter(
          (link: any) => nodeMap.has(link.source) && nodeMap.has(link.target),
        )
        .map((link: any) => ({
          source: nodeMap.get(link.source)!,
          target: nodeMap.get(link.target)!,
          value: link.value,
        }));

      const width = 600;
      const height = 400;
      const margin = { top: 20, right: 20, bottom: 20, left: 20 };
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      const colors = [
        "#4f99cf",
        "#e8814c",
        "#7cc270",
        "#c45baa",
        "#9a9a9a",
        "#d4a843",
        "#5ca4d4",
        "#e06060",
      ];

      try {
        const sankeyGenerator = d3
          .sankey()
          .nodeId((d: any) => d.index)
          .nodeWidth(nodeWidth)
          .nodePadding(nodePadding)
          .extent([
            [margin.left, margin.top],
            [margin.left + innerWidth, margin.top + innerHeight],
          ]);

        const { nodes: layoutNodes, links: layoutLinks } = sankeyGenerator({
          nodes: sankeyNodes.map((d: any) => ({ ...d })),
          links: sankeyLinks.map((d: any) => ({ ...d })),
        } as any);

        const linkPathGenerator = d3.sankeyLinkHorizontal();

        svg.innerHTML = "";

        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        svg.appendChild(g);

        (layoutLinks as any).forEach((link: any) => {
          const path = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path",
          );
          path.setAttribute("d", linkPathGenerator(link) || "");
          path.setAttribute("fill", "none");
          path.setAttribute("stroke", "#aaa");
          path.setAttribute("stroke-opacity", "0.4");
          path.setAttribute("stroke-width", Math.max(1, link.width).toString());
          g.appendChild(path);
        });

        (layoutNodes as any).forEach((node: any, index: number) => {
          const rect = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "rect",
          );
          rect.setAttribute("x", node.x0.toString());
          rect.setAttribute("y", node.y0.toString());
          rect.setAttribute("width", (node.x1 - node.x0).toString());
          rect.setAttribute("height", (node.y1 - node.y0).toString());
          rect.setAttribute("fill", colors[index % colors.length]);
          rect.setAttribute("rx", "3");
          rect.setAttribute("ry", "3");
          g.appendChild(rect);

          const text = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text",
          );
          text.setAttribute("x", (node.x0 - 6).toString());
          text.setAttribute("y", ((node.y0 + node.y1) / 2).toString());
          text.setAttribute("dy", "0.35em");
          text.setAttribute("text-anchor", "end");
          text.setAttribute("fill", "#333");
          text.setAttribute("font-size", "12");
          text.textContent = node.name;
          g.appendChild(text);

          if (text.getBBox().x < margin.left) {
            text.setAttribute("x", (node.x1 + 6).toString());
            text.setAttribute("text-anchor", "start");
          }
        });

        updateRenderingCanvas();
      } catch (e) {
        console.error("Sankey render error:", e);
      }
    }

    onMounted(renderSankey);
    watch(() => [props.options?.nodes, props.options?.links], renderSankey, {
      deep: true,
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
        ..._style,
      };

      onBeforeReturnRender({ style, options: props.options });

      return (
        <div style={containerStyle}>
          <div style={style}>
            <svg
              ref={svgRef}
              width="100%"
              height="100%"
              viewBox="0 0 600 400"
              preserveAspectRatio="xMidYMid meet"
            />
          </div>
        </div>
      );
    };
  },
});
