---
title: mix-blend-mode 混合模式技巧
triggers: 混合模式, blend, 正片叠底, 滤色, 叠加, multiply, screen, overlay, 颜色混合
priority: optional
---

### 常用混合模式
mix-blend-mode: multiply;       /* 正片叠底：白色消失，适合去白底 */
mix-blend-mode: screen;         /* 滤色：黑色消失，适合去黑底 */
mix-blend-mode: overlay;        /* 叠加：增强对比 */
mix-blend-mode: difference;     /* 差值：反色效果 */
mix-blend-mode: color-dodge;    /* 颜色减淡：发光效果 */
mix-blend-mode: exclusion;      /* 排除：类似差值但更柔和 */

### 文字穿透效果（文字颜色随背景变化）
<div style="position:relative;background:url(图片);">
  <div style="mix-blend-mode:difference;color:#fff;font-size:280px;">穿透</div>
</div>

### 图片去白底
<img style="mix-blend-mode:multiply;" />

### 图片去黑底
<img style="mix-blend-mode:screen;" />

### 使用技巧
- multiply 最常用：白色变透明，适合叠加纹理/图案
- screen：黑色变透明，适合叠加光效
- difference：文字在复杂背景上自动变色保持可读
- 需要父元素有内容才能看到混合效果
