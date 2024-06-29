<template>
    <operate-form-item>
        <template #icon> <icon-font-size></icon-font-size> </template>
        <template #name> 文字大小 </template>
        <template #content>

            <el-popover trigger="click">
                <template #reference>
                    <el-input type="number" v-model="model" size="small" min="0" step=".1"></el-input>
                </template>
                <el-row align="middle" justify="end">
                    <el-col :span="24">
                        <el-radio-group v-model="unit" size="small">
                            <el-radio v-for="u in unitOptions" :value="u.value">
                                <span style="font-size: 1rem;">{{ u.label }}</span>
                            </el-radio>
                        </el-radio-group>
                    </el-col>
                </el-row>
            </el-popover>
        </template>
    </operate-form-item>
</template>

<script setup lang="ts">
import iconFontSize from "@/components/design/assets/icon/font-size.svg?component";
import { ref } from 'vue'

const props = defineProps({
    tooltip: {
        default: ''
    },
})

const unitOptions = ref([{
    label: '像素值',
    value: 'px',
}, {
    label: '画布宽度百分比',
    value: 'vw',
}, {
    label: '画布高度度百分比',
    value: 'vh',
}])

const model = defineModel({})
const unit = defineModel('unit', {})

</script>
  
<style></style>
  