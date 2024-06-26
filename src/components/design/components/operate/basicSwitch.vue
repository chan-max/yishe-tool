<template>
    <operate-form-item>
        <template #icon> <icon></icon> </template>
        <template #name> {{ label }} </template>
        <template #content>
            <el-switch v-model="model" size="small" />
        </template>
    </operate-form-item>
</template>
    
<script setup lang='ts'>
import icon from "@/components/design/assets/icon/switch.svg?component";
const model = defineModel({})

const props = defineProps({
    label: {

    }
})

</script> 
    
<style></style>