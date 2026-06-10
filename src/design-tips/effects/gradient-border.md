---
title: 渐变边框与扫光效果
triggers: 渐变边框, 彩色边框, gradient border, 扫光, 流光, 光扫, 炫彩边框, 动态边框
priority: important
---

### 效果说明
用渐变做边框或扫过元素表面的光效，视觉冲击力强。适合卡片、按钮、标题装饰。

### 渐变边框（border-image 方式）
<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#1a1a2e;">
  <div style="padding:30px 50px;border:3px solid;border-image:linear-gradient(135deg,#667eea,#764ba2,#ff006e) 1;font-size:200px;font-weight:700;color:#fff;">BORDER</div>
</div>

### 渐变边框（双层嵌套方式，支持圆角）
<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#1a1a2e;">
  <div style="padding:3px;background:linear-gradient(135deg,#667eea,#764ba2,#ff006e);border-radius:16px;">
    <div style="background:#1a1a2e;border-radius:13px;padding:30px 50px;font-size:180px;font-weight:700;color:#fff;">圆角边框</div>
  </div>
</div>

### 扫光效果（伪元素 + 渐变）
<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#1a1a2e;overflow:hidden;">
  <div style="position:relative;padding:30px 60px;background:linear-gradient(135deg,#2C3E50,#34495E);border-radius:12px;font-size:200px;font-weight:700;color:#fff;overflow:hidden;">
    SHINE
    <div style="position:absolute;top:-50%;left:-50%;width:200%;height:200%;background:linear-gradient(45deg,transparent 40%,rgba(255,255,255,0.15) 50%,transparent 60%);"></div>
  </div>
</div>

### 使用技巧
- border-image 不支持圆角，需要圆角时用双层嵌套方式
- 双层方式：外层渐变当"边框"，内层深色背景盖住中间
- 扫光用一个绝对定位的半透明渐变条覆盖在元素上方
- 扫光渐变角度 45deg 效果最自然
