<template>
    <operate-form-item>
        <template #icon> <icon></icon> </template>
        <template #name> 边框尺寸 </template>
        <template #content>
            <el-popover trigger="click">
                <template #reference>
                    <el-input type="number" style="width:80px" v-model="model.value" size="small" min="0" step="1">
                        <template #suffix>
                            <div style="font-size:1rem;"> {{ model.unit }}
                            </div>
                        </template>
                    </el-input>
                </template>
                <el-row align="middle" justify="end">
                    <el-col :span="24">
                        <el-radio-group v-model="model.unit" size="small">
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
import icon from "@/components/design/assets/icon/border-width.svg?component";
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

</script>
  
<style></style>
  