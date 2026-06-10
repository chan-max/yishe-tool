---
title: 渐变文字
triggers: 渐变字, 渐变文字, gradient text, 彩色字, 彩虹字, 渐变标题
priority: important
---

### 效果说明
文字填充渐变色而非纯色，视觉冲击力强。适合大标题。

### 线性渐变文字
<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#1a1a2e;">
  <div style="font-size:300px;font-weight:900;background:linear-gradient(135deg,#667eea,#764ba2);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">渐变</div>
</div>

### 三色渐变
<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#0a0e27;">
  <div style="font-size:280px;font-weight:900;background:linear-gradient(90deg,#ff006e,#8338ec,#3a86ff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">COLOR</div>
</div>

### 金属质感渐变
<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#1a1a2e;">
  <div style="font-size:300px;font-weight:900;background:linear-gradient(180deg,#f5e6cc 0%,#d4a843 40%,#f5e6cc 60%,#d4a843 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">GOLD</div>
</div>

### 使用技巧
- 三个属性缺一不可：background + -webkit-background-clip:text + -webkit-text-fill-color:transparent
- 同时加 background-clip:text（不带前缀）兼容 Firefox
- 字号越大效果越明显，小字不推荐
- 金属渐变用 180deg（从上到下），多色交替模拟反光
