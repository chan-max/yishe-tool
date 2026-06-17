import type { KnowledgeItem } from "./types";

export const glassEffectsKnowledge: KnowledgeItem = {
  triggers: [
    "毛玻璃", "玻璃", "glass", "透明", "半透明", "模糊", "blur",
    "磨砂", "通透", "质感", "高级感", "现代感", "科技感",
  ],
  priority: "important",
  category: "css-effects",
  tokens: 400,
  content: `## 毛玻璃 / 玻璃效果

### 玻璃卡片
<div style="width:100%;height:100%;background:linear-gradient(135deg,#667eea,#764ba2);display:flex;align-items:center;justify-content:center;"><div style="width:70%;padding:50px;background:rgba(255,255,255,0.15);backdrop-filter:blur(20px);border-radius:24px;border:1px solid rgba(255,255,255,0.2);box-shadow:0 8px 32px rgba(0,0,0,0.1);"><div style="font-size:200px;font-weight:900;color:#fff;">标题</div><div style="font-size:80px;color:rgba(255,255,255,0.8);margin-top:12px;">描述文字</div></div></div>

### 玻璃导航栏
position:absolute;top:0;left:0;right:0;padding:20px 40px;background:rgba(255,255,255,0.1);backdrop-filter:blur(12px);border-bottom:1px solid rgba(255,255,255,0.1);

### 玻璃按钮
display:inline-block;padding:16px 40px;background:rgba(255,255,255,0.2);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.3);border-radius:999px;color:#fff;font-size:80px;font-weight:600;

### 关键属性
- backdrop-filter:blur(10-20px) — 背景模糊（核心）
- background:rgba(255,255,255,0.1-0.3) — 半透明白色
- border:1px solid rgba(255,255,255,0.1-0.3) — 玻璃边框
- box-shadow:0 8px 32px rgba(0,0,0,0.1) — 柔和阴影

### 使用场景
- 深色/渐变背景上的信息卡片
- 导航栏、工具栏
- 弹窗、对话框
- 按钮、标签

### 注意
- 必须有彩色或深色背景才有效果
- backdrop-filter 在部分旧浏览器不支持，设计工具内可用`,
};
