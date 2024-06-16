<template>
    <operate-form-item>
        <template #icon> <icon-font-size></icon-font-size> </template>
        <template #name> 文字大小 </template>
        <template #content>
            <el-input type="number" v-model="model" size="small" min="0"></el-input>
        </template>
    </operate-form-item>
</template>

<script setup lang="ts">
import iconFontSize from "@/components/design/assets/icon/font-size.svg?component";
import { ref } from 'vue'

const model = defineModel({})

</script>
  
<style></style>
  