<template>
    <operate-form-item>
        <template #icon> <icon-letter-spacing></icon-letter-spacing> </template>
        <template #name> 文字间距 </template>
        <template #content>
            <el-tooltip content="文字间距相对于当前文字大小">
                <el-input  style="width:64px"  type="number" v-model="model" size="small" min="-1" max="10"
                step=".1"></el-input>
            </el-tooltip>
        </template>
    </operate-form-item>
</template>
    
<script setup lang='ts'>
import iconLetterSpacing from "@/components/design/assets/icon/letter-spacing.svg?component";

const model = defineModel()
</script>
    
<style></style>