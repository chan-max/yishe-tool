import { registerOperation } from "../registry";

registerOperation({
  id: "element.bringToFront",
  name: "移到最前",
  description:
    "将元素移到最前层（最高 zIndex）。层级约定：背景=0，装饰=1-5，内容=10-15，标题=20。",
  group: "图层",
  params: [
    {
      name: "id",
      label: "元素 ID",
      type: "string",
      required: true,
      placeholder: "元素 ID",
      description: "要移动的元素 ID",
    },
  ],
  execute(params, ctx) {
    const { id } = params;
    const child = ctx.findChildById(id);
    if (!child) {
      return { success: false, message: `未找到 ID 为 ${id} 的元素` };
    }

    // 获取所有元素的最大 zIndex
    const children = ctx.getCanvasChildren();
    const maxZIndex = Math.max(
      ...children
        .filter((c: any) => c.type !== "canvas" && c.id !== id)
        .map((c: any) => c.zIndex || 0),
      0,
    );

    ctx.setChildProperty(id, "zIndex", maxZIndex + 1);
    return {
      success: true,
      message: `已将元素 ${id} 移到最前（zIndex: ${maxZIndex + 1}）`,
      data: { id, zIndex: maxZIndex + 1 },
    };
  },
});

registerOperation({
  id: "element.sendToBack",
  name: "移到最后",
  description:
    "将元素移到最后层（最低 zIndex）。层级约定：背景=0，装饰=1-5，内容=10-15，标题=20。",
  group: "图层",
  params: [
    {
      name: "id",
      label: "元素 ID",
      type: "string",
      required: true,
      placeholder: "元素 ID",
      description: "要移动的元素 ID",
    },
  ],
  execute(params, ctx) {
    const { id } = params;
    const child = ctx.findChildById(id);
    if (!child) {
      return { success: false, message: `未找到 ID 为 ${id} 的元素` };
    }

    // 获取所有元素的最小 zIndex
    const children = ctx.getCanvasChildren();
    const minZIndex = Math.min(
      ...children
        .filter((c: any) => c.type !== "canvas" && c.id !== id)
        .map((c: any) => c.zIndex || 0),
      0,
    );

    // 如果最小 zIndex 是 0，则设为 -1，否则设为最小值 - 1
    const newZIndex = minZIndex <= 0 ? minZIndex - 1 : 0;
    ctx.setChildProperty(id, "zIndex", newZIndex);

    return {
      success: true,
      message: `已将元素 ${id} 移到最后（zIndex: ${newZIndex}）`,
      data: { id, zIndex: newZIndex },
    };
  },
});

registerOperation({
  id: "element.bringForward",
  name: "上移一层",
  description: "将指定元素上移一层",
  group: "图层",
  params: [
    {
      name: "id",
      label: "元素 ID",
      type: "string",
      required: true,
      placeholder: "元素 ID",
      description: "要移动的元素 ID",
    },
  ],
  execute(params, ctx) {
    const { id } = params;
    const child = ctx.findChildById(id);
    if (!child) {
      return { success: false, message: `未找到 ID 为 ${id} 的元素` };
    }

    const currentZIndex = child.zIndex || 0;
    ctx.setChildProperty(id, "zIndex", currentZIndex + 1);

    return {
      success: true,
      message: `已将元素 ${id} 上移一层（zIndex: ${currentZIndex + 1}）`,
      data: { id, zIndex: currentZIndex + 1 },
    };
  },
});

registerOperation({
  id: "element.sendBackward",
  name: "下移一层",
  description: "将指定元素下移一层",
  group: "图层",
  params: [
    {
      name: "id",
      label: "元素 ID",
      type: "string",
      required: true,
      placeholder: "元素 ID",
      description: "要移动的元素 ID",
    },
  ],
  execute(params, ctx) {
    const { id } = params;
    const child = ctx.findChildById(id);
    if (!child) {
      return { success: false, message: `未找到 ID 为 ${id} 的元素` };
    }

    const currentZIndex = child.zIndex || 0;
    ctx.setChildProperty(id, "zIndex", currentZIndex - 1);

    return {
      success: true,
      message: `已将元素 ${id} 下移一层（zIndex: ${currentZIndex - 1}）`,
      data: { id, zIndex: currentZIndex - 1 },
    };
  },
});
