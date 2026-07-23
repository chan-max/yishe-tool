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
    if (toolName === "canvas.loadFont") {
      return `❌ 字体预加载失败: ${result.message}。如果 resource.searchFont 已返回 id/url/name，不要重复调用 canvas.loadFont；直接通过 canvas.addHtml 的 htmlBindings.font 绑定该搜索结果。`;
    }
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
    case "canvas.setSizeByPreset": {
      const data = (result.data || {}) as any;
      const scale = data.typeScale || {};
      return `✅ 画布尺寸已设置: ${data.width || args?.width || "?"}x${data.height || args?.height || "?"}，基础字号 ${data.baseFontSize || "?"}px（${data.typographyDensityLabel || "标准排版"}）。HTML 已自动提供字号变量：主视觉 ${scale.hero || "--type-hero"}、主标题 ${scale.title || "--type-title"}、核心文字 ${scale.primaryText || "--type-primary"}、副标题 ${scale.subtitle || "--type-subtitle"}、正文 ${scale.body || "--type-body"}、说明 ${scale.caption || "--type-caption"}；直接使用 var(--type-xxx)，不要重新定义或改回 px/rem/vw。`;
    }
    case "canvas.setBaseFontSize": {
      const data = (result.data || {}) as any;
      const scale = data.typeScale || {};
      return `✅ 画布基础字号已设置为 ${data.baseFontSize || "?"}px。HTML 自动字号变量已同步：主视觉 ${scale.hero || "--type-hero"}、主标题 ${scale.title || "--type-title"}、核心文字 ${scale.primaryText || "--type-primary"}、正文 ${scale.body || "--type-body"}、说明 ${scale.caption || "--type-caption"}。`;
    }
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
      if (items.length === 0) {
        return `⚠️ 素材库没有找到可用结果。系统已经自动完成放宽过滤和简化关键词，不要连续重复搜索；请改用 SVG/CSS 绘制，或如实说明没有采用外部素材。${result.message ? `\n${result.message}` : ""}`;
      }
      const list = items
        .slice(0, 5)
        .map(
          (d: any, i: number) =>
            `${i + 1}. ${d.name || "未命名"} | id:${d.id} | url:${d.url} | ${d.width}x${d.height}${d.isCutout ? " | 抠图" : ""}${d.colorPalette ? " | 色:" + d.colorPalette.split(",").slice(0, 3).join(" ") : ""}`,
        )
        .join("\n");
      return `✅ 找到 ${items.length} 个图片/贴纸候选。先检查主题、配色、背景类型和清晰度；只有兼容当前设计时才使用，禁止通过低透明度或隐藏来凑数。\n${list}\n\n如使用某项，请放入 canvas.addHtml 的 htmlBindings.image，并用 {{image.xxx.url}} 引用。`;
    }
    case "resource.searchFont": {
      const items = (result.data as any[]) || [];
      if (items.length === 0) return "⚠️ 未找到相关字体，建议换个关键词";
      const list = items
        .slice(0, 5)
        .map(
          (d: any, i: number) =>
            `${i + 1}. ${d.name || "未命名"}${d.category ? " [" + d.category + "]" : ""} | id:${d.id} | url:${d.url}${d.keywords ? " | " + d.keywords : ""}`,
        )
        .join("\n");
      return `✅ 找到 ${items.length} 个字体候选。请选择合适字体；不合适可以换关键词继续搜索。\n${list}\n\n如使用某项，请放入 canvas.addHtml 的 htmlBindings.font，并用 {{font.xxx.family}} 引用。`;
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
      return `✅ 找到 ${items.length} 条文案候选，可选择合适内容使用，也可只作为风格参考:\n${list}`;
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
    case "canvas.updateAndSaveSticker": {
      const stickerId = String(result.data?.stickerId || "").trim();
      return stickerId
        ? `✅ 贴纸已保存到图库，stickerId: ${stickerId}。制作组图时必须保留这个 ID，并按图片顺序传给 material.createImageGroup。`
        : "✅ 贴纸已保存到图库";
    }
    case "material.createImageGroup": {
      const data = result.data || {};
      return `✅ 组图已创建，groupId: ${data.groupId || "未知"}，共 ${data.stickersCount || 0} 张。`;
    }
    case "canvas.analyze":
      return `✅ 设计分析完成: ${result.message || ""}`;
    default:
      return `✅ ${toolName} 执行成功${result.message ? ": " + result.message : ""}`;
  }
}
