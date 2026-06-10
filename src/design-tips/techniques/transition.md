---
title: transition 过渡动画技巧
triggers: 动画, 过渡, transition, hover, 悬停, 平滑, 动效
priority: optional
---

### 基本语法
transition: 属性 时长 缓动函数;

### 常用写法
transition: all 0.2s ease;                    /* 所有属性 0.2 秒 */
transition: transform 0.2s ease, box-shadow 0.2s ease;  /* 指定属性 */
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);     /* 自定义缓动 */

### hover 效果（卡片浮起）
默认: transform: translateY(0); box-shadow: 0 2px 8px rgba(0,0,0,0.1);
hover: transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.15);
transition: transform 0.2s ease, box-shadow 0.2s ease;

### hover 效果（按钮放大）
transition: transform 0.15s ease;
hover: transform: scale(1.05);

### hover 效果（颜色渐变）
transition: background 0.2s ease, color 0.2s ease;

### 使用技巧
- 在画布 HTML 中 transition 主要用于 hover 效果
- 时长 0.15-0.3s 最舒适，超过 0.5s 会感觉慢
- ease 是最常用的缓动，cubic-bezier 做自定义曲线
- 不要用 transition: all，指定具体属性性能更好
- transform 的过渡比 top/left 更流畅（GPU 加速）
