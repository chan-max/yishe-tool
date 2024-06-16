<template>
    <operate-form-item>
        <template #icon> <icon-italic></icon-italic> </template>
        <template #name> 斜体 </template>
        <template #content>
            <el-switch v-model="model" size="small" />
        </template>
    </operate-form-item>
</template>
    
<script setup lang='ts'>
import iconItalic from "@/components/design/assets/icon/italic.svg?component";
const model = defineModel({})
</script> 
    
<style></style>