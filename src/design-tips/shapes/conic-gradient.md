---
title: 锥形渐变与色轮
triggers: 锥形渐变, conic, 色轮, 扇形, 饼图, 彩虹, 旋转渐变, conic-gradient
priority: optional
---

### 效果说明
conic-gradient 从中心向外旋转展开颜色，适合做色轮、饼图、彩虹装饰。

### 彩虹色轮
<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#1a1a2e;">
  <div style="width:400px;height:400px;border-radius:50%;background:conic-gradient(#E74C3C,#F1C40F,#2ECC71,#3498DB,#9B59B6,#E74C3C);"></div>
</div>

### 饼图（三段）
<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#f0f2f5;">
  <div style="width:400px;height:400px;border-radius:50%;background:conic-gradient(#667eea 0% 45%,#764ba2 45% 75%,#ff006e 75% 100%);"></div>
</div>

### 扇形装饰
<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#1a1a2e;">
  <div style="width:500px;height:500px;border-radius:50%;background:conic-gradient(from 0deg,transparent 0deg,rgba(102,126,234,0.3) 30deg,transparent 60deg,transparent 120deg,rgba(255,0,110,0.2) 150deg,transparent 180deg);"></div>
</div>

### 使用技巧
- conic-gradient 语法：conic-gradient(颜色1 角度1, 颜色2 角度2, ...)
- 用 from Xdeg 控制起始角度
- 饼图：每段用百分比控制占比
- 扇形装饰：混合 transparent 和半透明色
- 配合 border-radius:50% 做圆形，不加就是矩形旋转渐变
