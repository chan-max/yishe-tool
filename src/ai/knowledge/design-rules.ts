import type { KnowledgeItem } from "./types";

export const designRulesKnowledge: KnowledgeItem = {
  triggers: [
    "设计",
    "配色",
    "颜色",
    "字号",
    "字体大小",
    "布局",
    "构图",
    "风格",
    "好看",
    "美化",
  ],
  priority: "core", // 核心规则，始终注入
  category: "design-basics",
  tokens: 200,

  content: `## 设计规则

### 配色（禁止纯黑 #000000 纯白 #ffffff）

莫兰迪：#B8A9C9 #F7CAC9 #92A8D1 #F5E6CC
马卡龙：#FFB3BA #BAFFC9 #BAE1FF #FFFFBA
高级灰：#2C3E50 #34495E #7F8C8D #95A5A6
暖色：#E74C3C #E67E22 #F1C40F #E91E63
冷色：#3498DB #2ECC71 #1ABC9C #9B59B6
大地：#8D6E63 #A1887F #BCAAA4 #D7CCC8

深色背景配浅色字，浅色背景配深色字

### 字号
- HTML 继承画布基础字号，优先用 em 建立层级：展示标题 8-14em | 标题 5-8em | 副标题 2.5-4em | 正文 1.5-2.5em | 注释 0.8-1.2em
- 兰亭序、碑帖、长文使用 dense 基础字号；书法正文作为视觉主体时用 2.5-4.5em，行高 1.6-2.2
- 中间布局容器不要设置 font-size，避免嵌套 em 重复放大

### 构图 → CSS 实现
- 居中构图：display:flex;align-items:center;justify-content:center;
- 三分法：position:absolute;top:33%;left:33%; 或用 flex + padding 偏移
- 留白：padding:5%;gap:1em;margin 也行
- 层级：z-index 背景=0 装饰=1-5 文字=10-20（需 position:relative/absolute）
- 左右分栏：display:flex; 左右各 flex:1;
- 卡片网格：display:grid;grid-template-columns:1fr 1fr;gap:30px;`,
};
