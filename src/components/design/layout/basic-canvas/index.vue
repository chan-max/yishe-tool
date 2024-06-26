<template>
  <div class="basic-canvas">
    <component :is="component"></component>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import mainCanvas from '@/components/design/layout/canvas/canvas.vue'
import { showCanvasLayout } from '@/components/design/store'
import { showMainCanvas } from '@/components/design/layout/canvas/index.tsx'

const component = computed(() => {
  if (showCanvasLayout.value && showMainCanvas.value) {
    return mainCanvas
  }
})

</script>

<style scoped>
  .basic-canvas{
    background: #eee;
  }
</style>
