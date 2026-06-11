import { registerOperation } from "../registry";

registerOperation({
  id: "element.duplicate",
  name: "复制元素",
  description:
    "复制元素创建副本，自动偏移避免重叠。返回新元素 ID，可用 element.setStyle 进一步调整。适合批量创建相似元素。",
  group: "元素",
  params: [
    {
      name: "id",
      label: "元素 ID",
      type: "string",
      required: true,
      placeholder: "要复制的元素 ID",
      description: "源元素的唯一标识符",
    },
    {
      name: "offsetX",
      label: "X 偏移",
      type: "number",
      default: 20,
      description: "副本相对于源元素的 X 偏移量（px）",
    },
    {
      name: "offsetY",
      label: "Y 偏移",
      type: "number",
      default: 20,
      description: "副本相对于源元素的 Y 偏移量（px）",
    },
  ],
  execute(params, ctx) {
    const { id, offsetX = 20, offsetY = 20 } = params;
    const child = ctx.findChildById(id);
    if (!child) {
      return { success: false, message: `未找到 ID 为 ${id} 的元素` };
    }

    // 获取源元素的所有属性
    const sourceProps: Record<string, any> = {};
    for (const key of Object.keys(child)) {
      if (key !== "id" && child[key] !== undefined) {
        sourceProps[key] = child[key];
      }
    }

    // 创建副本
    const newId = ctx.addCanvasChild(child.type, sourceProps);

    // 应用偏移
    if (newId && (offsetX !== 0 || offsetY !== 0)) {
      const newChild = ctx.findChildById(newId);
      if (newChild?.position) {
        const currentLeft =
          typeof newChild.position.left === "object"
            ? newChild.position.left.value
            : newChild.position.left || 0;
        const currentTop =
          typeof newChild.position.top === "object"
            ? newChild.position.top.value
            : newChild.position.top || 0;

        ctx.setChildProperty(newId, "position.left", {
          value: currentLeft + offsetX,
          unit: "px",
        });
        ctx.setChildProperty(newId, "position.top", {
          value: currentTop + offsetY,
          unit: "px",
        });
        // 取消居中，因为使用了绝对位置
        ctx.setChildProperty(newId, "position.center", false);
        ctx.setChildProperty(newId, "position.horizontalCenter", false);
        ctx.setChildProperty(newId, "position.verticalCenter", false);
      }
    }

    return {
      success: true,
      message: `已复制元素 (${id})，新元素 ID: ${newId}，偏移 (${offsetX}, ${offsetY})px。用 element.setStyle 可进一步调整新元素。`,
      data: { sourceId: id, newId, offsetX, offsetY },
    };
  },
});
