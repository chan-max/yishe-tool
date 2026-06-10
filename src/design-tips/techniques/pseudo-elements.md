---
title: 伪元素与装饰技巧
triggers: 伪元素, before, after, 装饰, 角标, 分割线, 引号, 装饰线, 下划线
priority: important
---

### 基本语法（在 HTML 的 style 中不能直接用，需要用 class）
.element::before { content: ""; ... }
.element::after { content: ""; ... }

### 在画布 HTML 中的替代方案
用额外的 div 代替伪元素：
<div style="position:relative;">
  内容
  <div style="position:absolute;...">装饰</div>
</div>

### 分割线
<div style="height:2px;background:linear-gradient(90deg,transparent,#e5e7eb,transparent);"></div>

### 角标/数字标记
<div style="position:absolute;top:-8px;right:-8px;width:24px;height:24px;background:#E74C3C;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:12px;">3</div>

### 装饰引号
<div style="font-size:400px;color:#667eea;opacity:0.15;line-height:0.5;font-family:Georgia,serif;">"</div>

### 底部装饰线
<div style="width:60px;height:4px;background:#667eea;border-radius:2px;"></div>

### 渐变分隔线
<div style="width:100%;height:1px;background:linear-gradient(90deg,transparent,#d1d5db,transparent);"></div>

### 使用技巧
- 画布的 HTML 元素不支持 ::before/::after，用额外 div 替代
- 装饰元素用 position:absolute 不影响布局
- 分割线用渐变做比纯色更好看（两端渐隐）
- 引号装饰用大号 + 低透明度，不要喧宾夺主
- 装饰线宽度 40-80px 足够，不要撑满
