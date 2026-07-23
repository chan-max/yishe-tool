<template>
  <a-modal
    v-model:open="showAutocreateModal"
    title="自动制作"
    width="560px"
    :footer="null"
    :destroy-on-close="false"
    centered
    :mask-closable="batchProgress.status === 'idle'"
  >
    <div v-if="batchProgress.status === 'idle'" class="auto-config">
      <div class="auto-config__row">
        <label>模式</label>
        <a-select
          v-model:value="config.taskPreset"
          class="auto-config__mode"
          size="small"
        >
          <a-select-option
            v-for="preset in automaticPresets"
            :key="preset.value"
            :value="preset.value"
          >
            {{ preset.label }}
          </a-select-option>
        </a-select>
        <a-select
          v-if="config.taskPreset === 'custom'"
          v-model:value="config.outputKind"
          class="auto-config__mode"
          size="small"
        >
          <a-select-option value="independent-batch">
            独立素材
          </a-select-option>
          <a-select-option value="group">组图套装</a-select-option>
        </a-select>
      </div>

      <div class="auto-config__field">
        <label>需求提示词</label>
        <a-textarea
          v-model:value="config.description"
          placeholder="例如：做一组 1024x1024 的咖啡猫咪贴纸，日系手账风，透明背景带白边，每张有不同姿态和一句短文案，合格后自动保存到素材库"
          :rows="6"
          size="small"
        />
      </div>

      <div class="auto-config__row">
        <label>{{ isGroupMode ? "套数" : "数量" }}</label>
        <a-input-number
          v-model:value="config.count"
          :min="1"
          :max="maxProductionCount"
          size="small"
        />
        <template v-if="isGroupMode">
          <label>每套成员</label>
          <a-input-number
            v-model:value="config.membersPerGroup"
            :min="2"
            :max="12"
            size="small"
          />
        </template>
      </div>

      <div v-if="config.taskPreset === 'custom'" class="auto-config__field">
        <label>附加约束</label>
        <a-input
          v-model:value="config.customInstructions"
          placeholder="例如：每套保持统一配色，成员构图必须不同"
          size="small"
        />
      </div>

      <a-checkbox v-model:checked="config.enableAnalysisOptimization">
        分析优化
      </a-checkbox>

      <button
        class="auto-btn auto-btn--primary"
        :disabled="!canStart"
        @click="handleStart"
      >
        开始制作
      </button>
    </div>

    <div
      v-else-if="
        batchProgress.status === 'running' ||
        batchProgress.status === 'paused' ||
        batchProgress.status === 'preparing'
      "
      class="auto-running"
    >
      <div class="auto-running__header">
        <div class="auto-running__bar">
          <div
            class="auto-running__fill"
            :style="{ width: progressPercent + '%' }"
          />
        </div>
        <span class="auto-running__count">
          {{ doneCount }} / {{ batchProgress.items.length }}
        </span>
      </div>

      <div class="auto-running__status">
        <template v-if="batchProgress.status === 'preparing'">
          <span class="dot dot--active" />
          <span>正在拆解生产 brief · 已运行 {{ elapsedText }}</span>
        </template>
        <template v-else-if="currentItem">
          <span class="dot dot--active" />
          <span
            >{{ currentItem.brief.title }} · {{ statusText(currentItem) }} · 已运行 {{ elapsedText }}</span
          >
          <span v-if="currentItem.score !== null" class="auto-running__score">
            {{ currentItem.score }}/10
          </span>
        </template>
      </div>

      <div class="auto-list">
        <div
          v-for="item in batchProgress.items"
          :key="item.index"
          class="auto-list__item"
          :class="`auto-list__item--${item.status}`"
        >
          <span class="auto-list__dot">
            <span v-if="item.status === 'done'" class="dot dot--done" />
            <span v-else-if="item.status === 'failed'" class="dot dot--fail" />
            <span v-else-if="item.status === 'skipped'" class="dot dot--skip" />
            <span
              v-else-if="item.status === 'pending'"
              class="dot dot--pending"
            />
            <span v-else class="dot dot--active" />
          </span>
          <span
            class="auto-list__text"
            :title="item.error || item.brief.prompt"
          >
            {{ item.brief.title }}
            <em v-if="item.revisionCount > 0">修订 {{ item.revisionCount }}</em>
          </span>
          <span v-if="item.score !== null" class="auto-list__score">
            {{ item.score }}
          </span>
          <span v-if="item.groupId" class="auto-list__group">组图</span>
        </div>
      </div>

      <div class="auto-controls">
        <template v-if="batchProgress.status === 'paused'">
          <button class="auto-btn auto-btn--primary" @click="handleResume">
            继续
          </button>
        </template>
        <template v-else-if="batchProgress.status === 'running'">
          <button class="auto-btn" @click="handlePause">暂停</button>
        </template>
        <button class="auto-btn auto-btn--danger" @click="handleStop">
          停止
        </button>
      </div>
    </div>

    <div v-else class="auto-done">
      <div class="auto-done__summary">
        <div class="auto-done__title">
          {{ batchProgress.status === "done" ? "全部完成" : "已停止" }}
        </div>
        <div class="auto-done__stats">
          <span class="auto-done__stat">
            <span class="dot dot--done" />
            成功 {{ successCount }}
          </span>
          <span v-if="skipCount > 0" class="auto-done__stat">
            <span class="dot dot--skip" />
            跳过 {{ skipCount }}
          </span>
          <span v-if="failCount > 0" class="auto-done__stat">
            <span class="dot dot--fail" />
            失败 {{ failCount }}
          </span>
          <span v-if="avgScore !== null" class="auto-done__stat">
            均分 {{ avgScore }}
          </span>
        </div>
        <div v-if="batchProgress.error" class="auto-done__error">
          {{ batchProgress.error }}
        </div>
      </div>

      <div class="auto-list">
        <div
          v-for="item in batchProgress.items"
          :key="item.index"
          class="auto-list__item"
          :class="`auto-list__item--${item.status}`"
        >
          <span class="auto-list__dot">
            <span v-if="item.status === 'done'" class="dot dot--done" />
            <span v-else-if="item.status === 'skipped'" class="dot dot--skip" />
            <span v-else class="dot dot--fail" />
          </span>
          <span
            class="auto-list__text"
            :title="item.error || item.savedUrl || item.brief.prompt"
          >
            {{ item.brief.title }}
          </span>
          <a
            v-if="item.savedUrl"
            class="auto-list__link"
            :href="item.savedUrl"
            target="_blank"
            >查看</a
          >
          <span v-if="item.score !== null" class="auto-list__score">
            {{ item.score }}
          </span>
          <span v-if="item.groupId" class="auto-list__group">组图</span>
        </div>
      </div>

      <button class="auto-btn auto-btn--primary" @click="handleReset">
        再来一批
      </button>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { reactive, computed, watch } from "vue";
