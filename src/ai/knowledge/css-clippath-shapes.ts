import type { KnowledgeItem } from "./types";

export const clippathShapesKnowledge: KnowledgeItem = {
  triggers: [
    "裁剪", "形状", "clip-path", "三角", "梯形", "菱形",
    "六边形", "星形", "箭头", "不规则", "shape",
  ],
  priority: "optional",
  category: "css-shapes",
  tokens: 300,
  content: `## clip-path 形状

### 三角形
clip-path:polygon(50% 0%,0% 100%,100% 100%);
→ 配合 background 渐变效果好

### 菱形
clip-path:polygon(50% 0%,100% 50%,50% 100%,0% 50%);

### 六边形
clip-path:polygon(25% 0%,75% 0%,100% 50%,75% 100%,25% 100%,0% 50%);

### 五角星
clip-path:polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%);

### 箭头（向右）
clip-path:polygon(0% 0%,70% 0%,100% 50%,70% 100%,0% 100%);

### 对角切割
clip-path:polygon(0% 0%,100% 0%,100% 85%,0% 100%);
→ 底部斜边效果，适合 Hero 区域

### 波浪形（用 border-radius 模拟）
border-radius:0 0 50% 50% / 0 0 10% 10%;
→ 底部圆弧

### 使用技巧
- clip-path 裁剪的是元素本身，不是子元素
- 配合 background:linear-gradient 做彩色形状
- 图片也能裁剪：clip-path + object-fit:cover
- 形状内部的文字不受影响，需要单独处理文字位置`,
};
