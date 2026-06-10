---
title: gradient 渐变技巧
triggers: 渐变, gradient, 线性渐变, 径向渐变, 锥形渐变, 背景渐变, 渐变方向
priority: core
---

### 线性渐变
background: linear-gradient(135deg, #667eea, #764ba2);
/* 角度：0deg=从下到上, 90deg=从左到右, 135deg=左上到右下, 180deg=从上到下 */

### 多色渐变（控制色标位置）
background: linear-gradient(90deg, #ff006e 0%, #8338ec 50%, #3a86ff 100%);

### 硬边渐变（无过渡，条纹效果）
background: linear-gradient(90deg, #667eea 50%, #764ba2 50%);
/* 50% 处直接切换颜色，没有过渡 */

### 径向渐变
background: radial-gradient(circle, #667eea, #1a1a2e);
background: radial-gradient(ellipse at top, #667eea 0%, transparent 70%);

### 锥形渐变
background: conic-gradient(#E74C3C, #F1C40F, #2ECC71, #3498DB, #E74C3C);
background: conic-gradient(from 45deg, #667eea, #764ba2, #667eea);

### 渐变叠加
background:
  linear-gradient(135deg, rgba(102,126,234,0.8), rgba(118,75,162,0.8)),
  url(image.jpg);
/* 渐变覆盖在图片上 */

### 渐变文字
background: linear-gradient(135deg, #667eea, #764ba2);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;

### 使用技巧
- 角度用数字：135deg 最常用（左上到右下），180deg 从上到下
- 多色渐变每个色标可以指定位置：color position%
- rgba 透明度可以做半透明渐变叠加
- radial-gradient 的 at 可以定位光源：at top left, at center
- 渐变可以做纯色分割：linear-gradient(#eee 1px, transparent 1px)