import { useNow } from "@vueuse/core";
import { showAutocreateModal } from "./index";
import {
  batchProgress,
  startBatch,
  pauseBatch,
  resumeBatch,
  stopBatch,
  resetBatch,
} from "@/ai/agent/batch";
import type { AutoBatchConfig, BatchItem } from "@/ai/agent/batch";
import {
  AGENT_TASK_PRESETS,
  resolveAgentTaskSpec,
} from "@/ai/agent/task-spec";

const config = reactive<AutoBatchConfig>({
  description: "",
  count: 5,
  taskPreset: "standard",
  outputKind: "independent-batch",
  membersPerGroup: 2,
  customInstructions: "",
  enableAnalysisOptimization: false,
});
const automaticPresets = AGENT_TASK_PRESETS.filter((preset) =>
  ["standard", "batch", "group", "custom"].includes(preset.value),
);
const resolvedTask = computed(() =>
  resolveAgentTaskSpec(
    config.description,
    {
      preset: config.taskPreset,
      outputKind: config.outputKind,
      jobCount: config.count,
      memberCount: config.membersPerGroup,
      customInstructions: config.customInstructions,
    },
    { execution: "automatic" },
  ),
);
const isGroupMode = computed(
  () => resolvedTask.value.outputKind === "group",
);
const maxProductionCount = computed(() =>
  isGroupMode.value
    ? Math.max(1, Math.floor(100 / Number(config.membersPerGroup || 2)))
    : 100,
);
watch(maxProductionCount, (maxCount) => {
  if (Number(config.count || 1) > maxCount) {
    config.count = maxCount;
  }
});
const now = useNow({ interval: 1000 });
const elapsedText = computed(() => {
  if (!batchProgress.startedAt) return "0秒";
  const seconds = Math.max(
    0,
    Math.floor((now.value.getTime() - batchProgress.startedAt) / 1000),
  );
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return minutes > 0 ? `${minutes}分${rest}秒` : `${rest}秒`;
});

const currentItem = computed<BatchItem | null>(() => {
  if (
    batchProgress.current >= 0 &&
    batchProgress.current < batchProgress.items.length
  ) {
    return batchProgress.items[batchProgress.current];
  }
  return null;
});

const canStart = computed(() => Boolean((config.description || "").trim()));

const doneCount = computed(
  () =>
    batchProgress.items.filter((i) =>
      ["done", "failed", "skipped"].includes(i.status),
    ).length,
);

const successCount = computed(
  () => batchProgress.items.filter((i) => i.status === "done").length,
);

const failCount = computed(
  () => batchProgress.items.filter((i) => i.status === "failed").length,
);

const skipCount = computed(
  () => batchProgress.items.filter((i) => i.status === "skipped").length,
);

const progressPercent = computed(() => {
  if (batchProgress.items.length === 0) return 0;
  return Math.round((doneCount.value / batchProgress.items.length) * 100);
});

const avgScore = computed(() => {
  const scored = batchProgress.items.filter((i) => i.score !== null);
  if (scored.length === 0) return null;
  const sum = scored.reduce((acc, i) => acc + (i.score || 0), 0);
  return (sum / scored.length).toFixed(1);
});

