import type { KnowledgeItem } from "./types";

// ============================================
// 按子元素类型分类的技巧
// 当 AI 识别出要用哪个子元素时，自动加载对应技巧
// ============================================

export const customKnowledgeItems: KnowledgeItem[] = [
  // ===== HTML 元素技巧 =====
  {
    triggers: ["html", "背景", "卡片", "标题", "按钮", "文字", "装饰"],
    priority: "core",
    category: "html",
    tokens: 300,
    content: `## HTML 元素技巧

**居中布局：**
display:flex;align-items:center;justify-content:center;

**卡片阴影：**
box-shadow:0 4px 12px rgba(0,0,0,0.08);    // 轻微
box-shadow:0 16px 48px rgba(0,0,0,0.16);   // 强烈

**渐变方向：**
linear-gradient(135deg, #c1, #c2)    // 左上→右下
linear-gradient(to right, #c1, #c2)  // 左→右

**毛玻璃：**
backdrop-filter:blur(10px);background:rgba(255,255,255,0.6);

**文字截断：**
white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;

**禁止：** 纯黑 #000、纯白 #fff`,
  },

  // ===== 二维码技巧 =====
  {
    triggers: ["二维码", "qr", "qrcode"],
    priority: "core",
    category: "qrcode",
    tokens: 200,
    content: `## 二维码元素技巧

**尺寸建议：** 不小于 200x200，推荐 300x300 以上

**配色：**
深色前景 + 浅色背景，对比度要高
推荐：#000000 + #ffffff 或 #1a1a2e + #f5f5f5

**容错等级：**
L(7%) - 最小尺寸
M(15%) - 默认推荐
Q(25%) - 有遮挡风险时
H(30%) - 需要高容错

**位置：** 通常放在右下角或底部居中`,
  },

  // ===== 条形码技巧 =====
  {
    triggers: ["条形码", "barcode", "条码"],
    priority: "core",
    category: "barcode",
    tokens: 150,
    content: `## 条形码元素技巧

**尺寸建议：** 宽度不小于 300px，高度不小于 100px

**条码类型：**
CODE128 - 通用，支持字母数字
EAN13 - 商品条码（13位数字）
EAN8 - 小商品条码（8位数字）
UPC - 北美商品码

**配色：** 黑条白底最安全，避免彩色条码

**位置：** 通常放在底部，水平居中`,
  },

  // ===== 图片技巧 =====
  {
    triggers: ["图片", "image", "素材", "背景图"],
    priority: "core",
    category: "image",
    tokens: 180,
    content: `## 图片元素技巧

**填充方式：**
background-size:cover;     // 裁剪填满
background-size:contain;   // 完整显示
background-size:100% 100%; // 拉伸变形

**定位：**
background-position:center;        // 居中
background-position:top center;    // 顶部居中
background-position:bottom center; // 底部居中

**圆角图片：**
border-radius:50%;        // 正圆
border-radius:12px;       // 小圆角

**叠加文字：**
在图片上叠加半透明遮罩：background:rgba(0,0,0,0.4);`,
  },

  // ===== 图表技巧 =====
  {
    triggers: ["图表", "echart", "柱状图", "折线图", "饼图", "数据"],
    priority: "core",
    category: "echart",
    tokens: 200,
    content: `## 图表元素技巧

**图表类型选择：**
柱状图 - 对比数据
折线图 - 趋势变化
饼图 - 占比分布
散点图 - 相关性

**配色方案：**
单色系：#3498db 渐变到 #2980b9
多色系：#e74c3c #3498db #2ecc71 #f1c40f

**字体大小：**
标题 16-20px
坐标轴 12-14px
图例 12-14px

**动画：** 设计工具中建议关闭动画`,
  },

  // ===== 流程图技巧 =====
  {
    triggers: ["流程图", "mermaid", "思维导图", "架构图"],
    priority: "core",
    category: "mermaid",
    tokens: 150,
    content: `## 流程图元素技巧

**节点形状：**
[方形] - 正常步骤
(圆角) - 开始/结束
{菱形} - 判断
[[双边框]] - 子流程

**方向：**
TD - 从上到下
LR - 从左到右

**样式：**
简洁明了，节点文字不超过 10 字
连接线用实线，虚线表示可选`,
  },
];
