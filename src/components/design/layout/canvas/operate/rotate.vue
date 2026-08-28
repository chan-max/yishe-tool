<template>
    <operate-form-item>
        <template #icon>
            <icon></icon>
        </template>
        <template #name> 元素旋转 </template>
        <template #content>
            <el-tooltip content="用于旋转元素，单位为旋转的角度" :hide-after="0" placement="top">
                <div>
                    <el-popover trigger="click" width="180" popper-class="el-popover-operation">
                        <template #reference>
                            <el-button link size="small">
                                <div class="flex items-center gap-1.5 text-[11px] text-muted-foreground font-mono">
                                    <span>X: {{ x }}°</span>
                                    <span>Y: {{ y }}°</span>
                                    <span>Z: {{ z }}°</span>
                                </div>
                            </el-button>
                        </template>
                        <el-row align="middle" justify="end" :gutter="12">
                            <el-col :span="6"> x轴 </el-col>
                            <el-col :span="18"> <el-slider :min="0" :max="360" v-model="x" :marks="marks"   :format-tooltip="formatTooltip"/></el-col>
                            <el-col :span="6"> y轴 </el-col>
                            <el-col :span="18"> <el-slider :min="0" :max="360" v-model="y" :marks="marks"   :format-tooltip="formatTooltip"/></el-col>
                            <el-col :span="6"> z轴 </el-col>
                            <el-col :span="18"> <el-slider :min="0" :max="360" v-model="z" :marks="marks"   :format-tooltip="formatTooltip"/></el-col>
                        </el-row>
                    </el-popover>
                </div>
            </el-tooltip>
        </template>
    </operate-form-item>
</template>
  
<script setup lang="ts">
import icon from "@/components/design/assets/icon/rotate.svg?component";
import { ref } from 'vue'



const x = defineModel('x', { default: 0 })
const y = defineModel('y', { default: 0 })
const z = defineModel('z', { default: 0 })

const marks = ref({
    '45':'',
    '90':'',
    '190':'',
})




function formatTooltip(val) {

if (val == 45) {
    return '45°'
}


if (val == 90) {
    return '90°'
}

if (val == 180) {
    return '180'
}

return val
}

</script>
  
<style></style>
  