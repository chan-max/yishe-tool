<template>
    <operate-form-item>
        <template #icon>
            <icon></icon>
        </template>
        <template #name> 自定义滤镜 </template>
        <template #content>
            <el-popover width="auto" trigger="click" :visible="showPopover">
                <template #reference>
                    <el-button link size="small" @click="showPopover = !showPopover"> 使用自定义滤镜 </el-button>
                </template>

                <el-row style="width:480px;row-gap:1rem">
                    <el-col v-for="opt in canvasStickerOptions.svgFilter.children" :span="24">
                        <template v-if="opt.type == SvgFilterEffects.DROP_SHADOW">
                            <div>横向偏移</div> <el-input style="width:80px;"  v-model="opt.dx.value" size="small">
                                <template #suffix>
                                    {{ canvasStickerOptions.unit }}
                                </template>
                            </el-input>
                        </template>
                    </el-col>

                    <el-col :span="24">
                        <el-dropdown>
                            <el-button size="small">
                                添加阴影特效
                            </el-button>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item v-for="item in SvgFilterEffects" @click="addSvgFilterEffect(item)">{{
                                        SvgFilterEffectDisplayLabelMap[item] }}</el-dropdown-item>
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
import { addSvgFilterEffect, SvgFilterEffects, SvgFilterEffectDisplayLabelMap } from '@/components/design/layout/canvas/children/svgFilter/index'
import { ref } from 'vue'

const props = defineProps({
    tooltip: {
        default: ''
    }
})

const showPopover = ref(false)

const model = defineModel({})

</script>
  
<style></style>
  