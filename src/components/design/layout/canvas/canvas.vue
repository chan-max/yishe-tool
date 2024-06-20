<template>
    <div class="container png-background">
        <canvass></canvass>
    </div>
</template>
    
<script setup lang='tsx'>
import { ref, onMounted } from 'vue'
import { CanvasController } from './index.tsx';
const containerRef = ref()

let cc = new CanvasController()

let canvass = cc.getRender()



</script>
    
<style scoped lang="less">
.container{
    width: 100%;
    height: 100%;
    background-color: #fff;
    border: 1px solid #ddd;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>