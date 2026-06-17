import { registerOperation } from "../registry";

registerOperation({
  id: "canvas.addDiagram",
  name: "创建图表/流程图",
  description: "创建流程图、思维导图、关系图、有向图。根据 diagramType 使用对应的 DSL 语法。",
  group: "画布",
  params: [
    {
      name: "diagramType",
      label: "图表类型",
      type: "select",
      required: true,
      options: [
        { label: "流程图 (Mermaid)", value: "mermaid" },
        { label: "图描述 (Graphviz DOT)", value: "graphviz" },
        { label: "思维导图 (Markmap)", value: "markmapChart" },
        { label: "有向图 (dagre)", value: "dagreGraph" },
      ],
      description: "图表类型决定使用哪种 DSL 语法",
    },
    {
      name: "source",
      label: "源码",
      type: "string",
      required: true,
      placeholder: "flowchart TD\n  A[开始] --> B[结束]",
      description: [
        "图表 DSL 源码：",
        "- Mermaid: flowchart TD\\n  A-->B",
        "- Graphviz: digraph { a -> b }",
        "- Markmap: # 主题\\n## 分支1\\n## 分支2",
        '- dagre: 用 nodes/edges 参数代替',
      ].join("\n"),
    },
    {
      name: "theme",
      label: "主题",
      type: "select",
      default: "default",
      options: [
        { label: "Default", value: "default" },
        { label: "Dark", value: "dark" },
        { label: "Forest", value: "forest" },
        { label: "Neutral", value: "neutral" },
      ],
      description: "仅 Mermaid 有效",
    },
    {
      name: "nodes",
      label: "节点",
      type: "string",
      placeholder: '[{"id":"a","label":"A"}]',
      description: "仅 dagreGraph 有效，JSON 数组",
    },
    {
      name: "edges",
      label: "边",
      type: "string",
      placeholder: '[{"from":"a","to":"b"}]',
      description: "仅 dagreGraph 有效，JSON 数组",
    },
    {
      name: "width",
      label: "宽度",
      type: "number",
      min: 100,
      max: 10000,
      description: "元素宽度（px）",
    },
    {
      name: "height",
      label: "高度",
      type: "number",
      min: 100,
      max: 10000,
      description: "元素高度（px）",
    },
  ],
  execute(params, ctx) {
    const { diagramType, source, theme, nodes, edges, width, height } = params;
    const options: Record<string, any> = {};

    if (diagramType === "mermaid") {
      options.source = source;
      if (theme && theme !== "default") {
        options.config = { theme, securityLevel: "strict", flowchart: { htmlLabels: true, curve: "basis" } };
      }
    } else if (diagramType === "graphviz") {
      options.dot = source;
    } else if (diagramType === "markmapChart") {
      options.markdown = source;
    } else if (diagramType === "dagreGraph") {
      try { options.nodes = JSON.parse(nodes || "[]"); } catch { return { success: false, message: "节点 JSON 格式错误" }; }
      try { options.edges = JSON.parse(edges || "[]"); } catch { return { success: false, message: "边 JSON 格式错误" }; }
    }

    if (width !== undefined) options.width = { value: width, unit: "px" };
    if (height !== undefined) options.height = { value: height, unit: "px" };

    const id = ctx.addCanvasChild(diagramType, options);
    return {
      success: true,
      message: `已创建 ${diagramType} 图表 (id: ${id})`,
      data: { id, type: diagramType },
    };
  },
});
