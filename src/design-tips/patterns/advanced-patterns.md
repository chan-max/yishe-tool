---
title: 高级 CSS 图案
triggers: 高级图案, 渐变图案, 同心圆, 棋盘格, 钻石纹, 渐变网格, 背景装饰, 纹理背景
priority: optional
---

### 效果说明
比基础条纹/波点更复杂的 CSS 图案，用多层渐变叠加实现。

### 同心圆
<div style="width:100%;height:100%;background:#1a1a2e;background-image:radial-gradient(circle at center,transparent 30px,#2C3E50 30px,#2C3E50 32px,transparent 32px,transparent 60px,#2C3E50 60px,#2C3E50 62px,transparent 62px,transparent 90px,#2C3E50 90px,#2C3E50 92px,transparent 92px);"></div>

### 棋盘格
<div style="width:100%;height:100%;background:#f8f9fa;background-image:linear-gradient(45deg,#e5e7eb 25%,transparent 25%),linear-gradient(-45deg,#e5e7eb 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#e5e7eb 75%),linear-gradient(-45deg,transparent 75%,#e5e7eb 75%);background-size:40px 40px;background-position:0 0,0 20px,20px -20px,-20px 0;"></div>

### 渐变网格叠加
<div style="width:100%;height:100%;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);background-image:linear-gradient(135deg,#667eea 0%,#764ba2 100%),linear-gradient(rgba(255,255,255,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.05) 1px,transparent 1px);background-size:100% 100%,30px 30px,30px 30px;"></div>

### 使用技巧
- 多层 background-image 叠加可以组合出复杂图案
- 棋盘格需要 4 层 45deg 渐变精确对位
- 网格叠加在渐变/图片上可以增加质感
- rgba 低透明度（0.03-0.08）做微妙纹理最好看
