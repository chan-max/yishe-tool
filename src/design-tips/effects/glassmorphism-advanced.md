---
title: 高级毛玻璃效果
triggers: 毛玻璃, 玻璃, glass, 模糊, 磨砂, 通透
priority: important
---

### 玻璃卡片（深色背景）
<div style="width:100%;height:100%;background:linear-gradient(135deg,#0a0e27,#1a1a2e);display:flex;align-items:center;justify-content:center;position:relative;"><div style="position:absolute;top:20%;left:20%;width:300px;height:300px;background:linear-gradient(135deg,#667eea,#764ba2);border-radius:50%;filter:blur(60px);opacity:0.6;"></div><div style="position:absolute;bottom:20%;right:20%;width:250px;height:250px;background:linear-gradient(135deg,#e94560,#ff6b6b);border-radius:50%;filter:blur(60px);opacity:0.5;"></div><div style="width:65%;padding:50px;background:rgba(255,255,255,0.08);backdrop-filter:blur(20px);border-radius:24px;border:1px solid rgba(255,255,255,0.12);box-shadow:0 8px 32px rgba(0,0,0,0.2);"><div style="font-size:200px;font-weight:900;color:#fff;">标题</div><div style="font-size:80px;color:rgba(255,255,255,0.7);margin-top:12px;">描述文字</div></div></div>

### 玻璃导航栏
<div style="width:100%;height:100%;background:linear-gradient(135deg,#1a1a2e,#16213e);position:relative;"><div style="position:absolute;top:0;left:0;right:0;padding:20px 40px;background:rgba(255,255,255,0.06);backdrop-filter:blur(12px);border-bottom:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:space-between;"><div style="font-size:80px;font-weight:700;color:#fff;">Logo</div><div style="display:flex;gap:30px;"><div style="font-size:50px;color:rgba(255,255,255,0.7);">首页</div><div style="font-size:50px;color:rgba(255,255,255,0.7);">产品</div><div style="font-size:50px;color:rgba(255,255,255,0.7);">关于</div></div></div><div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;"><div style="font-size:280px;font-weight:900;color:#fff;">内容区</div></div></div>

### 技巧
- 背景模糊 10-20px，太低没效果，太高性能差
- 背景色用 rgba 低透明度（0.05-0.15）
- 配合彩色光晕（filter:blur 的彩色 div）效果更好
- 边框用 1px solid rgba(255,255,255,0.1-0.2)
