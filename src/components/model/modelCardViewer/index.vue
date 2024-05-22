<template>
  <div
    class="model-card-viewer"
    @mouseenter="isHover = true"
    @mouseleave="isHover = false"
  >
    <el-image
      v-if="!isHover"
      :src="thumbnailUrl"
      class="display-content image"
      fit="cover"
      style="border-radius: 50%"
    >
      <template #placeholder>
        <div
          class="placeholder"
          style="background: transparent; width: 100%; height: 100%"
        ></div>
      </template>
      <template #error>
        <div class="error" style="background: red; width: 100%; height: 100%"></div>
      </template>
    </el-image>
    <div v-else class="display-content model">
      <gltf-viewer :src="modelUrl"></gltf-viewer>
    </div>
  </div>
</template>

<script setup>
import gltfViewer from "@/components/model/baseGltfViewer/index.vue";

import { ref } from "vue";
const props = defineProps({
  modelUrl: {
    type: String,
  },
  thumbnailUrl: {
    type: String,
  },
});

const isHover = ref(false);
</script>

<style scoepd lang="less">
.model-card-viewer {
  width: 100%;
  height: 100%;
}
.display-content {
  width: 100%;
  height: 100%;
}
</style>
