import type { KnowledgeItem } from "./types";

export const pseudoElementsKnowledge: KnowledgeItem = {
  triggers: [
    "伪元素", "before", "after", "叠加层", "遮罩", "overlay",
    "半透明层", "渐变叠加", "蒙版", "mask",
  ],
  priority: "important",
  category: "css-pseudo",
  tokens: 350,
  content: `## 叠加层和遮罩

### 渐变叠加（文字在图片上可读）
父元素 position:relative;
叠加层：position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0.1) 0%,rgba(0,0,0,0.7) 100%);
文字层：position:absolute;bottom:15%;left:8%;

### 半透明遮罩
position:absolute;inset:0;background:rgba(0,0,0,0.4);
→ 用于深色遮罩让白色文字可读

### 侧边渐变叠加
position:absolute;inset:0;background:linear-gradient(90deg,rgba(0,0,0,0.8) 0%,rgba(0,0,0,0) 60%);
→ 左侧深、右侧透明，适合左文右图布局

### 底部渐变叠加
position:absolute;bottom:0;left:0;right:0;height:50%;background:linear-gradient(180deg,transparent,rgba(0,0,0,0.7));
→ 底部文字区域加深

### 彩色叠加
position:absolute;inset:0;background:linear-gradient(135deg,rgba(102,126,234,0.3),rgba(118,75,162,0.3));
→ 给图片加一层彩色滤镜

### 斜线纹理叠加
position:absolute;inset:0;background:repeating-linear-gradient(45deg,transparent,transparent 10px,rgba(0,0,0,0.03) 10px,rgba(0,0,0,0.03) 20px);

### 使用技巧
- 遮罩层必须 position:absolute + inset:0 或 top:0;left:0;width:100%;height:100%
- 父元素必须 position:relative
- rgba 的最后一个值控制透明度：0.3=轻遮 0.5=中遮 0.7=重遮
- 渐变遮罩比纯色遮罩更有层次感`,
};
