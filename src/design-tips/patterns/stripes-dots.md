---
title: CSS 图案背景
triggers: 图案, 纹理, 条纹, 条纹背景, 波点, 波点背景, 网格, 几何图案, pattern, 斜纹
priority: important
---

### 效果说明
用纯 CSS 生成可重复的图案背景，不需要图片资源。

### 斜条纹
<div style="width:100%;height:100%;background:repeating-linear-gradient(45deg,#667eea,#667eea 20px,#764ba2 20px,#764ba2 40px);"></div>

### 波点
<div style="width:100%;height:100%;background:#f0f2f5;background-image:radial-gradient(#667eea 8px,transparent 8px);background-size:40px 40px;"></div>

### 网格线
<div style="width:100%;height:100%;background:#f8f9fa;background-image:linear-gradient(#e5e7eb 1px,transparent 1px),linear-gradient(90deg,#e5e7eb 1px,transparent 1px);background-size:40px 40px;"></div>

### 人字纹（Chevron）
<div style="width:100%;height:100%;background:#1a1a2e;background-image:linear-gradient(135deg,#2C3E50 25%,transparent 25%),linear-gradient(225deg,#2C3E50 25%,transparent 25%),linear-gradient(315deg,#2C3E50 25%,transparent 25%),linear-gradient(45deg,#2C3E50 25%,transparent 25%);background-size:40px 40px;background-position:0 0,0 0,20px 20px,20px 20px;"></div>

### 使用技巧
- repeating-linear-gradient 做条纹：角度 + 两组颜色交替
- radial-gradient 做波点：圆心色 + transparent，配合 background-size 控制间距
- 双 linear-gradient 交叉做网格
- 图案颜色不要太花，1-2 色即可
- background-size 控制图案密度，越小越密
