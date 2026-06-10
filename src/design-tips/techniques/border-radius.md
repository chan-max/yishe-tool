---
title: border-radius 圆角技巧
triggers: 圆角, border-radius, 圆, 椭圆, 胶囊, 圆角矩形, 不规则圆角
priority: core
---

### 基本用法
border-radius: 12px;              /* 四角统一 */
border-radius: 12px 0;            /* 左上右下12px, 右上左下0 */
border-radius: 20px 20px 0 0;     /* 上圆下方（卡片顶部） */
border-radius: 0 20px 20px 0;     /* 左方右圆（标签） */

### 圆形（宽高相等时）
border-radius: 50%;

### 椭圆（宽高不等时）
border-radius: 50%;               /* 自动变成椭圆 */

### 胶囊形（宽度 > 高度时）
border-radius: 999px;             /* 短边的一半即可 */

### 不规则圆角（八值写法）
border-radius: 50% 50% 50% 50% / 30% 30% 70% 70%;
/* 斜杠前是水平半径，斜杠后是垂直半径 */
/* 效果：上面扁平，下面圆润，像鹅卵石 */

### 叶子形
border-radius: 0 50% 0 50%;       /* 对角圆角 */

### 气泡/对话形
border-radius: 20px 20px 20px 0;  /* 左下不留圆角 */

### 使用技巧
- 百分比值相对元素自身尺寸，px 值是绝对值
- 50% 在正方形上是正圆，在长方形上是椭圆
- 999px 比 50% 更适合做胶囊（50% 在长方形上会变椭圆）
- 八值写法可以做有机形状：border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%
- 内嵌元素的 border-radius 需要减去外层 padding 才能完美对齐
