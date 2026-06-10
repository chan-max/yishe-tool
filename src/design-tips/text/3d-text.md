---
title: 3D 立体文字
triggers: 3D, 立体字, 立体文字, 3D文字, 浮雕字, 层叠字, 厚度, extrude
priority: important
---

### 效果说明
用多层 text-shadow 堆出文字的厚度感，做出伪 3D 立体效果。

### 经典 3D 挤出
<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#1a1a2e;">
  <div style="font-size:320px;font-weight:900;color:#f5f5f5;text-shadow:1px 1px 0 #d4d4d4,2px 2px 0 #b8b8b8,3px 3px 0 #999,4px 4px 0 #777,5px 5px 0 #555,6px 6px 10px rgba(0,0,0,0.4);">3D</div>
</div>

### 彩色 3D 层叠
<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#0a0e27;">
  <div style="font-size:300px;font-weight:900;color:#ff006e;text-shadow:3px 3px 0 #8338ec,6px 6px 0 #3a86ff,9px 9px 15px rgba(0,0,0,0.3);">STACK</div>
</div>

### 长阴影（扁平风格）
<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#667eea;">
  <div style="font-size:300px;font-weight:900;color:#fff;text-shadow:1px 1px 0 rgba(0,0,0,0.1),2px 2px 0 rgba(0,0,0,0.1),3px 3px 0 rgba(0,0,0,0.1),4px 4px 0 rgba(0,0,0,0.1),5px 5px 0 rgba(0,0,0,0.1),6px 6px 0 rgba(0,0,0,0.1),7px 7px 0 rgba(0,0,0,0.1),8px 8px 0 rgba(0,0,0,0.1),9px 9px 0 rgba(0,0,0,0.1),10px 10px 0 rgba(0,0,0,0.1),11px 11px 0 rgba(0,0,0,0.1),12px 12px 0 rgba(0,0,0,0.1);">FLAT</div>
</div>

### 使用技巧
- 经典 3D：每层 shadow 递增 1px，颜色从浅到深，最后一层加模糊
- 彩色层叠：每层用不同颜色，偏移 3-6px，做出错位效果
- 长阴影：多层同透明度阴影递增，扁平设计风格
- 层数越多厚度越大，一般 5-12 层就够了
- 最后一层加 `Xpx Xpx 10px rgba(0,0,0,0.3)` 让阴影落地
