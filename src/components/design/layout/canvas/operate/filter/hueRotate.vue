<template>
    <operate-form-item>
        <template #icon>
            <icon></icon>
        </template>
        <template #name> 色调旋转 </template>
        <template #content>
            <el-tooltip content="默认为0" :hide-after="0">
                <el-input style="width:80px"  v-model="model" size="small" max="360" min="0" step="1" type="number">
                    <template #suffix>
                        <div style="font-size:1rem;"> deg </div>
                    </template>
                </el-input>
            </el-tooltip>
        </template>
    </operate-form-item>
</template>

<script setup lang="ts">
import icon from "@/components/design/assets/icon/hue-rotate.svg?component";
import { canvasStickerOptions } from '@/components/design/layout/canvas/index.tsx'

const props = defineProps({
    tooltip: {
        default: ''
    }
})

const model = defineModel({})

</script>
  
<style></style>
  