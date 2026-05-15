<template>
  <el-collapse v-model="activeNames">
    <el-collapse-item name="data" title="分子数据">
      <operate-form-item>
        <template #name>PDB ID</template>
        <template #content>
          <div class="threemol-pdbid-row">
            <el-input
              v-model="currentOperatingCanvasChild.pdbId"
              size="small"
              placeholder="例如 1BNA, 4HHB"
              clearable
            ></el-input>
            <el-popover
              v-model:visible="aiPopoverVisible"
              trigger="click"
              placement="right-start"
              width="340"
            >
              <div class="threemol-ai-popover">
                <el-input
                  v-model="aiPrompt"
                  type="textarea"
                  :rows="4"
                  resize="vertical"
                  spellcheck="false"
                  :disabled="aiLoading"
                  placeholder="描述分子，例如：血红蛋白、DNA 双螺旋、胰岛素"
                  @keydown.enter.ctrl="generateByAi"
                ></el-input>

                <div class="threemol-ai-popover__actions">
                  <el-button size="small" @click="aiPopoverVisible = false"
                    >取消</el-button
                  >
                  <el-button
                    size="small"
                    type="primary"
                    :loading="aiLoading"
                    :disabled="!aiPrompt.trim() || aiLoading"
                    @click="generateByAi"
                  >
                    确定
                  </el-button>
                </div>

                <div v-if="aiError" class="threemol-error">{{ aiError }}</div>
              </div>

              <template #reference>
                <el-button size="small" type="primary" plain
                  >AI 生成</el-button
                >
              </template>
            </el-popover>
          </div>
        </template>
      </operate-form-item>

      <operate-form-item>
        <template #name>格式</template>
        <template #content>
          <el-select v-model="currentOperatingCanvasChild.format" size="small">
            <el-option label="PDB" value="pdb" />
            <el-option label="SDF" value="sdf" />
            <el-option label="XYZ" value="xyz" />
            <el-option label="MOL2" value="mol2" />
          </el-select>
        </template>
      </operate-form-item>

      <operate-form-item>
        <template #name>数据</template>
        <template #content>
          <el-input
            v-model="currentOperatingCanvasChild.data"
            type="textarea"
            :rows="6"
            resize="vertical"
            spellcheck="false"
            placeholder="粘贴 PDB/SDF/XYZ 数据..."
            class="threemol-data-input"
          ></el-input>
        </template>
      </operate-form-item>
    </el-collapse-item>

    <el-collapse-item name="style" title="渲染样式">
      <operate-form-item>
        <template #name>样式</template>
        <template #content>
          <el-select v-model="currentOperatingCanvasChild.style" size="small">
            <el-option label="棍棒 (Stick)" value="stick" />
            <el-option label="球体 (Sphere)" value="sphere" />
            <el-option label="卡通 (Cartoon)" value="cartoon" />
            <el-option label="线条 (Line)" value="line" />
            <el-option label="十字 (Cross)" value="cross" />
          </el-select>
        </template>
      </operate-form-item>
    </el-collapse-item>

    <el-collapse-item name="basic" title="基础">
      <operateItemSize
        label="尺寸"
        v-model:width="currentOperatingCanvasChild.width"
        v-model:height="currentOperatingCanvasChild.height"
      />
    </el-collapse-item>

    <el-collapse-item name="bg" title="背景">
      <operateItemBackgroundColor
        v-model="currentOperatingCanvasChild.backgroundColor"
      />
    </el-collapse-item>

    <el-collapse-item name="common" title="通用属性">
      <operateItemCommonGroup v-model="currentOperatingCanvasChild" />
    </el-collapse-item>
  </el-collapse>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import operateItemSize from "@/components/design/layout/canvas/operate/size/relativeSize.vue";
import operateItemBackgroundColor from "@/components/design/layout/canvas/operate/backgroundColor.vue";
import operateItemCommonGroup from "@/components/design/layout/canvas/operate/commonGroup.vue";
import { currentOperatingCanvasChild } from "../index.tsx";
import { generateThreeMolecule } from "../children/aiThreeMoleculeService";

const activeNames = ref(["data", "style", "basic", "bg", "common"]);
const aiPopoverVisible = ref(false);
const aiPrompt = ref("");
const aiLoading = ref(false);
const aiError = ref("");

async function generateByAi() {
  const prompt = aiPrompt.value.trim();
  if (!prompt || aiLoading.value) return;

  aiLoading.value = true;
  aiError.value = "";

  try {
    const result = await generateThreeMolecule(
      prompt,
      currentOperatingCanvasChild.value?.pdbId || "",
      currentOperatingCanvasChild.value?.data || "",
    );

    if (result.pdbId) {
      currentOperatingCanvasChild.value.pdbId = result.pdbId;
      currentOperatingCanvasChild.value.data = "";
    } else if (result.data) {
      currentOperatingCanvasChild.value.data = result.data;
      currentOperatingCanvasChild.value.pdbId = "";
      if (result.format) {
        currentOperatingCanvasChild.value.format = result.format;
      }
    }

    aiPrompt.value = "";
    aiPopoverVisible.value = false;
  } catch (error: any) {
    aiError.value = error?.message || "AI 生成失败，请重试";
  } finally {
    aiLoading.value = false;
  }
}

watch(
  () => currentOperatingCanvasChild.value?.id,
  () => {
    aiError.value = "";
  },
  { immediate: true },
);
</script>

<style scoped>
.threemol-pdbid-row {
  display: flex;
  gap: 6px;
  width: 100%;
}

.threemol-pdbid-row .el-input {
  flex: 1;
}

.threemol-ai-popover {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.threemol-ai-popover__actions {
  display: flex;
  justify-content: flex-end;
  gap: 4px;

  :deep(.el-button + .el-button) {
    margin-left: 0;
  }
}

.threemol-error {
  color: #c45656;
  font-size: 12px;
  line-height: 1.4;
}

.threemol-data-input :deep(.el-textarea__inner) {
  font-family: Consolas, Monaco, "Courier New", monospace;
  font-size: 13px;
  line-height: 1.55;
}
</style>
