<template>
  <div id="basic-canvas" class="basic-canvas">
    <canvas-teleport></canvas-teleport>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import canvasTeleport from '@/components/design/layout/canvas/teleport.vue'
import { useLoadingOptions } from "@/components/loading/index.tsx";



</script>

<style scoped>
#basic-canvas {
  widows: 100%;
  height: 100%;
}

.basic-canvas {
  background: #eee;
}


</style>
