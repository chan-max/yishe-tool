<template>
    <operate-form-item>
        <template #icon>
            <icon></icon>
        </template>
        <template #name> 自定义滤镜 </template>
        <template #content>
            <el-popover width="auto" trigger="click" :visible="showPopover">
                <template #reference>
                    <el-button link size="small" @click="showPopover = !showPopover">
                        使用自定义滤镜
                    </el-button>
                </template>

                <el-row style="width: 1080px; row-gap: 1rem">
                    <el-col v-for="opt, index in canvasStickerOptions.svgFilter.children" :span="24">
                        <template v-if="opt.type == SvgFilterEffects.DROP_SHADOW">
                            <div class="flex items-center" style="column-gap:1rem">
                                <div>
                                    {{ SvgFilterEffectDisplayLabelMap[opt.type] }}
                                </div>
                                <div class="label">横向偏移</div>
                                <el-input style="width: 80px" type="number" v-model="opt.dx.value" size="small">
                                    <template #suffix>
                                        <span> {{ canvasStickerOptions.unit }}</span>
                                    </template>
                                </el-input>
                                <div class="label">纵向偏移</div>
                                <el-input style="width: 80px" type="number" v-model="opt.dy.value" size="small">
                                    <template #suffix>
                                        <span> {{ canvasStickerOptions.unit }}</span>
                                    </template>
                                </el-input>
                                <div class="label">横向标准差</div>
                                <el-input style="width: 80px" type="number" v-model="opt.stdDeviationX.value" size="small">
                                    <template #suffix>
                                        <span> {{ canvasStickerOptions.unit }}</span>
                                    </template>
                                </el-input>
                                <div class="label">纵向标准差</div>
                                <el-input style="width: 80px" type="number" v-model="opt.stdDeviationY.value" size="small">
                                    <template #suffix>
                                        <span> {{ canvasStickerOptions.unit }}</span>
                                    </template>
                                </el-input>
                                <div class="label">投影颜色</div>
                                <colorPicker type="pure" v-model="opt.floodColor"></colorPicker>
                                <div class="label">投影透明度</div>
                                <el-input style="width: 80px" type="number" max="1" min="0.01" step=".1"
                                    v-model="opt.floodOpacity" size="small">
                                    <template #suffix>
                                        <span> {{ canvasStickerOptions.unit }}</span>
                                    </template>
                                </el-input>

                                <el-button @click="remove(index)" type="danger" size="small" plain> 移除 </el-button>
                            </div>
                        </template>
                    </el-col>

                    <el-col :span="24">
                        <el-dropdown>
                            <el-button size="small" type="primary" plain> 添加阴影特效 </el-button>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item v-for="item in SvgFilterEffects" @click="addSvgFilterEffect(item)">
                                        {{ SvgFilterEffectDisplayLabelMap[item] }}
                                    </el-dropdown-item>
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
import { canvasStickerOptions } from "@/components/design/layout/canvas/index.tsx";
import {
    addSvgFilterEffect,
    SvgFilterEffects,
    SvgFilterEffectDisplayLabelMap,
} from "@/components/design/layout/canvas/children/svgFilter/index";
import { ref } from "vue";
import colorPicker from "@/components/design/components/colorPicker.vue";


const props = defineProps({
    tooltip: {
        default: "",
    },
});

const showPopover = ref(false);

function remove(index) {
    canvasStickerOptions.value.svgFilter.children.splice(index, 1)
}

const model = defineModel({});
</script>

<style scoped>
.label {
    width: 64px;
    text-wrap: nowrap;
}
</style>
