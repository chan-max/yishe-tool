import type { KnowledgeItem } from "./types";

export const imageBindingKnowledge: KnowledgeItem = {
  triggers: ["图片", "image", "贴图", "素材", "图库", "resource.searchImage", "addImage", "背景图"],

  content: `## 图片搜索与绑定

### 搜索
resource.searchImage({ query: "猫" })
返回 [{ id, name, url, keywords, colorPalette, width, height, isCutout }]
- colorPalette 字段可帮助匹配设计配色
- isCutout:true 的素材无背景，适合叠加

### 推荐方式：HTML background-image（搜索结果里直接有用法模板）
搜索结果的 message 字段包含完整的 canvas.addHtml 调用示例，直接复制使用即可。

核心格式：
canvas.addHtml({
  htmlContent: "<div style='width:100%;height:100%;background-image:url({{image.bg.url}});background-size:cover;background-position:center;'></div>",
  htmlBindings: { image: { bg: { id:"搜到的id", url:"搜到的url", name:"搜到的name" } } }
})

### 图片上叠加文字
canvas.addHtml({
  htmlContent: "<div style='width:100%;height:100%;position:relative;background-image:url({{image.bg.url}});background-size:cover;'><div style='position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0.1),rgba(0,0,0,0.6));'></div><div style='position:absolute;bottom:15%;left:8%;font-size:280px;font-weight:900;color:#fff;'>标题</div></div>",
  htmlBindings: { image: { bg: { id, url, name } } }
})

### 多张图片
htmlBindings: { image: { bg: { id, url, name }, logo: { id, url, name } } }
HTML 中分别用 {{image.bg.url}} 和 {{image.logo.url}} 引用

### 模板变量（用户可选图片）
用户说"模板"、"可选"时，加 htmlTemplateFields：
htmlTemplateFields: [{ key: "image.bg", type: "image", label: "背景图" }]

### 规则
- htmlBindings 必须绑定搜到的图片对象（含 id/url/name），禁止绑 null
- 搜索关键词简短精准（"猫咪"、"风景"、"科技"），不要长句
- 不要重复搜索同一关键词，系统自动缓存 5 分钟
- 优先用 background-image 方式，比 addImage 更灵活`,
};
