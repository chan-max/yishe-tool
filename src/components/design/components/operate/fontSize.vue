<template>
    <operate-form-item>
        <template #icon> <icon-font-size></icon-font-size> </template>
        <template #name> 文字大小 </template>
        <template #content>
            <el-tooltip content="文字大小是相对于画布的宽度，0.1即0.1个画布宽度">
                <el-input type="number" v-model="model" size="small" min="0" step=".1"></el-input>
            </el-tooltip>
        </template>
    </operate-form-item>
</template>

<script setup lang="ts">
import iconFontSize from "@/components/design/assets/icon/font-size.svg?component";
import { ref } from 'vue'

const model = defineModel({})

</script>
  
<style></style>
  