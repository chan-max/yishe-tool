<template>
    <operate-form-item>
        <template #icon>
            <icon></icon>
        </template>
        <template #name> 模糊效果 </template>
        <template #content>
            <el-tooltip content="模糊效果" :hide-after="0">
                <el-input style="width:80px" type="number" v-model="model.value" size="small" max="999" min="0" step="1">
                    <template #suffix>
                        <div style="font-size:1rem;"> {{ canvasStickerOptions.unit }}</div>
                    </template>
                </el-input>
            </el-tooltip>
        </template>
    </operate-form-item>
</template>

<script setup lang="ts">
import icon from "@/components/design/assets/icon/blur.svg?component";
import { canvasStickerOptions } from '@/components/design/layout/canvas/index.tsx'

const props = defineProps({
    tooltip: {
        default: ''
    }
})

const model = defineModel({})

</script>
  
<style></style>
  