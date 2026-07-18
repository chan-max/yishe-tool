import assert from "node:assert/strict";
import {
  buildStickerRecordMeta,
  clearAgentDesignProvenance,
  getAgentDesignProvenance,
  recordAgentDesignPrompt,
  restoreAgentDesignProvenance,
} from "../src/ai/design-provenance.ts";

const canvas = {};
const originalPrompt = "创建一张咖啡贴纸\n主标题：桂香入夜";

recordAgentDesignPrompt(canvas, originalPrompt, "canvas.addHtml");
recordAgentDesignPrompt(
  canvas,
  "创建一张咖啡贴纸 主标题：桂香入夜",
  "element.setStyle",
);

let provenance = getAgentDesignProvenance(canvas);
assert.ok(provenance);
assert.equal(provenance.prompt, originalPrompt);
assert.equal(provenance.promptHistory.length, 1);
assert.deepEqual(provenance.promptHistory[0].tools, [
  "canvas.addHtml",
  "element.setStyle",
]);

const revisionPrompt = "把桂花金调亮，并增大价格信息";
recordAgentDesignPrompt(canvas, revisionPrompt, "element.setStyle");
provenance = getAgentDesignProvenance(canvas);

assert.ok(provenance);
assert.equal(provenance.prompt, originalPrompt);
assert.equal(provenance.promptHistory.length, 2);
assert.equal(provenance.promptHistory[1].prompt, revisionPrompt);

const canvasData = { width: 1080, height: 1350, children: [] };
const meta = buildStickerRecordMeta(canvasData, provenance);
assert.deepEqual(meta.data, canvasData);
assert.equal(meta.prompt, originalPrompt);
assert.equal(meta.source, "ai-agent");
assert.equal(meta.promptHistory.length, 2);

const restoredCanvas = {};
restoreAgentDesignProvenance(restoredCanvas, meta);
const restored = getAgentDesignProvenance(restoredCanvas);
assert.deepEqual(restored, provenance);

clearAgentDesignProvenance(restoredCanvas);
assert.equal(getAgentDesignProvenance(restoredCanvas), null);
assert.deepEqual(buildStickerRecordMeta(canvasData, null), {
  data: canvasData,
});

console.log("Agent provenance tests passed");
