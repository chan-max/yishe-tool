import type { KnowledgeItem } from "./types";

export const backgroundPatternsKnowledge: KnowledgeItem = {
  triggers: [
    "纹理", "图案", "pattern", "条纹", "点阵", "波点",
    "网格线", "背景图案", "重复", "噪点",
  ],
  priority: "optional",
  category: "css-patterns",
  tokens: 350,
  content: `## 背景图案 / 纹理

### 点阵图案
background-image:radial-gradient(circle,rgba(255,255,255,0.05) 1px,transparent 1px);background-size:20px 20px;
→ 配合深色背景

### 条纹图案（斜线）
background-image:repeating-linear-gradient(45deg,transparent,transparent 10px,rgba(255,255,255,0.03) 10px,rgba(255,255,255,0.03) 20px);

### 条纹图案（水平）
background-image:repeating-linear-gradient(0deg,transparent,transparent 20px,rgba(255,255,255,0.02) 20px,rgba(255,255,255,0.02) 21px);

### 网格线
background-image:linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px);background-size:40px 40px;

### 波点图案
background-image:radial-gradient(circle,rgba(102,126,234,0.1) 8px,transparent 8px);background-size:40px 40px;background-position:0 0,20px 20px;

### 噪点纹理（用渐变模拟）
background-image:linear-gradient(135deg,rgba(0,0,0,0.02) 25%,transparent 25%,transparent 50%,rgba(0,0,0,0.02) 50%,rgba(0,0,0,0.02) 75%,transparent 75%);background-size:4px 4px;

### 锥形渐变图案
background:conic-gradient(from 0deg,#667eea,#764ba2,#e94560,#f1c40f,#667eea);
→ 彩色圆环效果

### 使用技巧
- 图案背景 + 纯色背景叠加效果更好
- 图案用低透明度（0.02-0.05），不要喧宾夺主
- background-size 控制图案密度
- 可以多层 background-image 叠加`,
};
