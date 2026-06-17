import type { KnowledgeItem } from "./types";

export const fontBindingKnowledge: KnowledgeItem = {
  triggers: ["字体", "font", "font-family", "绑定", "搜索字体", "resource.searchFont"],

  content: `## 字体搜索与绑定

### 搜索
resource.searchFont({ query: "艺术" })  → 返回 [{ id, name, url, category, keywords }]
- 支持 category 过滤：resource.searchFont({ query: "标题", category: "标题字" })
- 返回结果中 category 字段显示字体分类（标题字/正文字/手写体等）

### 绑定使用（搜索结果里直接有用法模板）
搜索结果的 message 字段包含完整的 canvas.addHtml 调用示例，直接复制使用即可。

核心格式：
canvas.addHtml({
  htmlContent: "<div style='font-family:{{font.brand.family}};font-size:200px;color:#fff;'>文字</div>",
  htmlBindings: { font: { brand: { id:"搜到的id", url:"搜到的url", name:"搜到的name" } } }
})

### 多字体
标题 + 正文用不同字体：
htmlBindings: { font: { title: { id, url, name }, body: { id, url, name } } }
HTML 中：font-family:{{font.title.family}}, {{font.body.family}}, serif

### 模板变量（用户可选字体）
用户说"模板"、"可选"时，加 htmlTemplateFields：
htmlTemplateFields: [{ key: "font.brand", type: "font", label: "标题字体" }]

### 规则
- htmlBindings 必须绑定搜到的字体对象（含 id/url/name），禁止绑 null
- HTML 中用 {{font.xxx.family}} 引用，不是 font-family: "字体名"
- key 名自定义（如 brand/title/body），但要和 {{font.xxx.family}} 对应`,
};
