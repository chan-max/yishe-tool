<template>
  <div class="container flex flex-col items-center">
    <stamp width="200" height="200"></stamp>
    <!-- <svg :width="svgWidth" :height="svgHeight">
      <polygon
        fill="black"
        points="25,0 31,18 50,18 35,29 40,50 25,38 10,50 15,29 0,18 20,18"
      />

      <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-size="24" writing-mode="tb" glyph-orientation-vertical="0">Hello, World!</text>
      <circle :cx="circleCenterX" :cy="circleCenterY" :r="circleRadius" :stroke="circleStroke" :stroke-width="circleStrokeWidth" fill="none" />
    </svg> -->
  </div>
</template>

<script setup lang="tsx">
import { onMounted, ref, computed } from "vue";
import { Canvg } from "canvg";
import {
  svgToBase64,
  downloadByFile,
  svgToFile,
  svgToPngFile,
} from "@/common/transform/index";
import {Stamp} from './template'

console.log(Stamp)

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
  width: 300px;
  height: 100%;
}
</style>
