<template>
  <div class="canvas-structure">
    <div class="canvas-structure__header">
      <div class="canvas-structure__header-left">
        <span class="canvas-structure__title">数据结构</span>
        <div class="canvas-structure__info">
          <span>children: {{ nodeCount }}</span>
          <span>深度: {{ maxDepth }}</span>
        </div>
      </div>
      <div class="canvas-structure__actions">
        <el-radio-group v-model="viewMode" size="small">
          <el-radio-button value="tree">树形</el-radio-button>
          <el-radio-button value="json">JSON</el-radio-button>
        </el-radio-group>
        <el-tooltip content="复制 JSON" placement="top" :show-after="300">
          <el-button size="small" @click="copyJson">
            <template #icon><CopyOutlined /></template>
            复制
          </el-button>
        </el-tooltip>
        <el-tooltip :content="autoRefresh ? '停止自动刷新' : '开启自动刷新'" placement="top" :show-after="300">
          <el-button size="small" :type="autoRefresh ? 'primary' : 'default'" @click="autoRefresh = !autoRefresh">
            <template #icon><SyncOutlined :spin="autoRefresh" /></template>
            {{ autoRefresh ? '实时' : '手动' }}
          </el-button>
        </el-tooltip>
      </div>
    </div>

    <div class="canvas-structure__search">
      <el-input
        v-model="searchText"
        size="small"
        placeholder="搜索字段名或值..."
        clearable
      >
        <template #prefix><SearchOutlined /></template>
      </el-input>
    </div>

    <div class="canvas-structure__body">
      <template v-if="viewMode === 'tree'">
        <div class="canvas-structure__tree" ref="treeContainerRef">
          <template v-if="!searchText">
            <json-node :data="displayData" :depth="0" :path="'$'" :expanded-paths="expandedPaths" @toggle="togglePath" />
          </template>
          <template v-else>
            <div v-if="searchResults.length === 0" class="canvas-structure__empty">
              未找到匹配项
            </div>
            <div v-else class="canvas-structure__search-results">
              <div
                v-for="(result, index) in searchResults"
                :key="index"
                class="canvas-structure__search-item"
                @click="jumpToPath(result.path)"
              >
                <span class="canvas-structure__search-path">{{ result.path }}</span>
                <span class="canvas-structure__search-value">{{ result.preview }}</span>
              </div>
            </div>
          </template>
        </div>
      </template>

      <template v-else>
        <div class="canvas-structure__raw">
          <pre class="canvas-structure__raw-content"><code>{{ rawJson }}</code></pre>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted, reactive } from 'vue'
import { canvasStickerOptions } from '../canvas/index.tsx'
import { ElMessage } from 'element-plus'
import { CopyOutlined, SyncOutlined, SearchOutlined } from '@ant-design/icons-vue'
import JsonNode from './JsonNode.vue'

const viewMode = ref<'tree' | 'json'>('tree')
const autoRefresh = ref(true)
const searchText = ref('')
const expandedPaths = reactive(new Set<string>())
const treeContainerRef = ref<HTMLElement | null>(null)
const refreshTick = ref(0)

expandedPaths.add('$')
expandedPaths.add('$.children')

const displayData = computed(() => {
  refreshTick.value
  const raw = canvasStickerOptions.value
  return JSON.parse(JSON.stringify(raw, (_key, value) => {
    if (value && typeof value === 'object' && value.__v_skip) return undefined
    if (typeof value === 'function') return '[Function]'
    if (value instanceof HTMLElement) return '[HTMLElement]'
    return value
  }))
})

const rawJson = computed(() => {
  return JSON.stringify(displayData.value, null, 2)
})

const nodeCount = computed(() => {
  return displayData.value?.children?.length ?? 0
})

const maxDepth = computed(() => {
  function getMaxDepth(obj: any, current: number): number {
    if (!obj || typeof obj !== 'object') return current
    let max = current
    for (const key of Object.keys(obj)) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        max = Math.max(max, getMaxDepth(obj[key], current + 1))
      }
    }
    return max
  }
  return getMaxDepth(displayData.value, 0)
})

