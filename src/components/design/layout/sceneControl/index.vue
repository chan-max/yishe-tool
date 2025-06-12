<template>
  <div class="designiy-scene-control">
    <!-- <el-color-picker
      show-alpha
      size="small"
      v-model="bgColor"
      color-format="rgb"
      :predefine="predefineColors"
    /> -->

    <el-form>
      <el-form-item label="画板背景">
        <a-radio-group v-model:value="currentCanvasBackground">
          <div class="background-options">
            <a-radio
              v-for="item in builtInCanvasBackgrounds"
              :key="item.name"
              :value="item"
            >
              <div class="background-option">
                <div class="background-preview" :style="{ background: item.backgroundCss }"></div>
                <span class="background-name">{{ item.name }}</span>
              </div>
            </a-radio>
          </div>
        </a-radio-group>
        <div class="background-tip">该颜色只作为辅助，不会真实渲染到画布，也不会影响导出的截图</div>
      </el-form-item>

      <el-form-item label="画布背景色">
        <div class="canvas-background-control">
          <el-color-picker
            v-model="canvasBackgroundColor"
            show-alpha
            :predefine="predefineBackgroundColors"
            @change="handleBackgroundColorChange"
            @active-change="handleActiveColorChange"
          />
          <span class="background-tip">此颜色会真实渲染到画布背景</span>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup>
import { onMounted, ref, computed } from "vue";
import {
  showBaseModelSelect,
  currentCanvasBackground,
  currentOperatingBaseModelInfo,
  canvasBgColor,
  canvasBgOpacity,
  builtInCanvasBackgrounds,
  currentModelController,
} from "../../store.ts";
import Color from "color";

const predefineColors = ref(["#ffffff", "#dddddd", "#333333", "#555555"]);

const predefineBackgroundColors = ref([
  '#ffffff', // 白色
  '#f5f5f5', // 浅灰
  '#eeeeee', // 淡灰
  '#e0e0e0', // 中灰
  '#fafafa', // 超浅灰
  '#f0f0f0', // 浅灰白
  '#f8f8f8', // 近白
  '#f2f2f2', // 淡灰白
]);

const bgColor = computed({
  get() {
    let color = Color(canvasBgColor.value);
    let _color = color.alpha(canvasBgOpacity.value);
    let __color = `rgba(${_color.rgb().array().join(",")},${_color.valpha})`;
    return __color;
  },
  set(val) {
    val ||= "rgba(0,0,0,0)"; // 模拟透明色
    let color = Color(val);
    canvasBgOpacity.value = color.valpha;
    canvasBgColor.value = color.hex();
  },
});

// 画布背景色
const canvasBackgroundColor = computed({
  get() {
    return currentModelController.value?.state.canvasBackground.color || '#eee';
  },
  set(val) {
    if (currentModelController.value) {
      currentModelController.value.setCanvasBackground(val);
    }
  }
});

// 处理背景色变化
const handleBackgroundColorChange = (val) => {
  if (currentModelController.value) {
    const color = Color(val);
    currentModelController.value.setCanvasBackground(val, color.alpha());
  }
};

// 处理颜色选择过程中的变化
const handleActiveColorChange = (val) => {
  if (currentModelController.value && val) {
    const color = Color(val);
    currentModelController.value.setCanvasBackground(val, color.alpha());
  }
};

function useCurrentBackground(item) {
  currentCanvasBackground.value = item;
}
</script>
<style lang="less">
.designiy-scene-control {
  .background-tip {
    font-size: 11px;
    color: #999;
    margin-top: 4px;
    line-height: 1.2;
  }

  .background-options {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  .background-option {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .background-preview {
    width: 16px;
    height: 16px;
    border-radius: 2px;
    border: 1px solid #d9d9d9;
  }

  .background-name {
    font-size: 12px;
  }

  .canvas-background-control {
    display: flex;
    align-items: center;
    gap: 12px;
  }
}
</style>
