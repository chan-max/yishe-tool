import assert from "node:assert/strict";
import {
  buildImageSearchAttempts,
  simplifyImageSearchQuery,
} from "../src/ai/services/resource-search-strategy.ts";

assert.equal(
  simplifyImageSearchQuery("飞蛾 展开翅膀 线稿 复古 昆虫 moth wings line art"),
  "飞蛾 展开翅膀 线稿 昆虫",
);

const attempts = buildImageSearchAttempts({
  query: "飞蛾 展开翅膀 线稿 复古 昆虫 moth wings line art",
  limit: 6,
  searchMode: "vector",
  isCutout: true,
  aspectRatio: "1:1",
  minWidth: 500,
  minHeight: 500,
});

assert.deepEqual(
  attempts.map((attempt) => attempt.strategy),
  ["exact", "relaxed", "simplified", "broad"],
);
assert.equal(attempts[0].params.aspectRatio, "1:1");
assert.equal(attempts[1].params.aspectRatio, undefined);
assert.equal(attempts[1].params.isCutout, true);
assert.equal(attempts[2].params.query, "飞蛾 展开翅膀 线稿 昆虫");
assert.equal(attempts[3].params.isCutout, undefined);

console.log("resource search strategy tests passed");
