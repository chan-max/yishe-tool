<template>
  <el-dialog
    v-model="visible"
    title="提示词库"
    width="680px"
    top="8vh"
    :close-on-click-modal="true"
    destroy-on-close
    @close="handleClose"
  >
    <div class="prompt-lib" :class="{ 'is-dark': isDark }">
      <div class="prompt-lib__search">
        <input
          v-model="keyword"
          class="prompt-lib__input"
          placeholder="搜索提示词..."
          @input="debouncedFetch"
        />
      </div>

      <div v-if="loading && !list.length" class="prompt-lib__status">
        <span class="prompt-lib__spinner" />
      </div>

      <div v-else-if="!list.length" class="prompt-lib__status">
        {{ keyword ? '未找到匹配的提示词' : '暂无提示词' }}
      </div>

      <div v-else ref="listRef" class="prompt-lib__list" @scroll="handleScroll">
        <div
          v-for="item in list"
          :key="item.id"
          class="prompt-lib__card"
          @click="handleSelect(item)"
        >
          <div class="prompt-lib__card-title">{{ item.title }}</div>
          <div class="prompt-lib__card-content">{{ item.content }}</div>
          <div class="prompt-lib__card-footer">
            <span class="prompt-lib__card-meta">使用 {{ item.usageCount }} 次</span>
            <button
              class="prompt-lib__fav"
              :class="{ 'is-fav': item.isFavorite }"
              @click.stop="toggleFavorite(item)"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" :fill="item.isFavorite ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
          </div>
        </div>

        <div v-if="loading" class="prompt-lib__status">
          <span class="prompt-lib__spinner" />
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import {
  queryDesignPromptPage,
  favoriteDesignPrompt,
  unfavoriteDesignPrompt,
} from "@/ai/design-prompts";
import type { DesignPromptItem } from "@/ai/design-prompts";
import { isDarkMode } from "@/components/design/store";

const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{
  "update:modelValue": [val: boolean];
  select: [content: string];
}>();

const isDark = isDarkMode;
const visible = ref(props.modelValue);

watch(() => props.modelValue, (v) => { visible.value = v; });
watch(visible, (v) => { emit("update:modelValue", v); if (v) fetchPrompts(); });

const keyword = ref("");
const list = ref<DesignPromptItem[]>([]);
const loading = ref(false);
const currentPage = ref(1);
const hasMore = ref(true);
const listRef = ref<HTMLElement | null>(null);

async function fetchPrompts(append = false) {
  if (loading.value) return;
  loading.value = true;
  try {
    const page = append ? currentPage.value : 1;
    const res = await queryDesignPromptPage({
      currentPage: page,
      pageSize: 20,
      keyword: keyword.value || undefined,
    });
    if (append) {
      list.value.push(...(res.list || []));
    } else {
      list.value = res.list || [];
      currentPage.value = 1;
    }
    hasMore.value = list.value.length < (res.total || 0);
  } catch {
    if (!append) list.value = [];
  } finally {
    loading.value = false;
  }
}

let debounceTimer: ReturnType<typeof setTimeout> | null = null;
function debouncedFetch() {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => fetchPrompts(), 300);
}

function handleScroll() {
  const el = listRef.value;
  if (!el || loading.value || !hasMore.value) return;
  if (el.scrollTop + el.clientHeight >= el.scrollHeight - 40) {
    currentPage.value++;
    fetchPrompts(true);
  }
}

function handleSelect(item: DesignPromptItem) {
  emit("select", item.content);
  visible.value = false;
}

async function toggleFavorite(item: DesignPromptItem) {
  try {
    if (item.isFavorite) {
      await unfavoriteDesignPrompt(item.id);
    } else {
      await favoriteDesignPrompt(item.id);
    }
    item.isFavorite = !item.isFavorite;
  } catch {}
}

function handleClose() {
  keyword.value = "";
  list.value = [];
  currentPage.value = 1;
}
</script>

<style lang="less" scoped>
.prompt-lib {
  --pl-bg: #ffffff;
  --pl-bg-card: #f9fafb;
  --pl-bg-card-hover: #f3f4f6;
  --pl-bg-input: #ffffff;
  --pl-text: #111827;
  --pl-text-secondary: #6b7280;
  --pl-border: #e5e7eb;
  --pl-accent: #4f46e5;
  --pl-accent-alpha: rgba(79, 70, 229, 0.08);
  --pl-fav: #d1d5db;
  --pl-fav-active: #ef4444;

  &.is-dark {
    --pl-bg: #111114;
    --pl-bg-card: #1e1e22;
    --pl-bg-card-hover: #27272a;
    --pl-bg-input: #1e1e22;
    --pl-text: #f4f4f5;
    --pl-text-secondary: #a1a1aa;
    --pl-border: #2e2e33;
    --pl-accent: #6366f1;
    --pl-accent-alpha: rgba(99, 102, 241, 0.15);
    --pl-fav: #3f3f46;
    --pl-fav-active: #ef4444;
  }

  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 13px;
  color: var(--pl-text);
}

.prompt-lib__search {
  margin-bottom: 12px;
}

.prompt-lib__input {
  width: 100%;
  box-sizing: border-box;
  padding: 8px 12px;
  background: var(--pl-bg-input);
  border: 1px solid var(--pl-border);
  border-radius: 6px;
  font-size: 13px;
  color: var(--pl-text);
  outline: none;
  transition: border-color 0.15s;

  &::placeholder { color: var(--pl-text-secondary); }
  &:focus { border-color: var(--pl-accent); }
}

.prompt-lib__list {
  max-height: 52vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overscroll-behavior: contain;
}

.prompt-lib__card {
  padding: 12px 14px;
  background: var(--pl-bg-card);
  border: 1px solid var(--pl-border);
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.12s, border-color 0.12s;

  &:hover {
    background: var(--pl-bg-card-hover);
    border-color: var(--pl-accent);
  }
}

.prompt-lib__card-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 6px;
  color: var(--pl-text);
}

.prompt-lib__card-content {
  font-size: 12px;
  color: var(--pl-text-secondary);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.prompt-lib__card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
}

.prompt-lib__card-meta {
  font-size: 11px;
  color: var(--pl-text-secondary);
}

.prompt-lib__fav {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  background: none;
  border: none;
  border-radius: 6px;
  color: var(--pl-fav);
  cursor: pointer;
  transition: color 0.15s, background 0.15s;

  &:hover { background: var(--pl-accent-alpha); color: var(--pl-fav-active); }
  &.is-fav { color: var(--pl-fav-active); }
}

.prompt-lib__status {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 16px;
  font-size: 13px;
  color: var(--pl-text-secondary);
}

.prompt-lib__spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid var(--pl-border);
  border-top-color: var(--pl-accent);
  border-radius: 50%;
  animation: pl-spin 0.6s linear infinite;
}

@keyframes pl-spin {
  to { transform: rotate(360deg); }
}
</style>
