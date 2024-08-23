<template>
    <operate-form-item>
        <template #icon>
            <icon></icon>
        </template>
        <template #name> 元素裁剪 </template>
        <template #content>
            <el-popover width="auto" trigger="click">
                <template #reference>
                    <el-button link>自定义裁剪</el-button>
                </template>
                <dragger></dragger>
            </el-popover>
        </template>
    </operate-form-item>
</template>
  
<script setup lang="ts">
import icon from "@/components/design/assets/icon/clip-path.svg?component";
import dragger from './dragger.vue'

// 通用的颜色操作

const model = defineModel({});

const props = defineProps({
})


</script>
  
<style></style>
  