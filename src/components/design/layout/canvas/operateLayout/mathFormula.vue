<template>
  <el-collapse v-model="activeNames">
    <el-collapse-item name="formula" title="公式">
      <operate-form-item>
        <template #name>LaTeX</template>
        <template #content>
          <div class="math-formula-editor">
            <div class="math-formula-editor__toolbar">
              <el-popover
                v-model:visible="aiPopoverVisible"
                trigger="click"
                placement="right-start"
                width="320"
              >
                <div class="math-ai-popover">
                  <el-input
                    v-model="aiPrompt"
                    type="textarea"
                    :rows="3"
                    resize="vertical"
                    spellcheck="false"
                    :disabled="aiLoading"
                    placeholder="描述公式，例如：二次方程求根公式 / 水的生成反应"
                    @keydown.enter.ctrl="generateFormulaByAi"
                  ></el-input>

                  <div class="math-ai-popover__actions">
                    <el-button size="small" @click="aiPopoverVisible = false">取消</el-button>
                    <el-button
                      size="small"
                      type="primary"
                      :loading="aiLoading"
                      :disabled="!aiPrompt.trim() || aiLoading"
                      @click="generateFormulaByAi"
                    >
                      确定
                    </el-button>
                  </div>

                  <div v-if="aiError" class="math-ai-popover__error">{{ aiError }}</div>
                </div>

                <template #reference>
                  <el-button size="small" type="primary" plain>AI</el-button>
                </template>
              </el-popover>
            </div>

            <el-input
              v-model="currentOperatingCanvasChild.formula"
              type="textarea"
              :rows="5"
              resize="vertical"
              spellcheck="false"
              placeholder="\frac{a}{b}=c 或 \ce{2H2 + O2 -> 2H2O}"
            ></el-input>
          </div>
        </template>
      </operate-form-item>
    </el-collapse-item>

    <el-collapse-item name="style" title="样式">
      <operateItemFontSize
        label="公式大小"
        v-model="currentOperatingCanvasChild.fontSize"
      ></operateItemFontSize>
      <operateItemFontFamily
        label="公式字体"
        v-model="currentOperatingCanvasChild.fontFamilyInfo"
      ></operateItemFontFamily>
      <operateItemFontColor v-model="currentOperatingCanvasChild.fontColor"></operateItemFontColor>
      <operateItemBackgroundColor v-model="currentOperatingCanvasChild.backgroundColor"></operateItemBackgroundColor>
      <operateItemTextAlign v-model="currentOperatingCanvasChild.textAlign"></operateItemTextAlign>
    </el-collapse-item>

    <el-collapse-item name="layout" title="尺寸">
      <operateItemSize
        label="尺寸"
        v-model:width="currentOperatingCanvasChild.width"
        v-model:height="currentOperatingCanvasChild.height"
      ></operateItemSize>
    </el-collapse-item>

    <el-collapse-item name="common" title="通用属性">
      <operateItemCommonGroup v-model="currentOperatingCanvasChild"></operateItemCommonGroup>
    </el-collapse-item>
  </el-collapse>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import operateItemSize from '@/components/design/layout/canvas/operate/size/relativeSize.vue'
import operateItemCommonGroup from '@/components/design/layout/canvas/operate/commonGroup.vue'
import operateItemFontSize from '@/components/design/layout/canvas/operate/fontSize.vue'
import operateItemFontFamily from '@/components/design/layout/canvas/operate/fontFamily/fontFamily.vue'
import operateItemFontColor from '@/components/design/layout/canvas/operate/fontColor.vue'
import operateItemBackgroundColor from '@/components/design/layout/canvas/operate/backgroundColor.vue'
import operateItemTextAlign from '@/components/design/layout/canvas/operate/textAlign.vue'
import { currentOperatingCanvasChild } from '../index.tsx'
import { generateMathFormula } from '../children/aiMathService'

const activeNames = ref(['formula', 'style', 'layout', 'common'])
const aiPopoverVisible = ref(false)
const aiPrompt = ref('')
const aiLoading = ref(false)
const aiError = ref('')

async function generateFormulaByAi() {
  const prompt = aiPrompt.value.trim()
  if (!prompt || aiLoading.value) return

  aiLoading.value = true
  aiError.value = ''

  try {
    const result = await generateMathFormula(prompt, currentOperatingCanvasChild.value?.formula || '')
    currentOperatingCanvasChild.value.formula = result.formula
    aiPrompt.value = ''
    aiPopoverVisible.value = false
  } catch (error: any) {
    aiError.value = error?.message || 'AI 生成失败，请重试'
  } finally {
    aiLoading.value = false
  }
}
</script>

<style scoped>
.math-formula-editor {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.math-formula-editor__toolbar {
  display: flex;
  justify-content: flex-end;
}

.math-ai-popover {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.math-ai-popover__actions {
  display: flex;
  justify-content: flex-end;
  gap: 4px;

  :deep(.el-button + .el-button) {
    margin-left: 0;
  }
}

.math-ai-popover__error {
  color: #c45656;
  font-size: 12px;
  line-height: 1.4;
}
</style>
