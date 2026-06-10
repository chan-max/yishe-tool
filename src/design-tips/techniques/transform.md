---
title: transform 变形技巧
triggers: 旋转, 缩放, 倾斜, transform, rotate, scale, skew, 翻转, 变形, 3D
priority: core
---

### 旋转
transform: rotate(45deg);          /* 顺时针 45° */
transform: rotate(-15deg);         /* 逆时针 15° */

### 缩放
transform: scale(1.5);             /* 放大 1.5 倍 */
transform: scale(0.8);             /* 缩小到 0.8 */
transform: scaleX(2);              /* 只水平拉伸 */

### 位移
transform: translateX(20px);       /* 右移 20px */
transform: translateY(-10px);      /* 上移 10px */
transform: translate(20px, -10px); /* 同时移动 */

### 倾斜
transform: skewX(-10deg);          /* 水平倾斜 */
transform: skewY(5deg);            /* 垂直倾斜 */

### 翻转
transform: scaleX(-1);             /* 水平镜像 */
transform: scaleY(-1);             /* 垂直镜像 */

### 组合（多个变换空格分隔）
transform: rotate(-5deg) scale(1.1);     /* 微旋转 + 放大 */
transform: translateY(-5px) scale(1.05); /* 上浮 + 微放大（hover 常用） */

### 变换原点
transform-origin: center;          /* 默认：中心 */
transform-origin: top left;        /* 左上角 */
transform-origin: bottom center;   /* 底部中心（翻书效果） */

### 透视（3D 效果基础）
perspective: 800px;                /* 放在父元素上 */
transform: rotateY(15deg);         /* Y 轴旋转产生 3D 感 */

### 使用技巧
- 多个变换写在一个 transform 里，空格分隔
- 顺序重要：rotate + translate ≠ translate + rotate
- transform 不影响布局（不会推开其他元素）
- hover 效果常用：translateY(-4px) + scale(1.02)
- 配合 transition 做平滑动画
