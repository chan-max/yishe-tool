---
title: 内发光与内阴影
triggers: 内发光, 内阴影, inset, inner glow, inner shadow, 内光, 凹陷光
priority: optional
---

### 效果说明
box-shadow inset 在元素内部产生阴影或发光，营造凹陷、内凹、发光面板效果。

### 内发光（深色容器 + 彩色内光）
<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#0a0e27;">
  <div style="width:350px;height:350px;border-radius:20px;background:#1a1a2e;box-shadow:inset 0 0 30px rgba(102,126,234,0.3),inset 0 0 60px rgba(102,126,234,0.1);display:flex;align-items:center;justify-content:center;">
    <div style="font-size:160px;font-weight:700;color:#667eea;">GLOW</div>
  </div>
</div>

### 内阴影凹陷效果
<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#e0e5ec;">
  <div style="width:300px;height:300px;border-radius:50%;background:#e0e5ec;box-shadow:inset 8px 8px 16px rgba(0,0,0,0.15),inset -8px -8px 16px rgba(255,255,255,0.8);"></div>
</div>

### 使用技巧
- inset 关键字放在 box-shadow 最前面
- 内发光：大模糊半径 + 低透明度彩色阴影
- 凹陷效果：一暗一亮两个 inset shadow 对角放置
- 适合新拟态（Neumorphism）风格的凹陷元素
- 配合外部 box-shadow 可以同时有凸起和凹陷效果
