<template>
  <div class="container flex flex-col items-center">
    <svg :width="svgWidth" :height="svgHeight">
      <circle :cx="circleCenterX" :cy="circleCenterY" :r="circleRadius" :stroke="circleStroke" :stroke-width="circleStrokeWidth" fill="none" />
    </svg>
  </div>
</template>

<script setup>
import { onMounted, ref,computed } from "vue";
import { Canvg } from "canvg";
import {
  svgToBase64,
  downloadByFile,
  svgToFile,
  svgToPngFile,
} from "@/common/transform/index";




// 可定义
const svgWidth = ref(200)
const svgHeight = ref(200)
const circleStrokeWidth = ref(30)
const circleStroke = ref('red')

// 
const circleCenterX = computed(() => {
  return svgWidth.value / 2
})
const circleCenterY = computed(() => {
  return svgHeight.value / 2
})
const circleRadius = computed(() => {
  return svgWidth.value / 2 - circleStrokeWidth.value / 2
})


</script>

<style lang="less" scoped>
.container {
  width: 300px;
  height: 100%;
}


</style>
