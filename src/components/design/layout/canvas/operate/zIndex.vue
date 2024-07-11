<template>
    <operate-form-item>
        <template #icon> <icon></icon> </template>
        <template #name> 元素层级 </template>
        <template #content>
            <el-tooltip content="控制元素的堆叠顺序,值越大,层级越高" :hide-after="0">
                <el-input type="number" v-model="model" size="small" max="999" min="0" step="1"></el-input>
            </el-tooltip>
        </template>
    </operate-form-item>
</template>

<script setup lang="ts">
import icon from "@/components/design/assets/icon/z-index.svg?component";
import { ref } from 'vue'

const props = defineProps({
    tooltip: {
        default: ''
    }
})

const model = defineModel({})

</script>
  
<style></style>
  