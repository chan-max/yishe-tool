<template>
    <operate-form-item>
        <template #icon> <icon></icon> </template>
        <template #name> {{ label }} </template>
        <template #content>
            <color-picker v-model="model"></color-picker>
        </template>
    </operate-form-item>
</template>
  
<script setup lang="ts">
import icon from "@/components/design/assets/icon/color.svg?component";



const model = defineModel({});

const props = defineProps({
    label:{
        default:'颜色'
    }
})


</script>
  
<style></style>
  