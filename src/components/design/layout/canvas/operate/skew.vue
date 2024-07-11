<template>
    <operate-form-item>
        <template #icon>
            <icon></icon>
        </template>
        <template #name> 元素倾斜 </template>
        <template #content>
            <el-tooltip content="用于调整元素倾斜角度" :hide-after="0">
                <div>
                    <span style="margin:0 .3em">x</span>
                    <el-input style="width:54px" size="small" v-model="x" step="1" min="0" max="360" type="number"
                        ></el-input>
                    <span style="margin:0 .3em">y</span>
                    <el-input style="width:54px" size="small" v-model="y" step="1" min="0" max="360" type="number"
                        ></el-input>
                </div>
            </el-tooltip>
        </template>
    </operate-form-item>
</template>
  
<script setup lang="ts">
import icon from "@/components/design/assets/icon/skew.svg?component";
import { ref } from 'vue'

const x = defineModel('x', { default: '' })
const y = defineModel('y', { default: '' })
</script>
  
<style></style>
  