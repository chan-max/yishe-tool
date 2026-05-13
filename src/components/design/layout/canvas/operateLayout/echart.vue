<template>
  <el-collapse v-model="activeNames">
    <el-collapse-item name="basic" title="基础">
      <operateItemSize
        label="尺寸"
        v-model:width="currentOperatingCanvasChild.width"
        v-model:height="currentOperatingCanvasChild.height"
      ></operateItemSize>

      <operate-form-item>
        <template #name>渲染器</template>
        <template #content>
          <el-select v-model="echartsOptions.renderer" size="small">
            <el-option label="Canvas" value="canvas"></el-option>
            <el-option label="SVG" value="svg"></el-option>
          </el-select>
        </template>
      </operate-form-item>

      <operate-form-item>
        <template #name>主题</template>
        <template #content>
          <el-input v-model="echartsOptions.theme" size="small" placeholder="默认主题"></el-input>
        </template>
      </operate-form-item>
    </el-collapse-item>

    <el-collapse-item name="option" title="Option">
      <operate-form-item>
        <template #name>JSON 配置</template>
        <template #content>
          <el-button size="small" type="primary" @click="openOptionDialog">编辑配置</el-button>
        </template>
      </operate-form-item>
    </el-collapse-item>

    <el-collapse-item name="common" title="通用属性">
      <operateItemCommonGroup v-model="currentOperatingCanvasChild"></operateItemCommonGroup>
    </el-collapse-item>
  </el-collapse>

  <el-dialog
    v-model="optionDialogVisible"
    title="编辑 ECharts Option"
    fullscreen
    append-to-body
    destroy-on-close
    class="echart-option-dialog"
  >
    <div class="echart-option-editor">
      <el-input
        v-model="optionText"
        type="textarea"
        spellcheck="false"
        resize="none"
        placeholder='{"xAxis":{},"yAxis":{},"series":[]}'
      ></el-input>
      <div v-if="optionError" class="echart-option-error">{{ optionError }}</div>
    </div>

    <template #footer>
      <el-button @click="optionDialogVisible = false">取消</el-button>
      <el-button @click="formatOptionText">格式化</el-button>
      <el-button type="primary" @click="confirmOptionText">应用配置</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import operateItemSize from '@/components/design/layout/canvas/operate/size/relativeSize.vue'
import operateItemCommonGroup from '@/components/design/layout/canvas/operate/commonGroup.vue'
import { currentOperatingCanvasChild } from '../index.tsx'
import {
  ensureEchartOptions,
} from '../children/echart/index.tsx'

const activeNames = ref(['basic', 'option', 'common'])
const optionText = ref('')
const optionError = ref('')
const optionDialogVisible = ref(false)

const echartsOptions = computed(() => {
  return ensureEchartOptions(currentOperatingCanvasChild.value)
})

function syncOptionText() {
  optionText.value = JSON.stringify(echartsOptions.value.option || {}, null, 2)
  optionError.value = ''
}

function openOptionDialog() {
  syncOptionText()
  optionDialogVisible.value = true
}

function confirmOptionText() {
  try {
    const nextOption = JSON.parse(optionText.value || '{}')
    if (!nextOption || typeof nextOption !== 'object' || Array.isArray(nextOption)) {
      optionError.value = 'Option 必须是一个 JSON 对象'
      return
    }
    echartsOptions.value.option = nextOption
    optionText.value = JSON.stringify(nextOption, null, 2)
    optionError.value = ''
    optionDialogVisible.value = false
  } catch (error: any) {
    optionError.value = error?.message || 'JSON 解析失败'
  }
}

function formatOptionText() {
  try {
    optionText.value = JSON.stringify(JSON.parse(optionText.value || '{}'), null, 2)
    optionError.value = ''
  } catch (error: any) {
    optionError.value = error?.message || 'JSON 解析失败'
  }
}

watch(
  () => currentOperatingCanvasChild.value?.id,
  syncOptionText,
  { immediate: true },
)

watch(
  () => echartsOptions.value.option,
  syncOptionText,
  { deep: true },
)
</script>

<style scoped>
.echart-option-editor {
  height: calc(100vh - 142px);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.echart-option-error {
  color: #c45656;
  font-size: 12px;
  line-height: 1.4;
}

.echart-option-editor :deep(.el-textarea),
.echart-option-editor :deep(.el-textarea__inner) {
  height: 100%;
  font-family: Consolas, Monaco, "Courier New", monospace;
  font-size: 13px;
  line-height: 1.55;
}
</style>
