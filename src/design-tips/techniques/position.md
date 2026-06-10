---
title: position 定位技巧
triggers: 定位, position, 绝对定位, 相对定位, 叠加, 层叠, z-index, 覆盖, 角标
priority: core
---

### relative（相对定位，不脱离文档流）
position: relative; top: 10px; left: 20px;
/* 从自身位置偏移，原位置仍占位 */

### absolute（绝对定位，脱离文档流）
position: absolute; top: 0; right: 0;
/* 相对最近的 position 非 static 的祖先定位 */

### 四角定位
position: absolute; top: 12px; right: 12px;    /* 右上角 */
position: absolute; bottom: 12px; left: 12px;  /* 左下角 */

### 完全覆盖父元素
position: absolute; top: 0; left: 0; width: 100%; height: 100%;
/* 或 */
position: absolute; inset: 0;

### 居中（绝对定位 + transform）
position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);

### 角标/徽章
position: absolute; top: -8px; right: -8px;
/* 稍微溢出父元素边缘 */

### 叠加层（图片上的文字）
父元素: position: relative;
覆盖层: position: absolute; inset: 0; background: rgba(0,0,0,0.4);

### z-index 层级
z-index: 1;      /* 普通层 */
z-index: 10;     /* 内容层 */
z-index: 100;    /* 浮层 */
/* 只在 position 非 static 时生效 */

### 使用技巧
- absolute 找最近的 position: relative/absolute/fixed 祖先
- 想让子元素绝对定位，先给父元素加 position: relative
- inset: 0 等价于 top:0;right:0;bottom:0;left:0
- z-index 只比较同一层级的元素（stacking context）
- 叠加文字时加半透明遮罩保证可读性
