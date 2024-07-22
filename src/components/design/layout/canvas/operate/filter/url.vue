<template>
    <operate-form-item>
        <template #icon>
            <icon></icon>
        </template>
        <template #name> 自定义滤镜 </template>
        <template #content>
            <el-popover width="auto" trigger="click">
                <template #reference>
                    <el-button link size="small"> 使用自定义滤镜 </el-button>
                </template>

                <el-row style="width:480px">
                    <el-col>
                        <el-dropdown>
                            <el-button size="small">
                                添加阴影特效
                            </el-button>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item @click=""></el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </el-col>
                </el-row>

            </el-popover>
        </template>
    </operate-form-item>
</template>

<script setup lang="ts">
import icon from "@/components/design/assets/icon/filter.svg?component";
import { canvasStickerOptions } from '@/components/design/layout/canvas/index.tsx'

const props = defineProps({
    tooltip: {
        default: ''
    }
})

const model = defineModel({})

</script>
  
<style></style>
  