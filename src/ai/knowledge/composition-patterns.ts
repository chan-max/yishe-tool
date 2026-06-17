import type { KnowledgeItem } from "./types";

export const compositionPatternsKnowledge: KnowledgeItem = {
  triggers: [
    "设计", "海报", "名片", "banner", "封面", "标签", "贴纸", "卡片",
    "背景", "标题", "排版", "布局", "构图", "好看", "美观", "制作",
    "做一个", "画一个", "创建", "生成", "设计一个",
  ],
  priority: "core",
  category: "composition-patterns",
  tokens: 800,
  content: `## 组合布局模式（完整 HTML 示例）

### Hero 全屏标题
渐变背景 + 大标题 + 副标题 + 装饰线
<div style="width:100%;height:100%;background:linear-gradient(135deg,#0a0e27 0%,#1a1a2e 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;overflow:hidden;"><div style="position:absolute;top:15%;left:10%;width:200px;height:200px;background:radial-gradient(circle,rgba(102,126,234,0.3),transparent);border-radius:50%;"></div><div style="position:absolute;bottom:20%;right:10%;width:300px;height:300px;background:radial-gradient(circle,rgba(118,75,162,0.2),transparent);border-radius:50%;"></div><div style="width:120px;height:4px;background:linear-gradient(90deg,#667eea,#764ba2);margin-bottom:40px;border-radius:2px;"></div><div style="font-size:320px;font-weight:900;color:#fff;line-height:1;letter-spacing:-8px;">标题</div><div style="font-size:120px;color:#92A8D1;margin-top:20px;letter-spacing:20px;">SUBTITLE</div><div style="width:80px;height:4px;background:#e94560;margin-top:40px;border-radius:2px;"></div></div>

### 图文叠加（背景图 + 遮罩 + 文字）
<div style="width:100%;height:100%;position:relative;"><div style="position:absolute;inset:0;background:linear-gradient(135deg,#667eea,#764ba2);"></div><div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0.1) 0%,rgba(0,0,0,0.6) 100%);"></div><div style="position:absolute;bottom:15%;left:8%;right:8%;"><div style="font-size:280px;font-weight:900;color:#fff;line-height:1;">标题</div><div style="font-size:100px;color:rgba(255,255,255,0.8);margin-top:16px;">描述文字放在这里</div></div></div>

### 左右分栏
<div style="width:100%;height:100%;display:flex;background:#f8f9fa;"><div style="flex:1;display:flex;flex-direction:column;justify-content:center;padding:8%;"><div style="font-size:240px;font-weight:900;color:#1a1a2e;line-height:1;">标题</div><div style="font-size:100px;color:#7F8C8D;margin-top:20px;line-height:1.6;">描述文字内容</div></div><div style="flex:1;background:linear-gradient(135deg,#667eea,#764ba2);display:flex;align-items:center;justify-content:center;"><div style="font-size:200px;color:rgba(255,255,255,0.3);font-weight:900;">IMG</div></div></div>

### 卡片网格
<div style="width:100%;height:100%;background:#f0f2f5;display:grid;grid-template-columns:1fr 1fr;gap:30px;padding:6%;box-sizing:border-box;"><div style="background:#fff;border-radius:20px;padding:40px;box-shadow:0 4px 20px rgba(0,0,0,0.08);display:flex;flex-direction:column;justify-content:center;"><div style="font-size:80px;font-weight:800;color:#1a1a2e;">卡片 1</div><div style="font-size:50px;color:#7F8C8D;margin-top:10px;">描述</div></div><div style="background:#fff;border-radius:20px;padding:40px;box-shadow:0 4px 20px rgba(0,0,0,0.08);display:flex;flex-direction:column;justify-content:center;"><div style="font-size:80px;font-weight:800;color:#1a1a2e;">卡片 2</div><div style="font-size:50px;color:#7F8C8D;margin-top:10px;">描述</div></div><div style="background:#fff;border-radius:20px;padding:40px;box-shadow:0 4px 20px rgba(0,0,0,0.08);display:flex;flex-direction:column;justify-content:center;"><div style="font-size:80px;font-weight:800;color:#1a1a2e;">卡片 3</div><div style="font-size:50px;color:#7F8C8D;margin-top:10px;">描述</div></div><div style="background:#fff;border-radius:20px;padding:40px;box-shadow:0 4px 20px rgba(0,0,0,0.08);display:flex;flex-direction:column;justify-content:center;"><div style="font-size:80px;font-weight:800;color:#1a1a2e;">卡片 4</div><div style="font-size:50px;color:#7F8C8D;margin-top:10px;">描述</div></div></div>

### 角标徽章
<div style="width:100%;height:100%;background:#1a1a2e;display:flex;align-items:center;justify-content:center;position:relative;"><div style="background:#fff;border-radius:24px;padding:60px;box-shadow:0 20px 60px rgba(0,0,0,0.3);width:70%;box-sizing:border-box;position:relative;"><div style="position:absolute;top:-20px;right:-20px;background:linear-gradient(135deg,#e94560,#ff6b6b);color:#fff;font-size:60px;font-weight:900;padding:16px 30px;border-radius:50%;box-shadow:0 4px 15px rgba(233,69,96,0.4);">NEW</div><div style="font-size:180px;font-weight:700;color:#1a1a2e;">标题</div><div style="font-size:80px;color:#7F8C8D;margin-top:10px;">内容描述</div></div></div>

### 多层叠加装饰
<div style="width:100%;height:100%;background:#0a0e27;position:relative;overflow:hidden;"><div style="position:absolute;top:-20%;right:-20%;width:60%;height:60%;background:radial-gradient(circle,rgba(102,126,234,0.15),transparent);border-radius:50%;"></div><div style="position:absolute;bottom:-30%;left:-10%;width:50%;height:50%;background:radial-gradient(circle,rgba(233,69,96,0.1),transparent);border-radius:50%;"></div><div style="position:absolute;top:8%;left:8%;width:60px;height:4px;background:#667eea;border-radius:2px;"></div><div style="position:absolute;top:8%;left:8%;width:4px;height:60px;background:#667eea;border-radius:2px;"></div><div style="position:absolute;bottom:8%;right:8%;width:60px;height:4px;background:#e94560;border-radius:2px;"></div><div style="position:absolute;bottom:8%;right:8%;width:4px;height:60px;background:#e94560;border-radius:2px;"></div><div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;"><div style="font-size:280px;font-weight:900;color:#fff;line-height:1;">标题</div><div style="font-size:100px;color:#92A8D1;margin-top:16px;">副标题</div></div></div>

### 底部信息栏
<div style="width:100%;height:100%;background:linear-gradient(180deg,#1a1a2e 0%,#16213e 100%);position:relative;display:flex;flex-direction:column;justify-content:center;align-items:center;"><div style="font-size:300px;font-weight:900;color:#fff;line-height:1;">主标题</div><div style="font-size:100px;color:#92A8D1;margin-top:16px;">副标题</div><div style="position:absolute;bottom:0;left:0;right:0;background:rgba(255,255,255,0.05);backdrop-filter:blur(10px);padding:30px 60px;display:flex;justify-content:space-between;align-items:center;"><div style="font-size:60px;color:rgba(255,255,255,0.6);">品牌名</div><div style="font-size:60px;color:rgba(255,255,255,0.6);">2024</div></div></div>`,
};
