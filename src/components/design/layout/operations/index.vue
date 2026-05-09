<template>
  <div class="ops-panel">
    <div class="ops-panel__groups">
      <div
        v-for="group in groups"
        :key="group"
        class="ops-group"
      >
        <div class="ops-group__title">{{ group }}</div>
        <div class="ops-group__grid">
          <div
            v-for="op in getOpsByGroup(group)"
            :key="op.id"
            class="ops-card"
            :class="{ 'ops-card--active': activeOpId === op.id }"
            @click="toggleOp(op.id)"
          >
            <div class="ops-card__head">
              <div class="ops-card__name">{{ op.name }}</div>
              <div class="ops-card__desc">{{ op.description }}</div>
              <div class="ops-card__id">{{ op.id }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="activeOp" class="ops-detail">
      <div class="ops-detail__header">
        <div class="ops-detail__title">{{ activeOp.name }}</div>
        <div class="ops-detail__desc">{{ activeOp.description }}</div>
      </div>

      <div class="ops-detail__body">
        <div
          v-for="param in activeOp.params"
          :key="param.name"
          class="ops-param"
        >
          <label class="ops-param__label">
            {{ param.label }}
            <span v-if="param.required" class="ops-param__required">*</span>
          </label>
          <div class="ops-param__desc" v-if="param.description">{{ param.description }}</div>

          <el-select
            v-if="param.type === 'select'"
            v-model="formValues[activeOp.id][param.name]"
            size="default"
            style="width: 100%"
          >
            <el-option
              v-for="opt in param.options"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>

          <el-color-picker
            v-else-if="param.type === 'color'"
            v-model="formValues[activeOp.id][param.name]"
          />

          <el-switch
            v-else-if="param.type === 'boolean'"
            v-model="formValues[activeOp.id][param.name]"
          />

          <el-input-number
            v-else-if="param.type === 'number'"
            v-model="formValues[activeOp.id][param.name]"
            size="default"
            :min="param.min"
            :max="param.max"
            style="width: 100%"
          />

          <el-input
            v-else
            v-model="formValues[activeOp.id][param.name]"
            size="default"
            :placeholder="param.description"
          />
        </div>
      </div>

      <div class="ops-detail__footer">
        <div
          v-if="lastResult"
          class="ops-result"
          :class="{ 'ops-result--success': lastResult.success, 'ops-result--fail': !lastResult.success }"
        >
          {{ lastResult.message }}
        </div>
        <el-button
          type="primary"
          size="large"
          :loading="executing"
          @click="handleExecute(activeOp)"
        >
          执行操作
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import {
  getOperationList,
  getOperationGroups,
  getOperationsByGroup,
  executeOperation,
  createDesignOperationContext,
} from '@/operations'
import type { OperationListItem, OperationResult } from '@/operations'

const operations = ref<OperationListItem[]>([])
const groups = ref<string[]>([])
const activeOpId = ref<string | null>(null)
const executing = ref(false)
const lastResult = ref<OperationResult | null>(null)
const formValues = reactive<Record<string, Record<string, any>>>({})

const activeOp = computed(() => {
  if (!activeOpId.value) return null
  return operations.value.find((op) => op.id === activeOpId.value) || null
})

onMounted(() => {
  operations.value = getOperationList()
  groups.value = getOperationGroups()
  for (const op of operations.value) {
    formValues[op.id] = {}
    for (const param of op.params) {
      formValues[op.id][param.name] = param.default !== undefined ? param.default : (param.type === 'number' ? undefined : '')
    }
  }
})

function getOpsByGroup(group: string): OperationListItem[] {
  return operations.value.filter((op) => op.group === group)
}

function toggleOp(id: string) {
  activeOpId.value = activeOpId.value === id ? null : id
  lastResult.value = null
}

async function handleExecute(op: OperationListItem) {
  executing.value = true
  lastResult.value = null
  try {
    const ctx = createDesignOperationContext()
    const result = await executeOperation(op.id, { ...formValues[op.id] }, ctx)
    lastResult.value = result
    if (result.success) {
      message.success(result.message)
    } else {
      message.error(result.message)
    }
  } catch (err: any) {
    lastResult.value = { success: false, message: err?.message || '执行失败' }
    message.error(lastResult.value.message)
  } finally {
    executing.value = false
  }
}
</script>

<style lang="less" scoped>
.ops-panel {
  display: flex;
  gap: 24px;
  height: calc(100vh - 120px);
  color: var(--1s-text-color);
}

.ops-panel__groups {
  flex: 1;
  min-width: 0;
  overflow-y: auto;
  padding-right: 8px;
}

.ops-group {
  margin-bottom: 20px;
}

.ops-group__title {
  font-size: 13px;
  font-weight: 600;
  color: var(--1s-text-color-secondary);
  padding: 0 0 10px;
  letter-spacing: 0.5px;
}

.ops-group__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px;
}

.ops-card {
  border: 1px solid var(--1s-border-color);
  border-radius: 10px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: var(--1s-elevated-background);

  &:hover {
    border-color: var(--1s-accent-color);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  &--active {
    border-color: var(--1s-accent-color);
    box-shadow: 0 0 0 1px var(--1s-accent-color);
  }
}

.ops-card__name {
  font-size: 14px;
  font-weight: 500;
}

.ops-card__desc {
  font-size: 12px;
  color: var(--1s-text-color-secondary);
  margin-top: 6px;
  line-height: 1.5;
}

.ops-card__id {
  font-size: 11px;
  color: var(--1s-text-color-secondary);
  opacity: 0.6;
  margin-top: 8px;
  font-family: monospace;
}

.ops-detail {
  width: 360px;
  flex-shrink: 0;
  border: 1px solid var(--1s-border-color);
  border-radius: 10px;
  background: var(--1s-elevated-background);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.ops-detail__header {
  padding: 20px;
  border-bottom: 1px solid var(--1s-border-color);
  flex-shrink: 0;
}

.ops-detail__title {
  font-size: 16px;
  font-weight: 600;
}

.ops-detail__desc {
  font-size: 12px;
  color: var(--1s-text-color-secondary);
  margin-top: 6px;
  line-height: 1.5;
}

.ops-detail__body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.ops-param {
  margin-bottom: 16px;
}

.ops-param__label {
  font-size: 13px;
  font-weight: 500;
  display: block;
  margin-bottom: 4px;
}

.ops-param__required {
  color: #ff4d4f;
}

.ops-param__desc {
  font-size: 11px;
  color: var(--1s-text-color-secondary);
  margin-bottom: 6px;
}

.ops-detail__footer {
  padding: 16px 20px;
  border-top: 1px solid var(--1s-border-color);
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex-shrink: 0;
}

.ops-result {
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 13px;

  &--success {
    background: #f6ffed;
    border: 1px solid #b7eb8f;
    color: #52c41a;
  }

  &--fail {
    background: #fff2f0;
    border: 1px solid #ffccc7;
    color: #ff4d4f;
  }
}
</style>
