import type { KnowledgeItem } from "./types";

export const htmlElementsKnowledge: KnowledgeItem = {
  triggers: ["html", "添加", "创建", "设计", "元素", "背景", "标题", "卡片", "按钮", "矩形", "圆"],

  content: `## HTML 写法速查

**标题文字：**
<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;background:#1a1a2e;"><div style="font-size:280px;font-weight:900;color:#fff;line-height:1;">标题</div></div>

**渐变背景：**
<div style="width:100%;height:100%;background:linear-gradient(135deg,#667eea,#764ba2);border-radius:20px;"></div>

**卡片布局：**
<div style="width:100%;height:100%;background:#fff;border-radius:20px;box-shadow:0 20px 60px rgba(0,0,0,0.15);padding:40px;box-sizing:border-box;"><div style="font-size:180px;font-weight:700;color:#2C3E50;">标题</div></div>

**图标+文字：**
<div style="display:flex;align-items:center;gap:20px;width:100%;height:100%;background:#f8f9fa;border-radius:12px;padding:30px;box-sizing:border-box;"><div style="width:120px;height:120px;background:#4A90D9;border-radius:50%;"></div><div style="font-size:140px;font-weight:700;color:#2C3E50;">文字</div></div>

**图片（用 css background-image）：**
<div style="width:100%;height:100%;background-image:url(图片URL);background-size:cover;background-position:center;"></div>

**规则：**
- 所有 HTML 元素默认宽高 100%，自动填充画布
- display:flex 居中对齐是最常用模式
- 用 box-sizing:border-box 确保 padding 不影响尺寸`,
};
