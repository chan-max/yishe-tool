---
title: flexbox 布局技巧
triggers: 布局, flex, flexbox, 排列, 对齐, 居中, 间距, 换行, 弹性
priority: core
---

### 基础容器
display: flex;

### 主轴方向
flex-direction: row;          /* 水平（默认） */
flex-direction: column;       /* 垂直 */
flex-direction: row-reverse;  /* 水平反向 */

### 主轴对齐
justify-content: center;        /* 居中 */
justify-content: space-between;  /* 两端对齐，中间等距 */
justify-content: space-around;   /* 每个元素两侧等距 */
justify-content: flex-start;     /* 靠左 */
justify-content: flex-end;       /* 靠右 */

### 交叉轴对齐
align-items: center;          /* 垂直居中 */
align-items: flex-start;      /* 顶部对齐 */
align-items: stretch;         /* 拉伸填满（默认） */

### 完美居中（最常用）
display: flex; align-items: center; justify-content: center;

### 换行
flex-wrap: wrap;              /* 允许换行 */
gap: 12px;                    /* 元素间距 */

### 子元素弹性
flex: 1;                      /* 等分剩余空间 */
flex: 2;                      /* 占 2 份 */
flex-shrink: 0;               /* 不允许缩小 */

### 两端对齐（经典场景）
display: flex; justify-content: space-between;
/* 标题和按钮分列两侧 */

### 使用技巧
- gap 比 margin 更好用，不会产生多余边距
- space-between 做导航栏/卡片头尾最合适
- flex: 1 让子元素等分空间，不用算百分比
- align-items: center + justify-content: center = 完美居中
- column 方向做垂直列表最方便
