<template>
  <div class="designiy-scene-control">
    <el-color-picker
      show-alpha
      size="small"
      v-model="bgColor"
      color-format="rgb"
      :predefine="predefineColors"
    />
  </div>
</template>
<script setup>
import { onMounted, ref, computed } from "vue";
import {
  showBaseModelSelect,
  currentOperatingModelInfo,
  canvasBgColor,
  canvasBgOpacity,
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
</script>
<style lang="less">
.designiy-scene-control {
  width: 700px;
  height: 300px;
  padding: 20px;
}
</style>
