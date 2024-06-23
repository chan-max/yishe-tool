<template>
    <operate-form-item>
        <template #icon>
            <icon></icon>
        </template>
        <template #name> 元素旋转 </template>
        <template #content>
            <el-tooltip content="用于旋转元素，单位为旋转的角度">
                <div>
                    <span style="margin:0 .5em">x</span>
                    <el-input style="width:54px" size="small" v-model="x" step="1" min="0" max="360" type="number"
                        ></el-input>
                    <span style="margin:0 .5em">y</span>
                    <el-input style="width:54px" size="small" v-model="y" step="1" min="0" max="360" type="number"
                        ></el-input>
                    <span style="margin:0 .5em">z</span>
                    <el-input style="width:54px" size="small" v-model="z" step="1" min="0" max="360" type="number"
                        ></el-input>
                </div>
            </el-tooltip>
        </template>
    </operate-form-item>
</template>
  
<script setup lang="ts">
import icon from "@/components/design/assets/icon/rotate.svg?component";
import { ref } from 'vue'

const x = defineModel('x', { default: '' })
const y = defineModel('y', { default: '' })
const z = defineModel('z', { default: '' })
</script>
  
<style></style>
  