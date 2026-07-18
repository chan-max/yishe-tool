import assert from "node:assert/strict";
import {
  applyCanvasBaseFontSize,
  inferCanvasTypographyDensity,
  recommendCanvasBaseFontSize,
  resolveCanvasBaseFontSize,
} from "../src/operations/canvas-typography.ts";

assert.equal(recommendCanvasBaseFontSize(1080, 1350, "px", "balanced"), 17);
assert.equal(recommendCanvasBaseFontSize(3000, 3000, "px", "dense"), 36);
assert.equal(recommendCanvasBaseFontSize(5000, 7000, "px", "display"), 100);
assert.equal(recommendCanvasBaseFontSize(10, 10, "cm", "balanced"), 12);
assert.equal(recommendCanvasBaseFontSize(20000, 20000, "px", "balanced"), 160);

assert.equal(inferCanvasTypographyDensity("兰亭序全文碑帖鼠标垫"), "dense");
assert.equal(inferCanvasTypographyDensity("单个书法艺术字，大留白"), "display");
assert.equal(inferCanvasTypographyDensity("小红书咖啡新品海报"), "balanced");

assert.equal(resolveCanvasBaseFontSize(3000, 3000, "px", "dense", 42.4), 42);
assert.equal(resolveCanvasBaseFontSize(3000, 3000, "px", "dense", 999), 500);

const canvas = {
  id: "canvas",
  type: "canvas",
  fontSize: { value: 32, unit: "px" },
};
const context = {
  getCanvasChildren: () => [canvas],
  setChildProperty: (_id, _path, value) => {
    canvas.fontSize = value;
  },
};
const applied = applyCanvasBaseFontSize(context, {
  width: 3000,
  height: 1500,
  density: "dense",
});
assert.equal(applied.baseFontSize, 18);
assert.deepEqual(canvas.fontSize, { value: 18, unit: "px" });

console.log("canvas typography tests passed");
