<template>
    <operate-form-item>
        <template #icon>
            <icon></icon>
        </template>
        <template #name> 画布尺寸 </template>
        <template #content>
            <el-tooltip content="画布（使用，导出）时的实际尺寸">
                <div>
                    <el-input style="width:72px" size="small" v-model="width" step="10" min="0" type="number"
                        placeholder="宽"></el-input>
                    <span style="margin:0 .5em">✖️</span>
                    <el-input style="width:72px" size="small" v-model="height" step="10" min="0" type="number"
                        placeholder="高"></el-input>
                </div>
            </el-tooltip>
        </template>
    </operate-form-item>
</template>
  
<script setup lang="ts">
import icon from "@/components/design/assets/icon/size.svg?component";
import { ref } from 'vue'

const width = defineModel('width', { default: '' })
const height = defineModel('height', { default: '' })

</script>
  
<style></style>
  