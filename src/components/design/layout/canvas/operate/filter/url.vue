<template>
    <operate-form-item>
        <template #icon>
            <icon></icon>
        </template>
        <template #name> 自定义滤镜 </template>
        <template #content>
            <el-tooltip content="自定义高级滤镜" :hide-after="0">
                
            </el-tooltip>
        </template>
    </operate-form-item>
</template>

<script setup lang="ts">
import icon from "@/components/design/assets/icon/filter.svg?component";
import { canvasOptions } from '@/components/design/layout/canvas/index.tsx'

const props = defineProps({
    tooltip: {
        default: ''
    }
})

const model = defineModel({})

</script>
  
<style></style>
  