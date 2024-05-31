<template>
  <div class="container flex flex-col items-center">
    <div class="circular">
      <svg viewBox="0 0 100 100" ref="svgRef">
        <path d="M 0,50 a 50,50 0 1,1 0,1 z" id="circle" fill="none" />
        <text>
          <textPath xlink:href="#circle">circular reasoning 中文也可以的</textPath>
        </text>
      </svg>
    </div>
    <img :src="src" />
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

console.log(Canvg);

const svgRef = ref();

const canvasRef = ref();

const src = ref();

onMounted(() => {
  src.value = svgToBase64(svgRef.value);
  const bbox = svgRef.value.getBBox();
  debugger;
  downloadByFile(svgToPngFile(svgRef.value));
});
</script>

<style lang="less" scoped>
.container {
  width: 300px;
  height: 100%;
}

.circular {
  margin: 0 auto;
  width: 10em;
  height: 10em;
}

.circular path {
  fill: none;
}

.circular svg {
  display: block;
  overflow: visible;
}
</style>
