# 设计技巧知识库

AI 设计助手会自动加载此目录下的所有 `.md` 文件作为设计知识。

## 目录结构

- `effects/` — 视觉效果（发光、阴影、模糊、光效等）
- `text/` — 文字特效（渐变字、描边、镂空、立体字等）
- `patterns/` — 图案纹理（条纹、波点、网格、几何图案等）
- `techniques/` — CSS 基础技巧（flex、position、gradient、transform 等）
- `shapes/` — CSS 形状技巧（clip-path、conic-gradient 等）
- `cases/` — 完整设计案例

这些 markdown 会通过 `src/ai/knowledge/design-tips-loader.ts` 自动加载，并由
`src/ai/knowledge/registry.ts` 统一注册到 agent skills。

如果是字体绑定、图片绑定、htmlBindings、保存流程这类强规则，请放到
`src/ai/knowledge/*.ts`，不要只写在 markdown 里。

## 文件格式

每个 `.md` 文件使用 frontmatter + 正文：

~~~
---
title: 效果名称
triggers: 触发词1, 触发词2, 触发词3
priority: core | important | optional
---

### 效果说明
一句话描述这个效果适合什么场景。

### 代码
(完整的 HTML 代码片段，可直接复制使用)

### 使用技巧
- 注意事项
- 搭配建议
~~~

## 优先级说明

- `core` — 始终注入（适合最基础、最常用的技巧）
- `important` — 触发词匹配时注入（适合中等频率的技巧）
- `optional` — 仅在高度匹配时注入（适合冷门技巧）

## 编写建议

1. 每个文件聚焦一类效果（2-4 个相关技巧）
2. triggers 写用户可能说的关键词，中英文都要
3. 代码片段必须是完整的 `<div style="...">` 格式
4. 默认用一个完整 HTML 片段表达整个效果，不要拆成多个全屏片段
5. 禁止使用纯黑 #000 和纯白 #fff
6. 外部图片和字体必须通过 htmlBindings 魔术变量引用，不要把 URL 直接写进 HTML
