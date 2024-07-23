<template>
    <operate-form-item>
        <template #icon>
            <icon></icon>
        </template>
        <template #name> 宽高比 </template>
        <template #content>
            <el-popover>
                <template #reference>
                    <el-input size="small" style="width:164px;" v-model="model"  min=".1" max="10"
                        step=".1"></el-input>
                </template>
                <div style="display:flex;gap:1em;flex-wrap:wrap;">
                    <el-tag style="cursor:pointer" v-for="item in aspectRatioOptions" @click="model = item.value">{{
                        item.label }}</el-tag>
                    <div style="flex:1"></div>
                </div>
            </el-popover>
        </template>
    </operate-form-item>
</template>
  
<script setup lang="ts">
import icon from "@/components/design/assets/icon/aspect-ratio.svg?component";
import { ref } from 'vue'

const model = defineModel({ default: '' })


const aspectRatioOptions = ref([
    {
        label: '等宽高(1 : 1)',
        value: '1'
    },
    {
        label: '16 : 9',
        value: 16 / 9
    },
    {
        label: '黄金比(1.618 : 1)',
        value: 1.618 / 1
    },
    {
        label: '银比例(1 : √2)',
        value: 1 / Math.sqrt(2)
    },
    {
        label: '4 : 3',
        value: 4 / 3
    },
    {
        label: '16 : 9',
        value: 16 / 9
    }
])


</script>
  
<style></style>
  