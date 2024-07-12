<template>
    <operate-form-item>
        <template #icon>
            <icon></icon>
        </template>
        <template #name> 反转输入 </template>
        <template #content>
            <el-tooltip content="100%的价值是完全反转。值为0%则图像无变化" :hide-after="0">
                <el-input style="width:84px" type="number" v-model="model" size="small" max="100" min="0" step="1">
                    <template #suffix>
                        <div style="font-size:1rem;"> % </div>
                    </template>
                </el-input>
            </el-tooltip>
        </template>
    </operate-form-item>
</template>

<script setup lang="ts">
import icon from "@/components/design/assets/icon/invert.svg?component";
import { canvasOptions } from '@/components/design/layout/canvas/index.tsx'

const props = defineProps({
    tooltip: {
        default: ''
    }
})

const model = defineModel({})

</script>
  
<style></style>
  