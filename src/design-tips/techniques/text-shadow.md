---
title: text-shadow 文字阴影技巧
triggers: 文字阴影, text-shadow, 字体阴影, 文字发光, 文字投影
priority: core
---

### 基本语法
text-shadow: X偏移 Y偏移 模糊半径 颜色;

### 轻微投影（提升可读性）
text-shadow: 0 1px 2px rgba(0,0,0,0.1);

### 明显投影
text-shadow: 0 2px 8px rgba(0,0,0,0.3);

### 发光效果
text-shadow: 0 0 10px #00d4ff, 0 0 20px #00d4ff, 0 0 40px #00d4ff;
/* 多层同色不同模糊半径 = 真实发光感 */

### 描边效果（四层阴影模拟）
text-shadow:
  -2px -2px 0 #1a1a2e,
   2px -2px 0 #1a1a2e,
  -2px  2px 0 #1a1a2e,
   2px  2px 0 #1a1a2e;

### 3D 立体效果
text-shadow:
  1px 1px 0 #ccc,
  2px 2px 0 #bbb,
  3px 3px 0 #aaa,
  4px 4px 4px rgba(0,0,0,0.2);

### 使用技巧
- 和 box-shadow 不同，text-shadow 没有 inset 和扩展半径
- 多层 text-shadow 用逗号分隔
- 发光效果：多层同色 + 递增模糊半径（10px, 20px, 40px）
- 描边效果：四个方向各一个无模糊阴影
- 3D 效果：递增偏移 + 递减颜色 + 最后一层加模糊
