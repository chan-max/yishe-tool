<template>
    <el-scrollbar v-bind="$attrs" ref="elScrollbarRef" @scroll="scroll">
        <slot></slot>
    </el-scrollbar>
</template>
    
<script setup lang='ts'>

import { useLocalStorage } from '@vueuse/core';
import { onActivated, onDeactivated, onMounted, onUnmounted, ref } from 'vue'



const props = defineProps({
    id:{
        default:''
    }
})

const local:any = useLocalStorage(`_1s_scrollbar_${props.id}`,{})

function scroll(e) {
    // const { scrollTop, scrollLeft } = e
    if(props.id){
        local.value = e
    }
}


const elScrollbarRef = ref()


onActivated(() => {
    if(props.id){
        elScrollbarRef.value.setScrollTop(local.value.scrollTop)
    }
})

onDeactivated(() => {
})
</script>
    
<style></style>