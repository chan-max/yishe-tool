<template>
  <div class="container flex flex-col items-center">
    
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



</script>

<style lang="less" scoped>
.container {
  width: 320px;
  height: 100%;
}

.stamp {
  width: 300px;
  height: 300px;
  display: flex;
  margin: 10px;
  align-items: center;
  justify-content: center;
}

.operate {
  flex: 1;
  width: 100%;
  overflow: auto;
}

.footer {
  padding: 1em;
  width: 100%;
}
</style>
