import type { KnowledgeItem } from "./types";

export const gridLayoutsKnowledge: KnowledgeItem = {
  triggers: [
    "网格", "grid", "多列", "多行", "九宫格", "瀑布流", "画廊",
    "gallery", "产品展示", "列表", "排列",
  ],
  priority: "important",
  category: "css-layouts",
  tokens: 400,
  content: `## CSS Grid 布局

### 双列等分
display:grid;grid-template-columns:1fr 1fr;gap:24px;width:100%;height:100%;padding:5%;box-sizing:border-box;

### 三列等分
display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px;width:100%;height:100%;padding:4%;box-sizing:border-box;

### 左窄右宽
display:grid;grid-template-columns:1fr 2fr;gap:30px;width:100%;height:100%;padding:5%;box-sizing:border-box;

### 2x2 网格
display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:20px;width:100%;height:100%;padding:5%;box-sizing:border-box;

### 不对称网格（特色布局）
display:grid;grid-template-columns:2fr 1fr;grid-template-rows:1fr 1fr;gap:20px;width:100%;height:100%;padding:5%;box-sizing:border-box;
第一个子元素占两行：grid-row:1/3;

### 产品展示网格（多列小卡片）
display:grid;grid-template-columns:repeat(3,1fr);gap:16px;width:100%;height:100%;padding:4%;box-sizing:border-box;
每个卡片：background:#fff;border-radius:12px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.06);

### 全宽 Hero + 下方三列
整体：display:flex;flex-direction:column;width:100%;height:100%;
Hero：height:50%;display:flex;align-items:center;justify-content:center;
下方：flex:1;display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px;padding:3%;box-sizing:border-box;

### Grid vs Flex 选择
- Grid：二维布局（行+列），适合网格、画廊、复杂页面
- Flex：一维布局（行或列），适合导航栏、按钮组、居中`,
};
