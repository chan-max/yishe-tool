<template>
  <div>
    <component :is="component"></component>
  </div>
</template>

<script setup lang="ts">
import {computed} from 'vue'
import canvasView from '@/components/design/layout/canvas/canvas.vue'
import {showCanvasLayout} from '@/components/design/store'

const component = computed(() => {
    if(showCanvasLayout.value){
        return canvasView
    }
})

</script>

<style></style>
