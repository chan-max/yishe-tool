<template>
    <operate-form-item>
        <template #icon>
            <icon></icon>
        </template>
        <template #name> 高级滤镜 </template>
        <template #content>
            <el-popover width="auto" trigger="click" :visible="showPopover" popper-class="el-popover-operation">
                <template #reference>
                    <el-button link size="small" @click="showPopover = !showPopover">
                        {{ activeFilter ? activeFilter.label : '未使用滤镜' }}
                    </el-button>
                </template>
                <div style="width: 720px;">
                    <template v-if="activeTab == Tab.BuiltIn">
                        <el-row style="row-gap: 1rem">
                            <el-col :span="1">
                                <div style="height:40px;" class="flex items-center justify-center">
                                    <el-tooltip content="禁用滤镜效果" placement="top">
                                        <el-button link @click="removeCurrentFilter">
                                            <el-icon size="14">
                                                <StopOutlined />
                                            </el-icon>
                                        </el-button>
                                    </el-tooltip>
                                </div>
                            </el-col>
                            <el-col :span="23">
                                <el-tabs v-model="activeCategory">
                                    <el-tab-pane v-for="category in SvgFilterCategoryOptions" :name="category.value"
                                        :label="category.label">
                                        <el-scrollbar height="360px">
                                            <el-row :gutter="16" style="row-gap:.6rem;margin:1rem;">
                                                <el-col v-for="item in category.children" :span="4">
                                                    <div class="flex flex-col justify-center filter-item"
                                                        :class="{ checked: activeFilter?.filterName == item.filterName }"
                                                        @click="useCurrentFiter(item)">
                                                        <div class="preview-box">
                                                            <desimage :src="SvgFilterResource.NORMAL_PREVIEW_IMAGE_URL"
                                                                :style="{ filter: `url( #${item.filterName})` }"></desimage>
                                                        </div>
                                                        <div style="text-align: center;" class="text-ellipsis"> {{
                                                            item.label }}
                                                        </div>
                                                    </div>
                                                </el-col>
                                            </el-row>
                                        </el-scrollbar>
                                    </el-tab-pane>
                                </el-tabs>
                            </el-col>
                        </el-row>
                    </template>

                    <template v-if="activeTab == Tab.Custom">
                        <el-row>
                            <el-scrollbar height="360px">
                                <el-col v-for="opt, index in canvasStickerOptions.svgFilter.children" :span="24">
                                    <template v-if="opt.type == SvgFilterEffects.DROP_SHADOW">
                                        <div class="flex items-center flex-wrap" style="gap:1rem">
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
                                            <div class="label">横向模糊</div>
                                            <el-input style="width: 80px" type="number" v-model="opt.stdDeviationX.value"
                                                size="small">
                                                <template #suffix>
                                                    <span> {{ canvasStickerOptions.unit }}</span>
                                                </template>
                                            </el-input>
                                            <div class="label">纵向模糊</div>
                                            <el-input style="width: 80px" type="number" v-model="opt.stdDeviationY.value"
                                                size="small">
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

                                            <el-button @click="remove(index)" type="danger" size="small" plain> 移除
                                            </el-button>
                                        </div>
                                    </template>

                                    <template v-if="opt.type == SvgFilterEffects.GAUSSIAN_BLUR">
                                        <div class="flex items-center" style="column-gap:1rem">
                                            <div>
                                                {{ SvgFilterEffectDisplayLabelMap[opt.type] }}
                                            </div>
                                            <div class="label">横向模糊</div>
                                            <el-input style="width: 80px" type="number" v-model="opt.stdDeviationX.value"
                                                size="small">
                                                <template #suffix>
                                                    <span> {{ canvasStickerOptions.unit }}</span>
                                                </template>
                                            </el-input>
                                            <div class="label">纵向模糊</div>
                                            <el-input style="width: 80px" type="number" v-model="opt.stdDeviationY.value"
                                                size="small">
                                                <template #suffix>
                                                    <span> {{ canvasStickerOptions.unit }}</span>
                                                </template>
                                            </el-input>
                                            <el-button @click="remove(index)" type="danger" size="small" plain> 移除
                                            </el-button>
                                        </div>
                                    </template>

                                    <template v-if="opt.type == SvgFilterEffects.MORPHOLOGY">
                                        <div class="flex items-center" style="column-gap:1rem">
                                            <div>
                                                {{ SvgFilterEffectDisplayLabelMap[opt.type] }}
                                            </div>
                                            <div class="label">横向半径</div>
                                            <el-input style="width: 80px" type="number" v-model="opt.radiusX.value"
                                                size="small">
                                                <template #suffix>
                                                    <span> {{ canvasStickerOptions.unit }}</span>
                                                </template>
                                            </el-input>
                                            <div class="label">纵向半径</div>
                                            <el-input style="width: 80px" type="number" v-model="opt.radiusY.value"
                                                size="small">
                                                <template #suffix>
                                                    <span> {{ canvasStickerOptions.unit }}</span>
                                                </template>
                                            </el-input>
                                            <div class="label">模式</div>
                                            <el-select style="width: 80px" type="number" v-model="opt.operator"
                                                size="small">
                                                <el-option v-for="op in FeMorphologyOperatorOptions" :value="op.value"
                                                    :label="op.label" />
                                            </el-select>
                                            <el-button @click="remove(index)" type="danger" size="small" plain> 移除
                                            </el-button>
                                        </div>
                                    </template>
                                </el-col>
                            </el-scrollbar>
                        </el-row>
                    </template>


                    <el-row style="margin-top:1rem">
                        <el-col :span="24">
                            <div class="flex toolbar">
                                <el-button v-if="activeTab == Tab.BuiltIn" :icon="Switch" size="small"
                                    @click="activeTab = Tab.Custom"> 使用自定义高级滤镜 </el-button>
                                <el-button v-if="activeTab == Tab.Custom" :icon="Switch" size="small"
                                    @click="activeTab = Tab.BuiltIn"> 使用内置滤镜 </el-button>

                                <el-dropdown v-if="activeTab == Tab.Custom">
                                    <el-button style="margin-left: 1rem;" size="small" type="primary" plain> 添加滤镜特效
                                    </el-button>
                                    <template #dropdown>
                                        <el-dropdown-menu>
                                            <el-dropdown-item v-for="item in SvgFilterEffects"
                                                @click="addSvgFilterEffect(item)">
                                                {{ SvgFilterEffectDisplayLabelMap[item] }}
                                            </el-dropdown-item>
                                        </el-dropdown-menu>
                                    </template>
                                </el-dropdown>

                                <div style="flex:1;"></div>

                                <el-button size="small" type="danger" @click="showPopover = false"> 关闭 </el-button>
                            </div>
                        </el-col>
                    </el-row>
                </div>
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
    FeMorphologyOperatorOptions,
    SvgFilterResource
} from "@/components/design/layout/canvas/children/svgFilter/index";
import { ref } from "vue";
import colorPicker from "@/components/design/components/colorPicker.vue";
import { StopOutlined } from '@ant-design/icons-vue';
import { Switch } from '@element-plus/icons-vue'
import desimage from "@/components/design/components/image.vue";
import { SvgFilterCategoryOptions, SvgFilterCategory, SvgFilterCustomEffectType, SvgFilteCustomEffect } from "@/components/design/layout/canvas/children/svgFilter/builtIn/index";
import { useLocalStorage } from '@vueuse/core'