const searchResults = computed(() => {
  if (!searchText.value) return []
  const term = searchText.value.toLowerCase()
  const results: { path: string; preview: string }[] = []

  function walk(obj: any, path: string) {
    if (obj === null || obj === undefined) return
    if (typeof obj !== 'object') {
      if (String(obj).toLowerCase().includes(term)) {
        results.push({ path, preview: String(obj) })
      }
      return
    }
    for (const key of Object.keys(obj)) {
      const childPath = `${path}.${key}`
      if (key.toLowerCase().includes(term)) {
        results.push({ path: childPath, preview: JSON.stringify(obj[key]).slice(0, 60) })
      }
      walk(obj[key], childPath)
    }
  }

  walk(displayData.value, '$')
  return results.slice(0, 100)
})

let refreshTimer: ReturnType<typeof setInterval> | null = null

function startAutoRefresh() {
  stopAutoRefresh()
  refreshTimer = setInterval(() => {
    refreshTick.value++
  }, 500)
}

function stopAutoRefresh() {
  if (refreshTimer) {
    clearInterval(refreshTimer)
    refreshTimer = null
  }
}

watch(autoRefresh, (val) => {
  if (val) startAutoRefresh()
  else stopAutoRefresh()
}, { immediate: true })

onUnmounted(stopAutoRefresh)

function copyJson() {
  const json = JSON.stringify(displayData.value, null, 2)
  navigator.clipboard.writeText(json).then(() => {
    ElMessage.success('已复制到剪贴板')
  }).catch(() => {
    ElMessage.warning('复制失败')
  })
}

function togglePath(path: string) {
  if (expandedPaths.has(path)) {
    expandedPaths.delete(path)
  } else {
    expandedPaths.add(path)
  }
}

function jumpToPath(path: string) {
  const parts = path.split('.')
  let current = ''
  for (let i = 0; i < parts.length; i++) {
    current = current ? `${current}.${parts[i]}` : parts[i]
    expandedPaths.add(current)
  }
  searchText.value = ''
}
</script>

<style scoped lang="less">
.canvas-structure {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 80px);
  overflow: hidden;
  padding: 16px 20px;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 0 12px;
    flex-shrink: 0;
    flex-wrap: wrap;
    gap: 8px;
  }

  &__header-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__title {
    font-size: 14px;
    font-weight: 600;
    color: var(--1s-text-color);
  }

  &__info {
    display: flex;
    gap: 12px;
    font-size: 11px;
    color: var(--1s-text-color-secondary);
  }

  &__actions {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  &__search {
    flex-shrink: 0;
    margin-bottom: 8px;
  }

  &__body {
    flex: 1;
    overflow: hidden;
    border: 1px solid var(--1s-border-color);
    border-radius: 6px;
    background: var(--1s-surface-background);
  }

  &__tree {
    height: 100%;
    overflow: auto;
    padding: 8px 4px;
    font-size: 12px;
    font-family: 'Menlo', 'Monaco', 'Consolas', monospace;
    line-height: 1.6;
  }

  &__raw {
    height: 100%;
    overflow: auto;
  }

  &__raw-content {
    margin: 0;
    padding: 12px 16px;
    font-size: 12px;
    font-family: 'Menlo', 'Monaco', 'Consolas', monospace;
    line-height: 1.6;
    color: var(--1s-text-color);
    white-space: pre-wrap;
    word-break: break-all;
  }

  &__empty {
    padding: 20px;
    text-align: center;
    color: var(--1s-text-color-secondary);
    font-size: 12px;
  }

  &__search-results {
    padding: 0 8px;
  }

  &__search-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 8px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;

    &:hover {
      background: var(--1s-hover-background);
    }
  }

  &__search-path {
    color: var(--1s-primary-color);
    flex-shrink: 0;
    font-family: 'Menlo', 'Monaco', 'Consolas', monospace;
  }

  &__search-value {
    color: var(--1s-text-color-secondary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-family: 'Menlo', 'Monaco', 'Consolas', monospace;
  }
}
</style>
