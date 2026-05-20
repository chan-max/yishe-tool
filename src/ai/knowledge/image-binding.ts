import type { KnowledgeItem } from "./types";

export const imageBindingKnowledge: KnowledgeItem = {
  triggers: ["图片", "image", "贴图", "素材", "图库", "resource.searchImage", "addImage", "背景图"],

  content: `## 图片 / 素材库用法

### 搜索素材库
resource.searchImage({ query: "猫" })
参数: query(必填), limit(默认5), isCustom(仅系统贴纸), isCutout(仅抠图)

### 方式1：直接按 URL 添加（最简单）
canvas.addImage({ imageUrl: "搜到的url" })
→ 适用：普通图片、已有素材

### 方式2：HTML img 标签
canvas.addChild({ type: "html", htmlContent: "<img src='{{image.logo.url}}' style='width:100%;height:100%;object-fit:cover;'/>", htmlBindings: { image: { logo: { id, url, name } } } })
→ 适用：需要精确控制尺寸和位置的图片

### 方式3：HTML background-image
canvas.addChild({ type: "html", htmlContent: "<div style='width:100%;height:100%;background-image:url({{image.bg.url}});background-size:cover;'></div>", htmlBindings: { image: { bg: { id, url, name } } } })
→ 适用：图片做背景

### 模板变量（用户可选图片）
触发条件：用户说"模板"、"可选"、"可更换"

1. resource.searchImage({ query: "xxx" })
2. canvas.addChild({ htmlContent: "...{{image.xxx.url}}...", htmlBindings: { image: { xxx: { id, url, name } } }, htmlTemplateFields: [{ key: "image.xxx", type: "image", label: "图片" }] })

### 规则
- 做模板时 htmlBindings 必须绑定搜到的图片，禁止绑 null
- 搜索关键词要简短精准（"猫咪"、"风景"、"科技"），不要长句
- 不要重复搜索同一关键词，系统自动缓存 5 分钟`,
};
