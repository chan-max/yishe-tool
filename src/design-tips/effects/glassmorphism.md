---
title: 毛玻璃效果
triggers: 毛玻璃, 磨砂, 玻璃, glass, 透明, 半透明, 模糊, blur, iOS, 苹果风格
priority: important
---

### 效果说明
半透明 + 背景模糊，营造磨砂玻璃质感。适合覆盖在图片/渐变上方。

### 基础毛玻璃卡片
<div style="width:100%;height:100%;background:linear-gradient(135deg,#667eea,#764ba2);display:flex;align-items:center;justify-content:center;">
  <div style="width:70%;height:50%;background:rgba(255,255,255,0.15);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.2);border-radius:20px;padding:40px;box-sizing:border-box;">
    <div style="font-size:180px;font-weight:700;color:#fff;">Glass</div>
  </div>
</div>

### 深色毛玻璃
<div style="width:100%;height:100%;background:url(https://picsum.photos/800/600) center/cover;display:flex;align-items:center;justify-content:center;">
  <div style="width:70%;height:50%;background:rgba(0,0,0,0.3);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:40px;box-sizing:border-box;">
    <div style="font-size:160px;font-weight:600;color:#fff;">Dark Glass</div>
  </div>
</div>

### 使用技巧
- 必须加 -webkit-backdrop-filter 兼容 Safari
- 背景必须有内容（图片/渐变），纯色背景看不出效果
- background 的 rgba 透明度控制玻璃浓淡：0.1-0.2 轻透，0.3-0.5 浓
- 加 1px rgba(255,255,255,0.2) 边框增加玻璃边缘感
