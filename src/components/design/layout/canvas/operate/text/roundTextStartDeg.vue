<template>
    <operate-form-item>
        <template #icon>
            <icon></icon>
        </template>
        <template #name> 起始角度 </template>
        <template #content>
            <el-tooltip content="起始角度范围为 0 ～ 360 ，从正上方顺时针计算">
                <el-input type="number" v-model="model" size="small" max="360" min="0" step="12"></el-input>
            </el-tooltip>
        </template>
    </operate-form-item>
</template>

<script setup lang="ts">
import icon from "@/components/design/assets/icon/degree.svg?component";
import { ref } from 'vue'

const props = defineProps({
    tooltip: {
        default: ''
    }
})

const model = defineModel({})

</script>
  
<style></style>
  