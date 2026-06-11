import { registerOperation } from "../registry";

registerOperation({
  id: "element.setStyle",
  name: "设置元素样式",
  description: [
    "修改已有元素的位置、大小、旋转、透明度、层级。",
    "用 canvas.getState 获取元素 id。",
    "【位置系统】",
    "- center:true 元素自动居中（忽略 left/top）",
    "- center:false + left/top 精确像素定位",
    "- 设置 left 或 top 会自动关闭 center",
    "【层级约定】背景 zIndex=0，装饰 1-5，内容 10-15，标题 20",
  ].join(" "),
  group: "样式",
  params: [
    {
      name: "id",
      label: "元素 ID",
      type: "string",
      required: true,
      placeholder: "canvas.addChild 返回的 id",
      description:
        "目标元素 ID，通过 canvas.getState 或 canvas.addChild 返回值获取",
    },
    {
      name: "left",
      label: "X 位置",
      type: "number",
      description: "元素左侧位置（px），设置后自动关闭水平居中",
    },
    {
      name: "top",
      label: "Y 位置",
      type: "number",
      description: "元素顶部位置（px），设置后自动关闭垂直居中",
    },
    {
      name: "width",
      label: "宽度",
      type: "number",
      min: 1,
      max: 10000,
      description: "元素宽度（px），HTML 元素默认填满画布，通常不需要手动设置",
    },
    {
      name: "height",
      label: "高度",
      type: "number",
      min: 1,
      max: 10000,
      description: "元素高度（px），HTML 元素默认填满画布，通常不需要手动设置",
    },
    {
      name: "rotateZ",
      label: "旋转角度",
      type: "number",
      min: -360,
      max: 360,
      description: "Z 轴旋转角度（度），如 -15 表示逆时针倾斜",
    },
    {
      name: "opacity",
      label: "透明度",
      type: "number",
      min: 0,
      max: 100,
      description: "透明度（0=完全透明，100=完全不透明），用于半透明叠加效果",
    },
    {
      name: "zIndex",
      label: "层级",
      type: "number",
      min: 0,
      max: 9999,
      description:
        "层级（数值越大越靠前）。约定：背景=0，装饰=1-5，内容=10-15，标题=20",
    },
    {
      name: "center",
      label: "居中",
      type: "boolean",
      description: "是否水平和垂直居中。设为 true 会忽略 left/top",
    },
  ],
  execute(params, ctx) {
    const { id, left, top, width, height, rotateZ, opacity, zIndex, center } =
      params;
    const child = ctx.findChildById(id);
    if (!child) {
      return { success: false, message: `未找到 ID 为 ${id} 的元素` };
    }

    const changes: string[] = [];

    if (left !== undefined && child.position) {
      ctx.setChildProperty(id, "position.left", { value: left, unit: "px" });
      ctx.setChildProperty(id, "position.center", false);
      ctx.setChildProperty(id, "position.horizontalCenter", false);
      changes.push(`X=${left}`);
    }

    if (top !== undefined && child.position) {
      ctx.setChildProperty(id, "position.top", { value: top, unit: "px" });
      ctx.setChildProperty(id, "position.center", false);
      ctx.setChildProperty(id, "position.verticalCenter", false);
      changes.push(`Y=${top}`);
    }

    if (width !== undefined && child.width) {
      if (typeof child.width === "object") {
        ctx.setChildProperty(id, "width", {
          value: width,
          unit: child.width.unit || "px",
        });
      } else {
        ctx.setChildProperty(id, "width", width);
      }
      changes.push(`宽=${width}`);
    }

    if (height !== undefined && child.height) {
      if (typeof child.height === "object") {
        ctx.setChildProperty(id, "height", {
          value: height,
          unit: child.height.unit || "px",
        });
      } else {
        ctx.setChildProperty(id, "height", height);
      }
      changes.push(`高=${height}`);
    }

    if (rotateZ !== undefined && child.transform) {
      ctx.setChildProperty(id, "transform.rotateZ", rotateZ);
      changes.push(`旋转=${rotateZ}°`);
    }

    if (opacity !== undefined && child.filter) {
      ctx.setChildProperty(id, "filter.filterOpacity", opacity);
      changes.push(`透明度=${opacity}%`);
    }

    if (zIndex !== undefined) {
      ctx.setChildProperty(id, "zIndex", zIndex);
      changes.push(`层级=${zIndex}`);
    }

    if (center !== undefined && child.position) {
      ctx.setChildProperty(id, "position.center", center);
      ctx.setChildProperty(id, "position.horizontalCenter", center);
      ctx.setChildProperty(id, "position.verticalCenter", center);
      changes.push(`居中=${center}`);
    }

    if (changes.length === 0) {
      return { success: false, message: "未指定任何要修改的样式属性" };
    }

    const childType = child.type || "unknown";
    return {
      success: true,
      message: `已更新 ${childType} 元素 (${id}) 样式: ${changes.join(", ")}`,
      data: { id, type: childType, changes },
    };
  },
});
