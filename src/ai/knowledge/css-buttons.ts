import type { KnowledgeItem } from "./types";

export const buttonsKnowledge: KnowledgeItem = {
  triggers: [
    "按钮", "button", "CTA", "行动", "点击", "操作",
  ],
  priority: "optional",
  category: "css-buttons",
  tokens: 350,
  content: `## 按钮样式

### 渐变胶囊按钮
display:inline-block;padding:16px 50px;background:linear-gradient(135deg,#667eea,#764ba2);border-radius:999px;color:#fff;font-size:80px;font-weight:700;box-shadow:0 4px 15px rgba(102,126,234,0.4);

### 幽灵按钮（透明边框）
display:inline-block;padding:14px 40px;background:transparent;border:2px solid rgba(255,255,255,0.5);border-radius:999px;color:#fff;font-size:70px;font-weight:600;

### 实心方角按钮
display:inline-block;padding:18px 50px;background:#e94560;border-radius:12px;color:#fff;font-size:80px;font-weight:700;box-shadow:0 4px 12px rgba(233,69,96,0.3);

### 图标 + 文字按钮
display:inline-flex;align-items:center;gap:12px;padding:14px 36px;background:rgba(255,255,255,0.15);backdrop-filter:blur(10px);border-radius:999px;border:1px solid rgba(255,255,255,0.2);
图标 div：width:36px;height:36px;background:#fff;border-radius:50%;
文字：color:#fff;font-size:60px;font-weight:600;

### 按钮组
display:flex;gap:16px;align-items:center;
主按钮：padding:16px 40px;background:linear-gradient(135deg,#667eea,#764ba2);border-radius:999px;color:#fff;font-weight:700;
次按钮：padding:16px 40px;background:transparent;border:2px solid rgba(255,255,255,0.4);border-radius:999px;color:#fff;

### 小标签按钮
display:inline-block;padding:6px 18px;background:rgba(102,126,234,0.15);border-radius:999px;color:#667eea;font-size:45px;font-weight:600;`,
};
