---
title: 多层阴影与立体效果
triggers: 阴影, 立体, 3D, 深度, 浮雕, 凸起, 凹陷, shadow, 层次感
priority: important
---

### 效果说明
通过多层 box-shadow 营造真实的立体感和深度层次。

### 柔和悬浮卡片
<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#f0f2f5;">
  <div style="width:80%;height:60%;background:#fff;border-radius:20px;box-shadow:0 4px 6px rgba(0,0,0,0.04),0 10px 24px rgba(0,0,0,0.08),0 20px 48px rgba(0,0,0,0.04);padding:40px;box-sizing:border-box;">
    <div style="font-size:200px;font-weight:700;color:#1a1a2e;">标题</div>
  </div>
</div>

### 新拟态（Neumorphism）凸起
<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#e0e5ec;">
  <div style="width:300px;height:300px;border-radius:50%;background:#e0e5ec;box-shadow:12px 12px 24px #b8bec7,-12px -12px 24px #fff;"></div>
</div>

### 新拟态凹陷
<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#e0e5ec;">
  <div style="width:300px;height:300px;border-radius:50%;background:#e0e5ec;box-shadow:inset 8px 8px 16px #b8bec7,inset -8px -8px 16px #fff;"></div>
</div>

### 彩色阴影（按钮/卡片）
<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#f8f9fa;">
  <div style="padding:20px 50px;background:linear-gradient(135deg,#667eea,#764ba2);border-radius:12px;box-shadow:0 8px 24px rgba(102,126,234,0.4);color:#fff;font-size:160px;font-weight:700;">按钮</div>
</div>

### 使用技巧
- 多层阴影比单层更自然：近层小模糊 + 远层大模糊
- 新拟态要求背景色和元素色一致，用明暗阴影造凹凸感
- 彩色阴影的 rgba 和元素主色保持一致，透明度 0.3-0.5
- 避免使用纯黑阴影 rgba(0,0,0,x)，用深灰色更好看
