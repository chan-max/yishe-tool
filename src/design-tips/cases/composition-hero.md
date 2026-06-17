---
title: Hero 区域设计
triggers: hero, 首屏, 主视觉, 大标题, 全屏, 开场, landing
priority: important
---

### 暗色科技风 Hero
<div style="width:100%;height:100%;background:linear-gradient(135deg,#0a0e27 0%,#1a1a2e 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;overflow:hidden;"><div style="position:absolute;top:10%;left:15%;width:250px;height:250px;background:radial-gradient(circle,rgba(102,126,234,0.2),transparent 70%);border-radius:50%;"></div><div style="position:absolute;bottom:15%;right:10%;width:200px;height:200px;background:radial-gradient(circle,rgba(233,69,96,0.15),transparent 70%);border-radius:50%;"></div><div style="width:100px;height:3px;background:linear-gradient(90deg,#667eea,#764ba2);margin-bottom:30px;border-radius:2px;"></div><div style="font-size:300px;font-weight:900;color:#fff;line-height:1;">标题</div><div style="font-size:100px;color:#92A8D1;margin-top:16px;letter-spacing:16px;">SUBTITLE</div></div>

### 清新渐变 Hero
<div style="width:100%;height:100%;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;"><div style="font-size:320px;font-weight:900;color:#fff;line-height:1;text-shadow:0 4px 20px rgba(0,0,0,0.2);">标题</div><div style="font-size:120px;color:rgba(255,255,255,0.85);margin-top:20px;">描述文字</div><div style="margin-top:40px;padding:16px 50px;background:rgba(255,255,255,0.2);border-radius:999px;color:#fff;font-size:80px;font-weight:600;">开始使用</div></div>

### 技巧
- Hero 区域标题字号建议 280-400px，副标题 100-140px
- 加装饰光晕用 radial-gradient + position:absolute
- 加装饰线条用小 div + background 渐变
- CTA 按钮用 border-radius:999px 做胶囊形
