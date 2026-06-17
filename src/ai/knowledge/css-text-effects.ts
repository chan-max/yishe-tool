import type { KnowledgeItem } from "./types";

export const textEffectsKnowledge: KnowledgeItem = {
  triggers: [
    "文字效果", "渐变字", "发光字", "霓虹", "立体字", "描边",
    "text-shadow", "文字阴影", "艺术字", "标题效果", "彩色字",
  ],
  priority: "important",
  category: "css-text",
  tokens: 450,
  content: `## 文字效果

### 渐变文字
background:linear-gradient(135deg,#667eea,#764ba2);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
→ 三个属性缺一不可，字号越大效果越好（200px+）

### 金属质感文字
background:linear-gradient(180deg,#f5e6cc 0%,#d4a843 40%,#f5e6cc 60%,#d4a843 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;

### 霓虹发光
color:#fff;text-shadow:0 0 10px #00d4ff,0 0 20px #00d4ff,0 0 40px #00d4ff,0 0 80px #00d4ff;
→ 必须深色背景，多层叠加（10px→20px→40px→80px）

### 双色霓虹
color:#fff;text-shadow:0 0 10px #ff006e,0 0 20px #ff006e,0 0 40px #ff006e,0 0 80px #8338ec;

### 文字描边
color:#fff;-webkit-text-stroke:3px #667eea;
或用 text-shadow 模拟：text-shadow:-3px -3px 0 #667eea,3px -3px 0 #667eea,-3px 3px 0 #667eea,3px 3px 0 #667eea;

### 3D 文字
color:#667eea;text-shadow:0 1px 0 #5a7bd4,0 2px 0 #4e6bba,0 3px 0 #425ba0,0 4px 0 #364b86,0 5px 0 #2a3b6c,0 6px 1px rgba(0,0,0,0.1),0 0 5px rgba(0,0,0,0.1),0 1px 3px rgba(0,0,0,0.3),0 3px 5px rgba(0,0,0,0.2);

### 文字阴影（柔和）
text-shadow:0 2px 10px rgba(0,0,0,0.3);
→ 适合白色文字在图片上

### 文字截断（单行）
white-space:nowrap;overflow:hidden;text-overflow:ellipsis;

### 文字截断（多行）
display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;
→ line-clamp:2 表示最多显示 2 行

### 首字放大
第一个字用 span 包裹：font-size:300%;float:left;line-height:1;margin-right:8px;font-weight:900;`,
};
