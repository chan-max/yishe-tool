---
title: filter 与 backdrop-filter 技巧
triggers: 模糊, filter, blur, 毛玻璃, 滤镜, 灰度, 饱和度, 亮度, 对比度, backdrop
priority: core
---

### filter（对元素自身生效）
filter: blur(8px);                    /* 模糊 */
filter: brightness(1.2);              /* 亮度（>1 变亮，<1 变暗） */
filter: contrast(1.3);                /* 对比度 */
filter: saturate(1.5);                /* 饱和度（0=灰度，>1更鲜艳） */
filter: grayscale(1);                 /* 灰度（0-1） */
filter: sepia(0.8);                   /* 复古棕褐色 */
filter: hue-rotate(90deg);            /* 色相旋转 */
filter: invert(1);                    /* 反色 */
filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2)); /* 投影（跟随形状） */

### 组合滤镜
filter: brightness(0.8) contrast(1.2) saturate(1.3);

### backdrop-filter（对元素后面的内容生效）
backdrop-filter: blur(12px);                                    /* 毛玻璃 */
backdrop-filter: blur(12px) brightness(0.8);                   /* 毛玻璃+变暗 */
backdrop-filter: blur(12px) saturate(1.5);                     /* 毛玻璃+增强色彩 */
-webkit-backdrop-filter: blur(12px);                            /* Safari 兼容 */

### drop-shadow vs box-shadow
filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
/* drop-shadow 跟随元素形状（包括 clip-path 和不规则形状） */
/* box-shadow 只跟随矩形边框 */

### 使用技巧
- filter: blur() 模糊元素自身，backdrop-filter: blur() 模糊后面的内容
- backdrop-filter 必须配合半透明背景才能看到效果
- 加 -webkit-backdrop-filter 兼容 Safari
- drop-shadow 给 clip-path 裁切的元素做阴影（box-shadow 会被裁掉）
- filter: grayscale(1) 快速做灰色模式
- 多个 filter 空格分隔叠加
