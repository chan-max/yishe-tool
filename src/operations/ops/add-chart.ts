import { registerOperation } from "../registry";

registerOperation({
  id: "canvas.addChart",
  name: "创建数据图表",
  description: "创建柱状图、折线图、饼图、雷达图等数据可视化图表。",
  group: "画布",
  params: [
    {
      name: "chartType",
      label: "图表类型",
      type: "select",
      required: true,
      options: [
        { label: "ECharts (推荐)", value: "echart" },
        { label: "Chart.js", value: "chartjs" },
        { label: "Plotly", value: "plotlyChart" },
        { label: "ApexCharts", value: "apexChart" },
        { label: "Vega-Lite", value: "vegaLite" },
        { label: "Frappe Charts", value: "frappeChart" },
      ],
      description: "推荐 ECharts，功能最全",
    },
    {
      name: "data",
      label: "数据 JSON",
      type: "string",
      required: true,
      placeholder: '{"labels":["A","B"],"datasets":[{"values":[30,70]}]}',
      description: [
        "图表数据，JSON 格式：",
        "- ECharts: { xAxis: { data: [...] }, series: [{ data: [...] }] }",
        "- Chart.js: { labels: [...], datasets: [{ data: [...] }] }",
        "- Plotly: [{ x: [...], y: [...], type: 'bar' }]",
      ].join("\n"),
    },
    {
      name: "config",
      label: "配置 JSON",
      type: "string",
      placeholder: '{"title":{"text":"标题"}}',
      description: "图表配置项（可选），如标题、颜色、图例等",
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
    const { chartType, data, config, width, height } = params;
    const options: Record<string, any> = {};

    try {
      options.data = JSON.parse(data);
    } catch {
      return { success: false, message: "数据 JSON 格式错误，请检查语法" };
    }

    if (config) {
      try {
        const parsedConfig = JSON.parse(config);
        // ECharts 的配置和数据合并
        if (chartType === "echart") {
          Object.assign(options, parsedConfig);
        } else {
          options.config = parsedConfig;
        }
      } catch {
        return { success: false, message: "配置 JSON 格式错误，请检查语法" };
      }
    }

    if (chartType === "chartjs") {
      options.chartType = "bar"; // 默认柱状图，可通过 config 覆盖
    }

    if (width !== undefined) options.width = { value: width, unit: "px" };
    if (height !== undefined) options.height = { value: height, unit: "px" };

    const id = ctx.addCanvasChild(chartType, options);
    return {
      success: true,
      message: `已创建 ${chartType} 图表 (id: ${id})`,
      data: { id, type: chartType },
    };
  },
});
