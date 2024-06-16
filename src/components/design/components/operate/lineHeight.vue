<template>
    <operate-form-item>
        <template #icon> <icon-line-height></icon-line-height> </template>
        <template #name> 行高 </template>
        <template #content>
           <el-tooltip content="文字的行高相对于字号">
            <el-input type="number" v-model="model" size="small" min="0" max="5"
                step=".1"></el-input>
           </el-tooltip>
        </template>
    </operate-form-item>
</template>
    
<script setup lang='ts'>
import iconLineHeight from "@/components/design/assets/icon/line-height.svg?component";
const model = defineModel({})
</script>
    
<style></style>