import type { KnowledgeItem } from "./types";

export const designRulesKnowledge: KnowledgeItem = {
  triggers: ["设计", "配色", "颜色", "字号", "字体大小", "布局", "构图", "风格", "好看", "美化"],
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
主标题 280-400 | 副标题 160-220 | 正文 100-140 | 注释 60-80

### 构图
- 三分法：主元素放在 33%/66% 位置，不要总是居中
- 留白：元素间距 ≥20px，边距 ≥5%
- 层级：背景 zIndex=0，装饰 1-5，文字 10-20`,
};
