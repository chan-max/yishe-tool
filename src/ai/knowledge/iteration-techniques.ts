import type { KnowledgeItem } from "./types";

export const iterationTechniquesKnowledge: KnowledgeItem = {
  triggers: [
    "优化", "改进", "调整", "美化", "提升", "迭代", "修改", "完善",
    "不好看", "太简单", "太素", "太单调", "加点", "再好一点",
    "好看一点", "精致", "质感", "高级",
  ],
  priority: "important",
  category: "iteration-techniques",
  tokens: 500,
  content: `## 迭代优化技巧

### 1. 加阴影提升质感
在容器上加 box-shadow，立刻有层次感：
box-shadow: 0 4px 20px rgba(0,0,0,0.08);  /* 轻微 */
box-shadow: 0 8px 32px rgba(0,0,0,0.12);  /* 中等 */
box-shadow: 0 20px 60px rgba(0,0,0,0.2);  /* 强烈 */

### 2. 加装饰线/角标
用绝对定位加几何装饰：
- 顶部彩色线条：position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,#667eea,#764ba2);
- 角标 L 形：position:absolute;top:8%;left:8%;width:40px;height:3px;background:#fff; + width:3px;height:40px;
- 底部渐变条：position:absolute;bottom:0;left:20%;right:20%;height:3px;background:linear-gradient(90deg,transparent,#667eea,transparent);

### 3. 调整间距呼吸感
- 文字太挤？加 line-height:1.2-1.6
- 元素太近？加 gap:20-40px 或 margin
- 边缘太贴？加 padding:5-10%
- 卡片内容挤？padding 从 20px 增到 40-60px

### 4. 增强对比度
- 浅色背景 + 深色文字（#f8f9fa + #1a1a2e）
- 深色背景 + 浅色文字（#1a1a2e + #ffffff）
- 彩色背景 + 白色文字（确保背景亮度 < 50%）
- 重点文字用强调色（#e94560, #667eea）

### 5. 加渐变叠加层
在纯色背景上加半透明渐变增加深度：
background: linear-gradient(135deg,rgba(102,126,234,0.1),rgba(118,75,162,0.05));
或加径向光晕：
background: radial-gradient(circle at 30% 30%,rgba(102,126,234,0.15),transparent 60%);

### 6. 圆角柔化
- 小卡片：border-radius:12-16px
- 大卡片：border-radius:20-24px
- 胶囊按钮：border-radius:999px
- 圆形：border-radius:50%

### 7. 文字发光/渐变
- 霓虹发光：text-shadow:0 0 10px #00d4ff,0 0 20px #00d4ff,0 0 40px #00d4ff;
- 渐变文字：background:linear-gradient(135deg,#667eea,#764ba2);-webkit-background-clip:text;-webkit-text-fill-color:transparent;
- 文字阴影：text-shadow:0 2px 4px rgba(0,0,0,0.3);

### 8. 加纹理/图案
- 点阵：background-image:radial-gradient(circle,rgba(255,255,255,0.05) 1px,transparent 1px);background-size:20px 20px;
- 条纹：background-image:repeating-linear-gradient(45deg,transparent,transparent 10px,rgba(255,255,255,0.03) 10px,rgba(255,255,255,0.03) 20px);`,
};