function statusText(item: BatchItem): string {
  switch (item.status) {
    case "pending":
      return "等待中";
    case "designing":
      return "设计中";
    case "evaluating":
      return "评估中";
    case "revising":
      return "修订中";
    case "saving":
      return "保存中";
    case "grouping":
      return "创建组图";
    case "done":
      return "已完成";
    case "skipped":
      return "已跳过";
    case "failed":
      return item.error || "失败";
    default:
      return "";
  }
}

async function handleStart() {
  if (!canStart.value) return;
  await startBatch({ ...config });
}

function handlePause() {
  pauseBatch();
}
function handleResume() {
  resumeBatch();
}
function handleStop() {
  stopBatch();
}
function handleReset() {
  resetBatch();
}
</script>

<style lang="less" scoped>
@accent: #6c5ce7;
@accent-light: #a29bfe;
@text: #2d3436;
@text-secondary: #636e72;
@text-muted: #b2bec3;
@border: #dfe6e9;
@done: #00b894;
@fail: #d63031;
@skip: #b7791f;

.dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: @text-muted;
  flex-shrink: 0;

  &--active {
    background: @accent;
    animation: dot-pulse 1.2s ease-in-out infinite;
  }
  &--done {
    background: @done;
  }
  &--fail {
    background: @fail;
  }
  &--skip {
    background: @skip;
  }
  &--pending {
    background: @border;
  }
}

@keyframes dot-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

.auto-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  padding: 0 16px;
  border: 1px solid @border;
  border-radius: 4px;
  background: #fff;
  color: @text;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.12s;
  user-select: none;

  &:hover {
    border-color: @accent-light;
    color: @accent;
  }
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  &--primary {
    background: @accent;
    border-color: @accent;
    color: #fff;
    &:hover {
      background: #5b4cdb;
      border-color: #5b4cdb;
      color: #fff;
    }
  }

  &--danger {
    border-color: @fail;
    color: @fail;
    &:hover {
      background: @fail;
      color: #fff;
    }
  }
}

.auto-config {
  display: flex;
  flex-direction: column;
  gap: 16px;

  &__field {
    display: flex;
    flex-direction: column;
    gap: 6px;

    label {
      font-size: 12px;
      font-weight: 500;
      color: @text-secondary;
      letter-spacing: 0.02em;
    }
  }

  &__row {
    display: flex;
    align-items: center;
    gap: 8px;

    label {
      font-size: 12px;
      font-weight: 500;
      color: @text-secondary;
      white-space: nowrap;
    }
  }

  &__mode {
    width: 132px;
  }
}

.auto-running {
  display: flex;
  flex-direction: column;
  gap: 12px;

  &__header {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  &__bar {
    flex: 1;
    height: 4px;
    background: @border;
    border-radius: 2px;
    overflow: hidden;
  }

  &__fill {
    height: 100%;
    background: @accent;
    border-radius: 2px;
    transition: width 0.3s ease;
  }

  &__count {
    font-size: 12px;
    color: @text-muted;
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }

  &__status {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: @text-secondary;
  }

  &__score {
    margin-left: auto;
    font-weight: 600;
    font-size: 12px;
    color: @accent;
    font-variant-numeric: tabular-nums;
  }
}

.auto-list {
  max-height: 320px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1px;
  background: @border;
  border-radius: 6px;
  overflow-x: hidden;

  &__item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 10px;
    font-size: 12px;
    background: #fff;

    &--done {
      background: fade(@done, 5%);
    }
    &--failed {
      background: fade(@fail, 5%);
    }
    &--skipped {
      background: fade(@skip, 7%);
    }
    &--designing,
    &--evaluating,
    &--revising,
    &--saving,
    &--grouping {
      background: fade(@accent, 4%);
    }
  }

  &__group {
    flex-shrink: 0;
    padding: 1px 5px;
    border: 1px solid fade(@accent, 28%);
    border-radius: 3px;
    color: @accent;
    font-size: 10px;
    line-height: 16px;
  }

  &__dot {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    width: 10px;
    justify-content: center;
  }

  &__text {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: @text;
    line-height: 1.4;

    em {
      margin-left: 6px;
      color: @text-muted;
      font-style: normal;
    }
  }

  &__score {
    flex-shrink: 0;
    font-weight: 600;
    font-size: 12px;
    color: @accent;
    font-variant-numeric: tabular-nums;
    min-width: 18px;
    text-align: right;
  }

  &__link {
    flex-shrink: 0;
    font-size: 12px;
    color: @accent;
  }
}

.auto-controls {
  display: flex;
  gap: 8px;
  justify-content: center;
  padding-top: 4px;
}

.auto-done {
  display: flex;
  flex-direction: column;
  gap: 16px;

  &__summary {
    text-align: center;
    padding: 12px 0 4px;
  }

  &__title {
    font-size: 16px;
    font-weight: 600;
    color: @text;
    margin-bottom: 8px;
  }

  &__stats {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    font-size: 12px;
    color: @text-secondary;
  }

  &__stat {
    display: inline-flex;
    align-items: center;
    gap: 5px;
  }

  &__error {
    margin-top: 8px;
    font-size: 12px;
    color: @fail;
  }
}
</style>
