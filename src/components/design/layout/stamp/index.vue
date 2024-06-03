<template>
  <div class="container flex flex-col items-center">
    <input v-model="text" />
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { Canvg } from "canvg";
import {
  svgToBase64,
  downloadByFile,
  svgToFile,
  svgToPngFile,
} from "@/common/transform/index";

const text = ref();

const svgRef = ref();

const canvasRef = ref();

onMounted(() => {
  // downloadByFile(svgToPngFile(svgRef.value));
});
</script>

<style lang="less" scoped>
.container {
  width: 300px;
  height: 100%;
}


</style>
