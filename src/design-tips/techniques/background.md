---
title: background 背景技巧
triggers: 背景, background, 背景图, 背景色, 背景渐变, 背景大小, 背景重复, 叠加
priority: core
---

### 纯色背景
background-color: #1a1a2e;
background: rgba(0,0,0,0.5);       /* 半透明 */

### 渐变背景
background: linear-gradient(135deg, #667eea, #764ba2);
background: radial-gradient(circle at 30% 40%, #667eea, #1a1a2e);

### 背景图片
background-image: url(图片地址);
background-size: cover;             /* 裁剪填满 */
background-size: contain;           /* 完整显示 */
background-size: 100% 100%;         /* 拉伸填满 */
background-position: center;        /* 居中 */
background-repeat: no-repeat;       /* 不重复 */

### 多层背景叠加
background:
  linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)),
  url(图片地址);
background-size: cover;
/* 图片上叠半透明遮罩，保证文字可读 */

### 渐变 + 图片叠加
background:
  linear-gradient(135deg, rgba(102,126,234,0.8), rgba(118,75,162,0.8)),
  url(图片地址);

### 图案背景（纯 CSS）
background-image: repeating-linear-gradient(45deg, #f0f0f0, #f0f0f0 10px, #fafafa 10px, #fafafa 20px);

### 使用技巧
- 多层 background 用逗号分隔，先写的在上面
- cover 会裁剪，contain 会留白，看需求选择
- 文字覆盖在图片上时，加半透明渐变遮罩
- background-size 和 background-position 配合使用
- CSS 图案用 repeating-linear-gradient 或 radial-gradient
