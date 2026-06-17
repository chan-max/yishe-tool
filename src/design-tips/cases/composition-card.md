---
title: 卡片布局设计
triggers: 卡片, card, 产品, 特性, feature, 四宫格, 网格
priority: important
---

### 双卡片并排
<div style="width:100%;height:100%;background:#f0f2f5;display:flex;gap:30px;padding:6%;box-sizing:border-box;"><div style="flex:1;background:#fff;border-radius:20px;padding:50px;box-shadow:0 4px 20px rgba(0,0,0,0.08);display:flex;flex-direction:column;justify-content:center;"><div style="font-size:160px;font-weight:800;color:#1a1a2e;">标题 A</div><div style="font-size:70px;color:#7F8C8D;margin-top:12px;line-height:1.5;">描述内容</div></div><div style="flex:1;background:linear-gradient(135deg,#667eea,#764ba2);border-radius:20px;padding:50px;display:flex;flex-direction:column;justify-content:center;"><div style="font-size:160px;font-weight:800;color:#fff;">标题 B</div><div style="font-size:70px;color:rgba(255,255,255,0.8);margin-top:12px;line-height:1.5;">描述内容</div></div></div>

### 四宫格卡片
<div style="width:100%;height:100%;background:#f8f9fa;display:grid;grid-template-columns:1fr 1fr;gap:24px;padding:5%;box-sizing:border-box;"><div style="background:#fff;border-radius:16px;padding:36px;box-shadow:0 2px 12px rgba(0,0,0,0.06);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;"><div style="width:80px;height:80px;background:linear-gradient(135deg,#667eea,#764ba2);border-radius:50%;margin-bottom:20px;"></div><div style="font-size:80px;font-weight:700;color:#1a1a2e;">功能 1</div><div style="font-size:50px;color:#7F8C8D;margin-top:8px;">描述</div></div><div style="background:#fff;border-radius:16px;padding:36px;box-shadow:0 2px 12px rgba(0,0,0,0.06);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;"><div style="width:80px;height:80px;background:linear-gradient(135deg,#e94560,#ff6b6b);border-radius:50%;margin-bottom:20px;"></div><div style="font-size:80px;font-weight:700;color:#1a1a2e;">功能 2</div><div style="font-size:50px;color:#7F8C8D;margin-top:8px;">描述</div></div><div style="background:#fff;border-radius:16px;padding:36px;box-shadow:0 2px 12px rgba(0,0,0,0.06);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;"><div style="width:80px;height:80px;background:linear-gradient(135deg,#2ecc71,#27ae60);border-radius:50%;margin-bottom:20px;"></div><div style="font-size:80px;font-weight:700;color:#1a1a2e;">功能 3</div><div style="font-size:50px;color:#7F8C8D;margin-top:8px;">描述</div></div><div style="background:#fff;border-radius:16px;padding:36px;box-shadow:0 2px 12px rgba(0,0,0,0.06);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;"><div style="width:80px;height:80px;background:linear-gradient(135deg,#f39c12,#e67e22);border-radius:50%;margin-bottom:20px;"></div><div style="font-size:80px;font-weight:700;color:#1a1a2e;">功能 4</div><div style="font-size:50px;color:#7F8C8D;margin-top:8px;">描述</div></div></div>

### 技巧
- 卡片用 background:#fff + border-radius:16-24px + box-shadow
- 间距用 gap:20-30px 或 padding:5-6%
- 内部 padding 36-60px 保证呼吸感
- 图标用圆形 div + 渐变背景 + border-radius:50%