const activeFilter = defineModel({
    default: null
});

const activeCategory = useLocalStorage('_1s_svgFilterActiveCategory',SvgFilterCategory.Normal);

const props = defineProps({
    tooltip: {
        default: "",
    },
});



enum Tab {
    BuiltIn, // 内置滤镜
    Custom // 内置
}


const activeTab = useLocalStorage('_1s_svgFilterModeTab', Tab.BuiltIn)


/*
    移除当前滤镜 , 设为默认原始
*/
function removeCurrentFilter() {
    activeFilter.value = null
}

const showPopover = ref(false);

function remove(index) {
    canvasStickerOptions.value.svgFilter.children.splice(index, 1)
}

function removeAll() {
    canvasStickerOptions.value.svgFilter.children = []
}


function useCurrentFiter(f: SvgFilterCustomEffectType) {
    activeFilter.value = {
        filterName: f.filterName,
        label: f.label
    }
}

</script>

<style scoped lang="less">
.label {
    width: 64px;
    text-wrap: nowrap;
}



:deep(.el-tabs__nav-wrap::after) {
    display: none;
}

:deep(.el-tabs__active-bar) {
    display: none;
}

:deep(.el-tabs__item) {
    padding: 0 12px;
    color: rgba(0, 0, 0, .3);
}

:deep(.el-tabs__item.is-active) {
    color: rgba(0, 0, 0, .8);
}



.filter-item {

    row-gap: 1rem;

    .preview-box {
        overflow: hidden;
    }

    &.checked {
        .preview-box {
            box-shadow: rgba(115, 0, 255, .6) 0px 0px 0px 2px,
                rgba(115, 0, 255, .4) 0px 0px 0px 6px,
                rgba(115, 0, 255, .2) 0px 0px 0px 9px,
        }
    }

    &:hover {}
}
</style>
