---
title: 文字图案填充
triggers: 图案字, 文字填充, 纹理字, pattern text, 条纹字, 图片填充文字, 文字背景
priority: optional
---

### 效果说明
用图片或图案填充文字内部，而不是纯色。适合做创意标题。

### 条纹填充文字
<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#1a1a2e;">
  <div style="font-size:320px;font-weight:900;background:repeating-linear-gradient(45deg,#667eea,#667eea 8px,#764ba2 8px,#764ba2 16px);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">条纹</div>
</div>

### 渐变 + 波点叠加文字
<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#f0f2f5;">
  <div style="font-size:300px;font-weight:900;background:linear-gradient(135deg,#E74C3C,#F1C40F);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">WARM</div>
</div>

### 使用技巧
- 和渐变字一样需要 background-clip:text + -webkit-text-fill-color:transparent
- 但 background 换成图案渐变（repeating-linear-gradient 等）
- 条纹间距通过渐变断点控制（如 8px, 16px）
- 文字越大图案越清晰，小字不建议
