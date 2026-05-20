import type { KnowledgeItem } from "./types";

export const templateModeKnowledge: KnowledgeItem = {
  triggers: ["模板", "可选", "可更换", "可配置", "让用户选", "template", "configurable", "变量", "替换"],

  content: `## 模板变量模式

当用户要求做"模板"或"可更换"的设计时，使用 htmlTemplateFields：

### 可更换字体
canvas.addChild({
  htmlContent: "<div style='font-family:{{font.brand.family}};...'>", 
  htmlBindings: { font: { brand: { id, url, name } } },
  htmlTemplateFields: [{ key: "font.brand", type: "font", label: "标题字体" }]
})

### 可更换图片
canvas.addChild({
  htmlContent: "<img src='{{image.logo.url}}'/>",
  htmlBindings: { image: { logo: { id, url, name } } },
  htmlTemplateFields: [{ key: "image.logo", type: "image", label: "Logo" }]
})

### 可编辑文字
canvas.addChild({
  htmlContent: "{{text.title}}",
  htmlTemplateFields: [{ key: "text.title", type: "text", label: "标题文字", defaultValue: "默认标题" }]
})

### htmlTemplateFields 字段说明
- key: 变量路径，与 htmlContent 中的 {{key}} 对应
- type: "font" | "image" | "text" | "color" | "number"
- label: 显示给用户的名称
- defaultValue: 对 text/number/color 类型设置默认值

### 规则
- 做模板时 htmlBindings 必须绑定搜到的实际资源，禁止绑 null
- 每个可替换的字段都要在 htmlTemplateFields 中声明
- 模板创建后，用户在 UI 中可以直接替换字体/图片`,
};
