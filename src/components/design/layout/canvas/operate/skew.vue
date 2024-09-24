<template>
    <operate-form-item>
        <template #icon>
            <icon></icon>
        </template>
        <template #name> 元素倾斜 </template>
        <template #content>
            <el-tooltip content="用于调整元素倾斜角度" :hide-after="0" placement="top">
                <div>
                    <el-popover trigger="click" width="180" popper-class="el-popover-operation">
                        <template #reference>
                            <el-button link>
                                <div style="font-size: 1rem;display:flex;column-gap:.5rem;">
                                    <span>x:</span>
                                    <span> {{ x }} deg</span>
                                    <span> y:</span>
                                    <span> {{ y }}deg </span>
                                </div>
                            </el-button>
                        </template>
                        <el-row align="middle" justify="end" :gutter="12">
                            <el-col :span="6"> x轴 </el-col>
                            <el-col :span="18"> <el-slider :min="0" :max="360" v-model="x" /></el-col>
                            <el-col :span="6"> y轴 </el-col>
                            <el-col :span="18"> <el-slider :min="0" :max="360" v-model="y" /></el-col>
                        </el-row>
                    </el-popover>
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
  