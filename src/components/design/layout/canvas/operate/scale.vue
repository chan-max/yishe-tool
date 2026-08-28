<template>
    <operate-form-item>
        <template #icon>
            <icon></icon>
        </template>
        <template #name> 尺寸缩放 </template>
        <template #content>
            <el-tooltip content="用于缩放元素" :hide-after="0" placement="top">
                <div>
                    <el-popover trigger="click" width="180" popper-class="el-popover-operation">
                        <template #reference>
                            <el-button link size="small">
                                <div class="flex items-center gap-1.5 text-[11px] text-muted-foreground font-mono">
                                    <span>X: {{ x }}</span>
                                    <span>Y: {{ y }}</span>
                                    <span>Z: {{ z }}</span>
                                </div>
                            </el-button>
                        </template>
                        <el-row align="middle" justify="end" :gutter="12">
                            <el-col :span="6"> x轴 </el-col>
                            <el-col :span="18"> <el-slider :min="0" :max="10" :step=".1" v-model="x" :marks="marks"
                                    :format-tooltip="formatTooltip" /></el-col>
                            <el-col :span="6"> y轴 </el-col>
                            <el-col :span="18"> <el-slider :min="0" :max="10" :step=".1" v-model="y" :marks="marks"
                                    :format-tooltip="formatTooltip" /></el-col>
                            <el-col :span="6"> z轴 </el-col>
                            <el-col :span="18"> <el-slider :min="0" :max="10" :step=".1" v-model="z" :marks="marks"
                                    :format-tooltip="formatTooltip" /></el-col>
                        </el-row>
                    </el-popover>
                </div>
            </el-tooltip>
        </template>
    </operate-form-item>
</template>
  
<script setup lang="ts">
import icon from "@/components/design/assets/icon/scale.svg?component";
import { ref } from 'vue'

const x = defineModel('x', { default: 1 })
const y = defineModel('y', { default: 1 })
const z = defineModel('z', { default: 1 })


function formatTooltip(val) {

    if (val == 1) {
        return '原始尺寸'
    }

    return val
}

const marks = ref({
    1: ''
})

</script>
  
<style></style>
  