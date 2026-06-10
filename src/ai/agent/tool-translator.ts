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
    case "resource.searchImage": {
      const items = (result.data as any[]) || [];
      if (items.length === 0) return "⚠️ 未找到相关图片素材，建议换个关键词";
      const list = items
        .slice(0, 5)
        .map(
          (d: any, i: number) =>
            `${i + 1}. ${d.name || "未命名"} | id:${d.id} | url:${d.url}`,
        )
        .join("\n");
      return `✅ 找到 ${items.length} 个图片素材（用 url 配合 canvas.addImage 或 htmlBindings 使用）:\n${list}`;
    }
    case "resource.searchFont": {
      const items = (result.data as any[]) || [];
      if (items.length === 0) return "⚠️ 未找到相关字体，建议换个关键词";
      const list = items
        .slice(0, 5)
        .map(
          (d: any, i: number) =>
            `${i + 1}. ${d.name || "未命名"} | id:${d.id} | url:${d.url}`,
        )
        .join("\n");
      return `✅ 找到 ${items.length} 个相关字体（用 url 配合 htmlBindings 绑定字体）:\n${list}`;
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
