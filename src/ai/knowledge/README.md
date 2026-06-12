# Tool Agent Skills

`src/ai/knowledge` 是 tool agent 的本地 skills/知识层。

这里放和 agent 生成设计强相关、需要进入提示词选择链路的能力规则。WebSocket 只负责状态同步和远程操控，不承载这些能力。

## 目录分工

- `registry.ts`：统一注册入口，汇总内置知识和 markdown 技巧。
- `index.ts`：根据用户输入做触发词匹配和 token 预算控制。
- `font-binding.ts`：字体搜索、字体绑定、`{{font.xxx.family}}` 使用规则。
- `image-binding.ts`：图片搜索、图片绑定、`{{image.xxx.url}}` 使用规则。
- `html-elements.ts`：HTML 元素基础写法。
- `design-rules.ts`：稳定的核心设计规则。
- `style-templates.ts`：风格、布局、常见错误、字体搭配。
- `custom-specs.ts`：和具体元素类型有关的补充规则。
- `design-tips-loader.ts`：自动加载 `src/design-tips/**/*.md`。

## 新增小 skill 放哪里

优先放 `src/design-tips`：

- CSS 技巧
- 文字特效
- 背景/纹理
- 阴影/发光/毛玻璃
- 形状和布局片段
- 具体设计案例

使用 TS 文件：

- 规则需要强约束，例如 htmlBindings 不允许裸 URL
- 规则跨很多场景都要生效
- 需要和工具调用、资源搜索、保存流程绑定

## 编写原则

- 每个 skill 只解决一个明确问题。
- `triggers` 写用户自然会说的话，中英文都可以。
- `priority: core` 慎用，会更频繁进入提示词。
- 外部图片和字体必须通过 `htmlBindings`，不能直接写 URL 到 `htmlContent`。
- 一幅 HTML 作品默认保持单片段，避免多个全屏 HTML 互相遮挡。

