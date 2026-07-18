import assert from "node:assert/strict";
import {
  buildExecutionPlan,
  ensurePlanStep,
  getIncompleteDeliveryActions,
  getPlanProgress,
  settlePlanStep,
  shouldContinueAfterArtwork,
} from "../src/ai/agent/planning.ts";

function actions(prompt) {
  return (
    buildExecutionPlan(prompt).plan?.steps.map((step) => step.action) || []
  );
}

const posterPrompt =
  "创建一张 1080x1350 px 的小红书咖啡新品海报，使用纯 CSS 装饰。不要分析、保存或导出。";
const posterPlan = buildExecutionPlan(posterPrompt);
assert.deepEqual(actions(posterPrompt), [
  "canvas.clear",
  "canvas.setSize",
  "canvas.addHtml",
]);
assert.equal(posterPlan.explicitCanvasSize?.width, 1080);
assert.equal(posterPlan.explicitCanvasSize?.height, 1350);
assert.equal(posterPlan.typographyDensity, "balanced");
assert.equal(shouldContinueAfterArtwork(posterPrompt), false);

const calligraphyPlan = buildExecutionPlan(
  "创建一张 3000x1500 px 的兰亭序全文碑帖鼠标垫设计。",
);
assert.equal(calligraphyPlan.typographyDensity, "dense");
assert.deepEqual(
  calligraphyPlan.plan?.steps.map((step) => step.action),
  ["canvas.clear", "canvas.setSize", "canvas.addHtml"],
);
assert.equal(
  buildExecutionPlan("创建一张 3000x1500 px 的单字书法艺术字设计。")
    .typographyDensity,
  "display",
);

assert.deepEqual(actions("把画布基础字号调整为 40px。"), [
  "canvas.setBaseFontSize",
]);

assert.deepEqual(
  actions(
    "基于当前设计修改，保留 1080x1080 尺寸和现有素材，把价格移到右上角，不要清空画布。",
  ),
  ["canvas.setSize", "canvas.addHtml"],
);

assert.deepEqual(
  actions(
    "只分析当前 1080x1080 画布，不要修改、清空、保存或导出，请从视觉层级和可读性评分。",
  ),
  ["canvas.analyze"],
);

assert.deepEqual(actions("保存当前设计，不要修改画布。"), [
  "canvas.updateAndSaveSticker",
]);
assert.deepEqual(actions("导出当前设计，不要修改画布。"), ["canvas.exportPng"]);
assert.deepEqual(actions("把当前标题改成桂香入夜。"), ["canvas.addHtml"]);

assert.deepEqual(
  actions(
    "为 11oz 标准马克杯创建横向印花，从字体库搜索一款英文手写字体并实际使用。",
  ),
  ["canvas.clear", "canvas.smartSize", "resource.searchFont", "canvas.addHtml"],
);

assert.deepEqual(
  actions(
    "设计一款 3000×3000 px 的 T恤印花，先从素材库搜索飞蛾线稿并实际使用，完成后检查素材和文字，检查通过后保存。",
  ),
  [
    "canvas.clear",
    "canvas.setSize",
    "resource.searchSticker",
    "canvas.addHtml",
    "canvas.analyze",
    "canvas.updateAndSaveSticker",
  ],
);

assert.equal(buildExecutionPlan("请只回复一句话，不要修改画布。").plan, null);

const progressPlan = buildExecutionPlan(posterPrompt).plan;
assert.ok(progressPlan);
settlePlanStep(progressPlan, "canvas.clear", "done", "已清空");
settlePlanStep(progressPlan, "canvas.setSizeByPreset", "done", "尺寸已设置");
settlePlanStep(progressPlan, "canvas.addChild:html", "done", "作品已创建");
assert.deepEqual(getPlanProgress(progressPlan), {
  settled: 3,
  done: 3,
  failed: 0,
  total: 3,
});

const previousLength = progressPlan.steps.length;
ensurePlanStep(progressPlan, "resource.searchSticker", "搜索贴纸素材");
assert.equal(progressPlan.steps.length, previousLength + 1);
settlePlanStep(
  progressPlan,
  "resource.searchSticker",
  "failed",
  "没有找到素材",
);
assert.deepEqual(getPlanProgress(progressPlan), {
  settled: 4,
  done: 3,
  failed: 1,
  total: 4,
});

settlePlanStep(
  progressPlan,
  "resource.searchSticker",
  "done",
  "放宽条件后找到素材",
);
assert.deepEqual(getPlanProgress(progressPlan), {
  settled: 4,
  done: 4,
  failed: 0,
  total: 4,
});

const deliveryPlan = buildExecutionPlan("创建一款贴纸，完成后保存。").plan;
assert.ok(deliveryPlan);
assert.deepEqual(getIncompleteDeliveryActions(deliveryPlan), [
  "canvas.updateAndSaveSticker",
]);
settlePlanStep(
  deliveryPlan,
  "canvas.updateAndSaveSticker",
  "failed",
  "保存失败",
);
assert.deepEqual(getIncompleteDeliveryActions(deliveryPlan), [
  "canvas.updateAndSaveSticker",
]);
settlePlanStep(deliveryPlan, "canvas.updateAndSaveSticker", "done", "保存成功");
assert.deepEqual(getIncompleteDeliveryActions(deliveryPlan), []);

console.log("agent planning tests passed");
