<template>
    <operate-form-item>
        <template #icon> <icon-font-size></icon-font-size> </template>
        <template #name> 文字大小 </template>
        <template #content>
            <el-tooltip :content="tooltip">
                <el-input type="number" v-model="model" size="small" min="0" step=".1"></el-input>
            </el-tooltip>
        </template>
    </operate-form-item>
</template>

<script setup lang="ts">
import iconFontSize from "@/components/design/assets/icon/font-size.svg?component";
import { ref } from 'vue'

const props=defineProps({
    tooltip:{
        default:''
    }
})

const model = defineModel({})

</script>
  
<style></style>
  