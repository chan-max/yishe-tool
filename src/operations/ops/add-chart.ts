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
      placeholder: '{"title":{"text":"图表标题"},"xAxis":{...},"series":[...]}',
      description: [
        "图表配置项，JSON 格式。",
        "ECharts 推荐直接在 config 中传完整的 ECharts option（包含 title/xAxis/yAxis/series 等），data 会合并到 config 中。",
        "示例：{\"title\":{\"text\":\"销量\"},\"xAxis\":{\"type\":\"category\",\"data\":[\"A\",\"B\"]},\"series\":[{\"type\":\"bar\",\"data\":[10,20]}]}",
      ].join("\n"),
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

    // ECharts：需要把 option 写到 echart.engines.echarts.option
    if (chartType === "echart") {
      let echartOption: Record<string, any> = {};

      // config 是完整的 ECharts option（优先）
      if (config) {
        try {
          echartOption = JSON.parse(config);
        } catch {
          return { success: false, message: "配置 JSON 格式错误，请检查语法" };
        }
      }

      // data 是补充数据，合并到 option 里
      if (data) {
        try {
          const parsedData = JSON.parse(data);
          echartOption = { ...parsedData, ...echartOption };
        } catch {
          return { success: false, message: "数据 JSON 格式错误，请检查语法" };
        }
      }

      // 写到正确路径
      options.echart = {
        version: 1,
        engine: "echarts",
        engines: {
          echarts: {
            renderer: "canvas",
            theme: "",
            option: echartOption,
          },
        },
      };
    } else {
      // 非 ECharts 图表
      if (data) {
        try {
          options.data = JSON.parse(data);
        } catch {
          return { success: false, message: "数据 JSON 格式错误，请检查语法" };
        }
      }
      if (config) {
        try {
          const parsedConfig = JSON.parse(config);
          // 每种图表组件读取配置的路径不同
          if (chartType === "chartjs") {
            options.options = parsedConfig;  // Chart.js 组件读 props.options.options
          } else if (chartType === "plotlyChart") {
            options.layout = parsedConfig;   // Plotly 组件读 props.options.layout
          } else {
            options.config = parsedConfig;
          }
        } catch {
          return { success: false, message: "配置 JSON 格式错误，请检查语法" };
        }
      }
      if (chartType === "chartjs") {
        options.chartType = "bar";
      }
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
