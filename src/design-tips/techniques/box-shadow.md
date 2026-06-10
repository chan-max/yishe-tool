---
title: box-shadow 阴影技巧
triggers: 阴影, box-shadow, 投影, 内阴影, inset, 发光, 立体, 深度
priority: core
---

### 基本语法
box-shadow: X偏移 Y偏移 模糊半径 扩展半径 颜色;

### 外阴影（凸起感）
box-shadow: 0 4px 12px rgba(0,0,0,0.1);        /* 轻微投影 */
box-shadow: 0 8px 24px rgba(0,0,0,0.15);       /* 明显投影 */
box-shadow: 0 2px 4px rgba(0,0,0,0.08);        /* 贴地投影 */

### 多层阴影（更自然）
box-shadow:
  0 1px 2px rgba(0,0,0,0.06),
  0 4px 12px rgba(0,0,0,0.08),
  0 12px 32px rgba(0,0,0,0.04);

### 内阴影（凹陷感）
box-shadow: inset 0 2px 8px rgba(0,0,0,0.15);

### 彩色阴影（配合按钮/卡片主色）
box-shadow: 0 8px 24px rgba(102,126,234,0.4);  /* 紫色按钮 */

### 边框模拟（比 border 更灵活）
box-shadow: 0 0 0 2px #667eea;                 /* 2px 实线"边框" */
box-shadow: 0 0 0 2px #667eea, 0 0 0 4px #764ba2; /* 双层边框 */

### 使用技巧
- 多层阴影比单层更真实：近层小模糊 + 远层大模糊
- 不要用纯黑 rgba(0,0,0,x)，用深灰效果更好
- 彩色阴影的 rgba 色相和元素主色一致，透明度 0.3-0.5
- inset 关键字放最前面 = 内阴影
- box-shadow 不影响布局（不占空间），border 会
- 用 box-shadow 模拟 border 时不会影响 box-sizing
