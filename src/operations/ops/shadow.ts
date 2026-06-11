import { registerOperation } from "../registry";

registerOperation({
  id: "element.setShadow",
  name: "设置阴影",
  description: [
    "设置元素的投影效果，增加层次感和立体感。",
    "【推荐预设】",
    "柔和阴影: offsetX=0, offsetY=4, blur=12, color=#0000001a",
    "中等阴影: offsetX=0, offsetY=8, blur=24, color=#00000026",
    "强烈阴影: offsetX=0, offsetY=16, blur=48, color=#00000033",
    "彩色阴影: offsetX=0, offsetY=8, blur=24, color=主色的半透明版",
    "【提示】偏移(0,0)会产生均匀发光效果，适合按钮和卡片。",
  ].join(" "),
  group: "样式",
  params: [
    {
      name: "id",
      label: "元素 ID",
      type: "string",
      required: true,
      placeholder: "元素 ID",
      description: "目标元素 ID，通过 canvas.getState 获取",
    },
    {
      name: "offsetX",
      label: "X 偏移",
      type: "number",
      required: true,
      default: 0,
      placeholder: "0",
      description: "水平偏移（px），0=正下方，正数=向右",
    },
    {
      name: "offsetY",
      label: "Y 偏移",
      type: "number",
      required: true,
      default: 4,
      placeholder: "4",
      description: "垂直偏移（px），正数=向下，推荐 4-16",
    },
    {
      name: "blur",
      label: "模糊半径",
      type: "number",
      default: 12,
      min: 0,
      max: 100,
      description: "模糊半径（px），越大越柔和。推荐 8-32",
    },
    {
      name: "spread",
      label: "扩展半径",
      type: "number",
      default: 0,
      min: -100,
      max: 100,
      description: "扩展半径（px），正数扩大阴影，负数缩小。通常保持 0",
    },
    {
      name: "color",
      label: "阴影颜色",
      type: "color",
      default: "#0000001a",
      description: "阴影颜色，推荐低透明度黑色（如 #0000001a ~ #00000033）",
    },
  ],
  execute(params, ctx) {
    const {
      id,
      offsetX,
      offsetY,
      blur = 8,
      spread = 0,
      color = "#00000066",
    } = params;
    const child = ctx.findChildById(id);
    if (!child) {
      return { success: false, message: `未找到 ID 为 ${id} 的元素` };
    }

    ctx.setChildProperty(id, "shadow", {
      offsetX,
      offsetY,
      blur,
      spread,
      color,
    });

    const childType = child.type || "unknown";
    return {
      success: true,
      message: `已设置 ${childType} 元素 (${id}) 阴影: ${offsetX}px ${offsetY}px ${blur}px ${color}`,
      data: { id, type: childType, offsetX, offsetY, blur, spread, color },
    };
  },
});

registerOperation({
  id: "element.removeShadow",
  name: "移除阴影",
  description: "移除元素的阴影效果",
  group: "样式",
  params: [
    {
      name: "id",
      label: "元素 ID",
      type: "string",
      required: true,
      placeholder: "元素 ID",
      description: "目标元素的唯一标识符",
    },
  ],
  execute(params, ctx) {
    const { id } = params;
    const child = ctx.findChildById(id);
    if (!child) {
      return { success: false, message: `未找到 ID 为 ${id} 的元素` };
    }

    ctx.setChildProperty(id, "shadow", null);

    return {
      success: true,
      message: `已移除元素 ${id} 的阴影效果`,
      data: { id },
    };
  },
});
