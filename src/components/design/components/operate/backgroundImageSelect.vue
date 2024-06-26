<template>
    <operate-form-item>
        <template #icon> <icon></icon> </template>
        <template #name> 选择背景图 </template>
        <template #content>
            <el-button size="small" link @click="select"> 选择图片 </el-button>
        </template>
    </operate-form-item>
</template>
    
<script setup lang='ts'>
import icon from "@/components/design/assets/icon/background-image.svg?component";
import { showSticker } from "@/components/design/store";
const model = defineModel({})

function select(){
    showSticker.value = true
}

</script> 
    
<style></style>