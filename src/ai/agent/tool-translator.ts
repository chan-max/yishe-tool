import type { OperationResult } from "@/operations";

/**
 * Translate tool execution results into LLM-friendly descriptions.
 */
export function translateToolResult(
  toolName: string,
  args: any,
  result: OperationResult,
): string {
  if (!result.success) {
    return `❌ ${toolName} 失败: ${result.message}。请检查参数或尝试其他方案。`;
  }

  switch (toolName) {
    case "canvas.addChild": {
      const type = args?.type || "元素";
      const id = result.data || "未知";
      const shortId = typeof id === "string" ? id.slice(0, 12) : id;
      return `✅ 已添加 ${type} 元素 (id: ${shortId})`;
    }
    case "canvas.addHtml": {
      const data = result.data || {};
      const action = data.replaced ? "已更新" : "已创建";
      return `✅ ${action} HTML 设计 (id: ${(data.id || "").slice(0, 12)})，画布共 ${data.totalElements || 0} 个元素`;
    }
    case "canvas.addDiagram": {
      const data = result.data || {};
      return `✅ 已创建 ${data.type || "图表"} (id: ${(data.id || "").slice(0, 12)})`;
    }
    case "canvas.addChart": {
      const data = result.data || {};
      return `✅ 已创建 ${data.type || "图表"} (id: ${(data.id || "").slice(0, 12)})`;
    }
    case "canvas.clear":
      return "✅ 画布已清空，可以开始新设计";
    case "canvas.smartSize":
    case "canvas.setSize":
    case "canvas.setSizeByPreset":
      return `✅ 画布尺寸已设置: ${args?.width || "?"}x${args?.height || "?"}`;
    case "canvas.setBackgroundColor":
      return `✅ 背景色已设置: ${args?.color || "未知"}`;
    case "element.setStyle": {
      const changed = Object.keys(args || {}).filter((k) => k !== "id");
      return `✅ 已更新样式: ${changed.join(", ")}`;
    }
    case "element.setTextContent":
      return `✅ 文字已更新: "${(args?.textContent || "").slice(0, 20)}"`;
    case "resource.searchSticker": {
      const items = (result.data as any[]) || [];
      if (items.length === 0) return "⚠️ 未找到相关贴纸素材，建议换个关键词";
      const first = items[0];
      const list = items
        .slice(0, 5)
        .map(
          (d: any, i: number) =>
            `${i + 1}. ${d.name || "未命名"} | ${d.width}x${d.height}${d.isCutout ? " | 抠图" : ""}${d.colorPalette ? " | 色:" + d.colorPalette.split(",").slice(0, 3).join(" ") : ""}`,
        )
        .join("\n");
      const bindingsExample = `canvas.addHtml({ htmlContent: "<div style='background-image:url({{image.bg.url}});background-size:cover;width:100%;height:100%;'></div>", htmlBindings: { image: { bg: { id:"${first.id}", url:"${first.url}", name:"${first.name}" } } } })`;
      return `✅ 找到 ${items.length} 个贴纸素材:\n${list}\n\n用法（复制后替换 key 名 "bg" 即可）:\n${bindingsExample}`;
    }
    case "resource.searchFont": {
      const items = (result.data as any[]) || [];
      if (items.length === 0) return "⚠️ 未找到相关字体，建议换个关键词";
      const first = items[0];
      const list = items
        .slice(0, 5)
        .map(
          (d: any, i: number) =>
            `${i + 1}. ${d.name || "未命名"}${d.category ? " [" + d.category + "]" : ""}${d.keywords ? " " + d.keywords : ""}`,
        )
        .join("\n");
      const bindingsExample = `canvas.addHtml({ htmlContent: "<div style='font-family:{{font.brand.family}};...'>文字</div>", htmlBindings: { font: { brand: { id:"${first.id}", url:"${first.url}", name:"${first.name}" } } } })`;
      return `✅ 找到 ${items.length} 个字体:\n${list}\n\n用法（复制后替换 key 名 "brand" 即可）:\n${bindingsExample}`;
    }
    case "resource.searchSentence": {
      const items = (result.data as any[]) || [];
      if (items.length === 0) return "⚠️ 未找到相关文案，建议换个关键词";
      const list = items
        .slice(0, 5)
        .map(
          (d: any, i: number) =>
            `${i + 1}. "${d.content}"${d.description ? " | 说明: " + d.description : ""}`,
        )
        .join("\n");
      return `✅ 找到 ${items.length} 条文案，你可以将以下合适文案直接用到设计的文字元素中:\n${list}`;
    }
    case "resource.searchTextDocument": {
      const items = (result.data as any[]) || [];
      if (items.length === 0) return "⚠️ 未找到相关文档，建议换个关键词";
      const list = items
        .slice(0, 5)
        .map(
          (d: any, i: number) =>
            `${i + 1}. 【${d.title}】 (分类: ${d.category || "无"})\n摘要: ${d.summary || "无"}\n内容: ${d.content.slice(0, 100)}...`,
        )
        .join("\n\n");
      return `✅ 找到 ${items.length} 篇文档，可作为设计的文案与背景参考数据源:\n${list}`;
    }
    case "canvas.remove":
      return "✅ 元素已删除";
    case "canvas.updateAndSaveSticker":
      return "✅ 贴纸已保存到图库";
    case "canvas.analyze":
      return `✅ 设计分析完成: ${result.message || ""}`;
    default:
      return `✅ ${toolName} 执行成功${result.message ? ": " + result.message : ""}`;
  }
}
