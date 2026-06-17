import type { KnowledgeItem } from "./types";

export const decorationsKnowledge: KnowledgeItem = {
  triggers: [
    "装饰", "点缀", "角标", "徽章", "丝带", "边框装饰", "分割线",
    "decoration", "badge", "ribbon", "divider", "角", "线条",
  ],
  priority: "important",
  category: "css-decorations",
  tokens: 500,
  content: `## 装饰元素技巧

### L 形角标（左上）
position:absolute;top:6%;left:6%;width:50px;height:3px;background:#667eea;border-radius:2px;
+ position:absolute;top:6%;left:6%;width:3px;height:50px;background:#667eea;border-radius:2px;

### L 形角标（右下）
position:absolute;bottom:6%;right:6%;width:50px;height:3px;background:#e94560;border-radius:2px;
+ position:absolute;bottom:6%;right:6%;width:3px;height:50px;background:#e94560;border-radius:2px;

### 顶部渐变条
position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,#667eea,#764ba2,#e94560);

### 底部渐变线（居中短）
position:absolute;bottom:12%;left:30%;right:30%;height:3px;background:linear-gradient(90deg,transparent,#667eea,transparent);border-radius:2px;

### 圆形徽章 / NEW 标签
position:absolute;top:-15px;right:-15px;width:80px;height:80px;background:linear-gradient(135deg,#e94560,#ff6b6b);border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:40px;font-weight:900;box-shadow:0 4px 15px rgba(233,69,96,0.4);

### 角标丝带（右上角三角）
position:absolute;top:0;right:0;width:0;height:0;border-top:80px solid #e94560;border-left:80px solid transparent;
→ 右上角出现一个三角形色块

### 分割线（带文字）
display:flex;align-items:center;gap:20px;
左线：flex:1;height:1px;background:rgba(255,255,255,0.2);
文字：font-size:60px;color:rgba(255,255,255,0.5);
右线：flex:1;height:1px;background:rgba(255,255,255,0.2);

### 点阵装饰
position:absolute;top:10%;right:10%;width:120px;height:120px;background-image:radial-gradient(circle,rgba(255,255,255,0.08) 2px,transparent 2px);background-size:15px 15px;

### 装饰圆环
position:absolute;top:15%;right:15%;width:200px;height:200px;border:3px solid rgba(102,126,234,0.2);border-radius:50%;
+ 同心缩小：width:150px;height:150px;border:2px solid rgba(102,126,234,0.15);`,
};
