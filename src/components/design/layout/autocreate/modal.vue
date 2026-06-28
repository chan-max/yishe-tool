<template>
  <a-modal
    v-model:open="showAutocreateModal"
    title="自动制作"
    width="480px"
    :footer="null"
    :destroy-on-close="false"
    centered
    :mask-closable="batchProgress.status === 'idle'"
  >
    <!-- 配置阶段 -->
    <div v-if="batchProgress.status === 'idle'" class="auto-config">
      <div class="auto-config__field">
        <label>风格</label>
        <div class="auto-config__tags">
          <span
            v-for="s in presetStyles"
            :key="s"
            class="auto-tag"
            :class="{ active: config.style === s }"
            @click="config.style = s"
          >{{ s }}</span>
        </div>
        <a-input
          v-model:value="config.style"
          placeholder="输入自定义风格"
          size="small"
          allow-clear
        />
      </div>

      <div class="auto-config__field">
        <label>主题描述</label>
        <a-textarea
          v-model:value="config.description"
          placeholder="如：咖啡店菜单、花卉海报、科技感名片..."
          :rows="2"
          size="small"
        />
      </div>

      <div class="auto-config__row">
        <label>数量</label>
        <a-input-number
          v-model:value="config.count"
          :min="1"
          :max="20"
          size="small"
        />
      </div>

      <button
        class="auto-btn auto-btn--primary"
        :disabled="!config.style"
        @click="handleStart"
      >
        开始制作
      </button>
    </div>

    <!-- 运行阶段 -->
    <div
      v-else-if="batchProgress.status === 'running' || batchProgress.status === 'paused' || batchProgress.status === 'preparing'"
      class="auto-running"
    >
      <!-- 进度 -->
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

      <!-- 当前状态 -->
      <div class="auto-running__status">
        <template v-if="batchProgress.status === 'preparing'">
          <span class="dot dot--active" />
          <span>正在生成提示词</span>
        </template>
        <template v-else-if="currentItem">
          <span class="dot dot--active" />
          <span>{{ statusText(currentItem) }}</span>
          <span v-if="currentItem.score !== null" class="auto-running__score">
            {{ currentItem.score }}/10
          </span>
        </template>
      </div>

      <!-- 列表 -->
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
            <span v-else-if="item.status === 'pending'" class="dot dot--pending" />
            <span v-else class="dot dot--active" />
          </span>
          <span class="auto-list__text">{{ item.prompt }}</span>
          <span v-if="item.score !== null" class="auto-list__score">
            {{ item.score }}
          </span>
        </div>
      </div>

      <!-- 控制 -->
      <div class="auto-controls">
        <template v-if="batchProgress.status === 'paused'">
          <button class="auto-btn auto-btn--primary" @click="handleResume">继续</button>
        </template>
        <template v-else-if="batchProgress.status === 'running'">
          <button class="auto-btn" @click="handlePause">暂停</button>
        </template>
        <button class="auto-btn auto-btn--danger" @click="handleStop">停止</button>
      </div>
    </div>

    <!-- 完成/停止阶段 -->
    <div v-else class="auto-done">
      <div class="auto-done__summary">
        <div class="auto-done__title">
          {{ batchProgress.status === 'done' ? '全部完成' : '已停止' }}
        </div>
        <div class="auto-done__stats">
          <span class="auto-done__stat">
            <span class="dot dot--done" />
            成功 {{ successCount }}
          </span>
          <span v-if="failCount > 0" class="auto-done__stat">
            <span class="dot dot--fail" />
            失败 {{ failCount }}
          </span>
          <span v-if="avgScore !== null" class="auto-done__stat">
            均分 {{ avgScore }}
          </span>
        </div>
      </div>

      <!-- 结果列表 -->
      <div class="auto-list">
        <div
          v-for="item in batchProgress.items"
          :key="item.index"
          class="auto-list__item"
          :class="`auto-list__item--${item.status}`"
        >
          <span class="auto-list__dot">
            <span v-if="item.status === 'done'" class="dot dot--done" />
            <span v-else class="dot dot--fail" />
          </span>
          <span class="auto-list__text">{{ item.prompt }}</span>
          <span v-if="item.score !== null" class="auto-list__score">
            {{ item.score }}
          </span>
        </div>
      </div>

      <button class="auto-btn auto-btn--primary" @click="handleReset">再来一批</button>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { reactive, computed } from "vue";
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

