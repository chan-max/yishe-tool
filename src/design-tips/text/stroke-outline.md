---
title: 文字描边与镂空
triggers: 描边, 描边字, 镂空, 空心字, 文字边框, stroke, outline, 轮廓字
priority: important
---

### 效果说明
给文字添加描边或做成镂空效果，增加视觉层次。

### 单色描边
<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#1a1a2e;">
  <div style="font-size:300px;font-weight:900;color:#fff;-webkit-text-stroke:3px #667eea;">描边</div>
</div>

### 镂空字（只有描边，无填充）
<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#667eea,#764ba2);">
  <div style="font-size:320px;font-weight:900;color:transparent;-webkit-text-stroke:4px #fff;">HOLLOW</div>
</div>

### 描边+填充实心（双层叠加）
<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#f0f2f5;position:relative;">
  <div style="font-size:300px;font-weight:900;color:#1a1a2e;-webkit-text-stroke:4px #667eea;paint-order:stroke fill;">加粗描边</div>
</div>

### 使用技巧
- -webkit-text-stroke 的值 = 宽度 + 颜色，如 `3px #667eea`
- 镂空字：color:transparent + -webkit-text-stroke 设颜色
- paint-order:stroke fill 可以让描边在填充下面，文字更清晰
- 描边宽度不要太大（2-4px），太粗会糊
