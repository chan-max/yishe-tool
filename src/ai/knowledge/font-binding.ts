import type { KnowledgeItem } from "./types";

export const fontBindingKnowledge: KnowledgeItem = {
  triggers: ["字体", "font", "font-family", "绑定", "搜索字体", "resource.searchFont"],

  content: `## 字体绑定方式

### 直接使用（固定字体）
1. resource.searchFont({ query: "艺术" })  → 获取字体列表
2. canvas.addChild({ type: "html", htmlContent: "<div style='font-family:{{font.brand.family}};font-size:200px;color:#fff;'>文字</div>", htmlBindings: { font: { brand: { id:"搜到的id", url:"搜到的url", name:"搜到的name" } } } })

### 模板变量（用户可选字体）
触发条件：用户说"模板"、"可选"、"可更换"、"让用户选"

1. resource.searchFont({ query: "简约" })
2. canvas.addChild({
    htmlContent: "<div style='font-family:{{font.brand.family}}'>...</div>",
    htmlBindings: { font: { brand: { id, url, name } } },    ← 必须绑定默认值
    htmlTemplateFields: [{ key: "font.brand", type: "font", label: "标题字体" }]
  })

### 规则
- 做模板时 htmlBindings 必须绑定搜到的字体，禁止绑 null
- HTML 中用 {{font.xxx.family}} 引用，不是 font-family: "字体名"`,
};
