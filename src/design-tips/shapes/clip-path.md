---
title: CSS 异形裁切
triggers: 异形, clip-path, 裁切, 星形, 六边形, 三角形, 标签, 对话气泡, 形状, 多边形
priority: important
---

### 效果说明
用 clip-path 把元素裁切成非矩形的形状。适合做标签、徽章、装饰图形。

### 正六边形
<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#f0f2f5;">
  <div style="width:400px;height:400px;background:linear-gradient(135deg,#667eea,#764ba2);clip-path:polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%);display:flex;align-items:center;justify-content:center;">
    <div style="color:#fff;font-size:120px;font-weight:700;">HEX</div>
  </div>
</div>

### 五角星
<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#1a1a2e;">
  <div style="width:400px;height:400px;background:linear-gradient(180deg,#D4A843,#f5e6cc);clip-path:polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%);"></div>
</div>

### 标签/价格牌
<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#f0f2f5;">
  <div style="padding:20px 60px 20px 40px;background:#E74C3C;clip-path:polygon(0% 0%,90% 0%,100% 50%,90% 100%,0% 100%);font-size:160px;font-weight:900;color:#fff;">SALE</div>
</div>

### 对话气泡
<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#f0f2f5;">
  <div style="padding:30px 50px;background:#fff;border-radius:16px;clip-path:polygon(0% 0%,100% 0%,100% 75%,60% 75%,50% 100%,40% 75%,0% 75%);font-size:140px;font-weight:600;color:#1a1a2e;box-shadow:0 4px 12px rgba(0,0,0,0.1);">Hello!</div>
</div>

### 使用技巧
- clip-path 的 polygon 用百分比坐标定义顶点
- 正六边形 6 个顶点，五角星 10 个顶点
- 标签形状：右侧用三角形箭头（90% 0%, 100% 50%, 90% 100%）
- clip-path 裁切后 box-shadow 也会被裁掉，需要阴影用 filter:drop-shadow
- 可以用在线工具 "clippy" 生成更多形状
