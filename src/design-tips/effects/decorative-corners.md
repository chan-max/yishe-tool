---
title: 角标和边框装饰
triggers: 角标, 装饰, 边框, 角, 徽章, badge, corner, decoration
priority: important
---

### 四角 L 形装饰
<div style="width:100%;height:100%;background:#1a1a2e;position:relative;display:flex;align-items:center;justify-content:center;"><div style="position:absolute;top:6%;left:6%;width:50px;height:3px;background:#667eea;border-radius:2px;"></div><div style="position:absolute;top:6%;left:6%;width:3px;height:50px;background:#667eea;border-radius:2px;"></div><div style="position:absolute;top:6%;right:6%;width:50px;height:3px;background:#667eea;border-radius:2px;"></div><div style="position:absolute;top:6%;right:6%;width:3px;height:50px;background:#667eea;border-radius:2px;"></div><div style="position:absolute;bottom:6%;left:6%;width:50px;height:3px;background:#e94560;border-radius:2px;"></div><div style="position:absolute;bottom:6%;left:6%;width:3px;height:50px;background:#e94560;border-radius:2px;"></div><div style="position:absolute;bottom:6%;right:6%;width:50px;height:3px;background:#e94560;border-radius:2px;"></div><div style="position:absolute;bottom:6%;right:6%;width:3px;height:50px;background:#e94560;border-radius:2px;"></div><div style="text-align:center;"><div style="font-size:280px;font-weight:900;color:#fff;line-height:1;">标题</div><div style="font-size:100px;color:#92A8D1;margin-top:16px;">副标题</div></div></div>

### 渐变顶部条 + 圆形徽章
<div style="width:100%;height:100%;background:#0a0e27;position:relative;display:flex;align-items:center;justify-content:center;"><div style="position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,#667eea,#764ba2,#e94560);"></div><div style="position:absolute;top:8%;right:8%;width:80px;height:80px;background:linear-gradient(135deg,#e94560,#ff6b6b);border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:40px;font-weight:900;box-shadow:0 4px 15px rgba(233,69,96,0.4);">NEW</div><div style="text-align:center;"><div style="font-size:280px;font-weight:900;color:#fff;">标题</div><div style="font-size:100px;color:#92A8D1;margin-top:16px;">副标题</div></div></div>

### 技巧
- L 形角标用两个小 div（一个横条 + 一个竖条）
- 位置用 top/left/right/bottom 百分比（6-10%）
- 徽章用 border-radius:50% 做圆形
- 顶部渐变条 height:3-4px 最精致