// ============ 配置 ============

const presetStyles = [
  "极简主义",
  "日系小清新",
  "复古怀旧",
  "科技未来",
  "中国风",
  "欧美海报",
  "可爱卡通",
  "奢华质感",
];

const config = reactive<AutoBatchConfig>({
  style: "",
  description: "",
  count: 5,
});

// ============ 计算属性 ============

const currentItem = computed<BatchItem | null>(() => {
  if (batchProgress.current >= 0 && batchProgress.current < batchProgress.items.length) {
    return batchProgress.items[batchProgress.current];
  }
  return null;
});

const doneCount = computed(() =>
  batchProgress.items.filter((i) => i.status === "done" || i.status === "failed").length,
);

const successCount = computed(() =>
  batchProgress.items.filter((i) => i.status === "done").length,
);

const failCount = computed(() =>
  batchProgress.items.filter((i) => i.status === "failed").length,
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

// ============ 方法 ============

function statusText(item: BatchItem): string {
  switch (item.status) {
    case "generating":
      return "生成中";
    case "evaluating":
      return "评估中";
    case "improving":
      return "优化中";
    case "saving":
      return "保存中";
    default:
      return "";
  }
}

async function handleStart() {
  if (!config.style) return;
  await startBatch({ ...config });
}

function handlePause() { pauseBatch(); }
function handleResume() { resumeBatch(); }
function handleStop() { stopBatch(); }
function handleReset() { resetBatch(); }
</script>

<style lang="less" scoped>
// ============ 配色变量 ============
@accent: #6c5ce7;
@accent-light: #a29bfe;
@text: #2d3436;
@text-secondary: #636e72;
@text-muted: #b2bec3;
@border: #dfe6e9;
@bg-subtle: #f8f9fa;
@done: #00b894;
@fail: #d63031;

// ============ 通用组件 ============
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
  &--done { background: @done; }
  &--fail { background: @fail; }
  &--pending { background: @border; }
}

@keyframes dot-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
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

  &:hover { border-color: @accent-light; color: @accent; }
  &:disabled { opacity: 0.4; cursor: not-allowed; }

  &--primary {
    background: @accent;
    border-color: @accent;
    color: #fff;
    &:hover { background: #5b4cdb; border-color: #5b4cdb; color: #fff; }
  }

  &--danger {
    border-color: @fail;
    color: @fail;
    &:hover { background: @fail; color: #fff; }
  }
}

// ============ 配置阶段 ============
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

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  &__row {
    display: flex;
    align-items: center;
    gap: 10px;

    label {
      font-size: 12px;
      font-weight: 500;
      color: @text-secondary;
      white-space: nowrap;
    }
  }
}

.auto-tag {
  display: inline-block;
  padding: 3px 10px;
  font-size: 12px;
  border-radius: 3px;
  border: 1px solid @border;
  background: #fff;
  color: @text-secondary;
  cursor: pointer;
  transition: all 0.12s;
  user-select: none;
  line-height: 1.5;

  &:hover { border-color: @accent-light; color: @accent; }

  &.active {
    background: @accent;
    border-color: @accent;
    color: #fff;
  }
}

// ============ 运行阶段 ============
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

// ============ 列表 ============
.auto-list {
  max-height: 280px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1px;
  background: @border;
  border-radius: 6px;
  overflow: hidden;

  &__item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 10px;
    font-size: 12px;
    background: #fff;

    &--done { background: fade(@done, 5%); }
    &--failed { background: fade(@fail, 5%); }
    &--generating,
    &--evaluating,
    &--improving,
    &--saving { background: fade(@accent, 4%); }
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
}

// ============ 控制按钮 ============
.auto-controls {
  display: flex;
  gap: 8px;
  justify-content: center;
  padding-top: 4px;
}

// ============ 完成阶段 ============
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
}
</style>
