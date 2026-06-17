import type { KnowledgeItem } from "./types";

export const advancedCompositionsKnowledge: KnowledgeItem = {
  triggers: [
    "分栏", "左右布局", "上下布局", "统计数据", "feature",
    "特性展示", "数据展示", "数字", "统计", "stats", "数据面板",
  ],
  priority: "important",
  category: "css-compositions",
  tokens: 500,
  content: `## 高级组合布局

### 统计数据面板
<div style="width:100%;height:100%;background:#0a0e27;display:flex;align-items:center;justify-content:center;gap:40px;padding:5%;box-sizing:border-box;"><div style="text-align:center;flex:1;"><div style="font-size:280px;font-weight:900;color:#667eea;line-height:1;">1,234</div><div style="font-size:60px;color:#92A8D1;margin-top:12px;">用户数</div></div><div style="width:1px;height:200px;background:rgba(255,255,255,0.1);"></div><div style="text-align:center;flex:1;"><div style="font-size:280px;font-weight:900;color:#e94560;line-height:1;">98%</div><div style="font-size:60px;color:#92A8D1;margin-top:12px;">满意度</div></div><div style="width:1px;height:200px;background:rgba(255,255,255,0.1);"></div><div style="text-align:center;flex:1;"><div style="font-size:280px;font-weight:900;color:#2ecc71;line-height:1;">50K</div><div style="font-size:60px;color:#92A8D1;margin-top:12px;">下载量</div></div></div>

### Feature 特性展示（左图右文）
<div style="width:100%;height:100%;display:flex;background:#f8f9fa;"><div style="flex:1;background:linear-gradient(135deg,#667eea,#764ba2);display:flex;align-items:center;justify-content:center;"><div style="font-size:200px;color:rgba(255,255,255,0.2);font-weight:900;">01</div></div><div style="flex:1;display:flex;flex-direction:column;justify-content:center;padding:8%;"><div style="font-size:60px;color:#667eea;font-weight:700;letter-spacing:4px;text-transform:uppercase;">Feature</div><div style="font-size:160px;font-weight:900;color:#1a1a2e;margin-top:12px;line-height:1.1;">特性标题</div><div style="font-size:70px;color:#7F8C8D;margin-top:16px;line-height:1.6;">特性描述文字放在这里，可以写两到三行。</div></div></div>

### 垂直时间线
display:flex;flex-direction:column;gap:30px;padding:8% 10%;box-sizing:border-box;
每个节点：display:flex;align-items:flex-start;gap:20px;
左侧圆点：width:24px;height:24px;background:#667eea;border-radius:50%;flex-shrink:0;margin-top:4px;
左侧连线：position:absolute;left:11px;top:28px;bottom:-30px;width:2px;background:rgba(102,126,234,0.3);
右侧内容：flex:1;

### 引用卡片
<div style="width:100%;height:100%;background:#1a1a2e;display:flex;align-items:center;justify-content:center;padding:8%;box-sizing:border-box;"><div style="max-width:80%;position:relative;"><div style="font-size:300px;color:rgba(102,126,234,0.2);font-weight:900;line-height:1;position:absolute;top:-60px;left:-20px;">"</div><div style="font-size:120px;color:rgba(255,255,255,0.9);line-height:1.6;font-style:italic;position:relative;z-index:1;">这是一段引用文字，展示在深色背景上。</div><div style="margin-top:30px;font-size:70px;color:#667eea;font-weight:600;">—— 作者名</div></div></div>`,
};
