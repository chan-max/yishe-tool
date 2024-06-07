<template>
  <div class="container flex flex-col items-center">
      <div class="stamp png-background">
        <stamp width="240" height="240"></stamp>
      </div>
      <div class="operate">
        <operate></operate>
      </div>
  </div>
</template>

<script setup lang="tsx">
import { onMounted, ref, computed } from "vue";
import { Canvg } from "canvg";
import operate from './operate.vue'
import {
  svgToBase64,
  downloadByFile,
  svgToFile,
  svgToPngFile,
} from "@/common/transform/index";
import {Stamp} from './template'

const circle = () => {
  return <div></div>;
};

const ellipse = () => {
  return <ellipse></ellipse>;
};

// 可定义
const svgWidth = ref(200);
const svgHeight = ref(200);
const circleStrokeWidth = ref(30);
const circleStroke = ref("red");

//
const circleCenterX = computed(() => {
  return svgWidth.value / 2;
});
const circleCenterY = computed(() => {
  return svgHeight.value / 2;
});
const circleRadius = computed(() => {
  return svgWidth.value / 2 - circleStrokeWidth.value / 2;
});
</script>

<style lang="less" scoped>
.container {
  width: 320px;
  height: 100%;
}

.stamp{
  width: 300px;
  height: 300px;
  display: flex;
  margin: 10px;
  align-items: center;
  justify-content: center;
}

.operate{
  flex: 1;
  width: 100%;
  overflow: auto;
}
</style>
