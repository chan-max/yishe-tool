<template>
    <operate-form-item>
        <template #icon>
            <icon></icon>
        </template>
        <template #name> 选择背景图 </template>
        <template #content>
            <template v-if="model">
                已引用图片 {{ model.name }}
                <el-button @click="model = null" link :icon="Close"></el-button>
            </template>
            <template v-else>
                <el-button size="small" link @click="select"> 选择图片 </el-button>
            </template>
        </template>
    </operate-form-item>
</template>
    
<script setup lang='ts'>
import icon from "@/components/design/assets/icon/background-image.svg?component";
import { showSticker } from "@/components/design/store";
import { Close } from '@element-plus/icons-vue'

const model = defineModel({})

function select() {
    showSticker.value = true
}

</script> 
    
<style></style>