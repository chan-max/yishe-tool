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
        
      </el-form-item>
    </el-form>

    <a-dropdown>
      <a-button size="small" type="text">
        <div :style="{ background: currentCanvasBackground.backgroundCss }">画布背景</div>
      </a-button>
      <template #overlay>
        <a-menu>
          <a-menu-item
            v-for="item in builtInCanvasBackgrounds"
            @click="useCurrentBackground(item)"
          >
            <div :style="{ background: item.backgroundCss }">{{ item.name }}</div>
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
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
} from "../../store.ts";
import Color from "color";

const predefineColors = ref(["#ffffff", "#dddddd", "#333333", "#555555"]);

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

function useCurrentBackground(item) {
  currentCanvasBackground.value = item;
}
</script>
<style lang="less">
.designiy-scene-control {
}
</style>
