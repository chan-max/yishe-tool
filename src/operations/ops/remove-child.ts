import { registerOperation } from "../registry";

registerOperation({
  id: "canvas.removeChild",
  name: "删除元素",
  description:
    "删除指定元素。用 canvas.getState 获取元素 ID。不可撤销。清空全部元素请用 canvas.clear。",
  group: "画布",
  params: [
    {
      name: "id",
      label: "元素 ID",
      type: "string",
      required: true,
      placeholder: "输入要删除的元素 ID",
      description: '元素的唯一标识符，可通过"获取画布状态"查看',
    },
  ],
  execute(params, ctx) {
    const { id } = params;
    const child = ctx.findChildById(id);
    if (!child) {
      return { success: false, message: `未找到 ID 为 ${id} 的元素` };
    }
    ctx.removeCanvasChild(id);
    const childType = child.type || "unknown";
    const remaining = ctx
      .getCanvasChildren()
      .filter((c: any) => c.type !== "canvas").length;
    return {
      success: true,
      message: `已删除 ${childType} 元素 (${id})，画布剩余 ${remaining} 个元素`,
      data: { id, type: childType, remaining },
    };
  },
});
