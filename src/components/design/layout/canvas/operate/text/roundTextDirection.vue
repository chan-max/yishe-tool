<template>
    <operate-form-item>
        <template #icon>  </template>
        <template #name> 文字旋转方向 </template>
        <template #content>
            <el-switch v-model="model" size="small" />
        </template>
    </operate-form-item>
</template>
    
<script setup lang='ts'>
import icon from "@/components/design/assets/icon/italic.svg?component";
const model = defineModel({})
</script> 
    
<style></style>