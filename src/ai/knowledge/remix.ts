import type { KnowledgeItem } from "./types";

export const remixKnowledge: KnowledgeItem = {
  triggers: ["参考", "参考图库", "参考贴纸", "基于", "改一个", "混搭", "结合", "组合", "remix", "借鉴", "参考之前的"],

  content: `## 参考图库贴纸进行设计

### 工作流

1. resource.searchImage({ query: "关键词", isCustom: true }) → 搜索可编辑的贴纸
2. canvas.loadSticker({ stickerId: "贴纸ID" }) → 加载贴纸设计到画布
3. canvas.getState → 查看元素结构（配色、布局、字体等）
4. 参考元素后，用 element.setXxx 修改或 canvas.addHtml 新增元素

### 多贴纸混搭

1. resource.searchImage({ query: "关键词A" }) + canvas.loadSticker({ stickerId: "A的ID" })
2. canvas.getState → 记住配色/布局 ✅
3. canvas.clear()
4. resource.searchImage({ query: "关键词B" }) + canvas.loadSticker({ stickerId: "B的ID" })
5. canvas.getState → 记住另一个方案的字体/装饰 ✅
6. canvas.clear()
7. 综合两个贴纸的优点，创建新设计（从配色A + 布局B + 字体C）
8. canvas.addHtml(...)  创建合并后的新设计

### 注意
- resource.searchImage 返回的 isCustom=true 的贴纸才能加载元素树
- canvas.getState 是"记忆"设计方案的唯一方式——加载后立即查看，记下关键参数
- 创建新设计时先 canvas.clear 清空再开始`,
};
