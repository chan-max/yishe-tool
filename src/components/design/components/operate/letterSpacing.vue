<template>
    <operate-form-item>
        <template #icon> <icon-letter-spacing></icon-letter-spacing> </template>
        <template #name> 间距 </template>
        <template #content>
            <el-input type="number" v-model="model" size="small" min="-1" max="1"
                step=".1"></el-input>
        </template>
    </operate-form-item>
</template>
    
<script setup lang='ts'>
import iconLetterSpacing from "@/components/design/assets/icon/letter-spacing.svg?component";

const model = defineModel()
</script>
    
<style></style>