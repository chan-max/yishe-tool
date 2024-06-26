<template>
    <component :is="render"></component>
</template>
    
<script setup lang='tsx'>
import { ref, onMounted, computed } from 'vue'
import { currentCanvasControllerInstance } from './index'

const render = computed(() => {
    return currentCanvasControllerInstance.value ? currentCanvasControllerInstance.value.getCloneCanvasRender() : <div>error</div>
})

</script>
    
<style scoped lang="less"></style>