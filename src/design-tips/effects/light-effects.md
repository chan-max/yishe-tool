---
title: 光效与氛围效果
triggers: 光效, 氛围, 光晕, 径向光, 聚光灯, spotlight, 氛围光, 背景光, 光照
priority: important
---

### 效果说明
用径向渐变和混合模式营造光照氛围，让设计有"打光"的感觉。

### 径向光晕（背景装饰）
<div style="width:100%;height:100%;position:relative;background:#0a0e27;display:flex;align-items:center;justify-content:center;">
  <div style="position:absolute;width:500px;height:500px;background:radial-gradient(circle,rgba(102,126,234,0.4) 0%,transparent 70%);top:10%;left:20%;"></div>
  <div style="position:absolute;width:400px;height:400px;background:radial-gradient(circle,rgba(255,0,110,0.3) 0%,transparent 70%);bottom:10%;right:15%;"></div>
  <div style="position:relative;z-index:1;font-size:280px;font-weight:900;color:#fff;">GLOW</div>
</div>

### 顶部聚光灯
<div style="width:100%;height:100%;background:#1a1a2e;background-image:radial-gradient(ellipse at 50% 0%,rgba(102,126,234,0.3) 0%,transparent 60%);display:flex;align-items:center;justify-content:center;">
  <div style="font-size:280px;font-weight:900;color:#fff;">SPOTLIGHT</div>
</div>

### 底部渐变氛围
<div style="width:100%;height:100%;background:linear-gradient(180deg,#1a1a2e 0%,#1a1a2e 50%,#2C3E50 100%);display:flex;align-items:flex-end;justify-content:center;padding-bottom:60px;box-sizing:border-box;">
  <div style="font-size:200px;font-weight:700;color:#fff;opacity:0.9;">BOTTOM LIGHT</div>
</div>

### 使用技巧
- 径向光晕用 radial-gradient + 透明渐变，多个叠加更真实
- 聚光灯用 radial-gradient 的 at 定位光源位置
- rgba 透明度控制光的强弱：0.2 微弱，0.4-0.5 明显
- 光晕颜色和设计主色保持一致，不要随便用白光
