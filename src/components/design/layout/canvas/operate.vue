<template>
    <el-scrollbar>
        <div style="margin: 1em 2em">
            <div v-if="!canvasOptions.children.length" style="padding: 4em; text-align: center">
                暂无元素
            </div>
            <el-tabs v-else tab-position="top" v-model="childrenTabActive" closable @tab-remove="remove">
                <el-tab-pane v-for="(item, index) in canvasOptions.children" :name="index">
                    <template #label>
                        <div>
                            {{ getCanvasChildLabel(item.type) }} {{ index }}
                        </div>
                    </template>
                    <template v-if="item.type == 'canvas'" #default>
                        <el-row :gutter="24" align="middle">
                            <el-col :span="24">
                                <operateItemSize label="画布尺寸" mode="number" v-model:width="canvasOptions.width"
                                    v-model:height="canvasOptions.height" v-model:aspectRatio="item.aspectRatio">
                                </operateItemSize>
                            </el-col>
                        </el-row>
                    </template>
                    <template v-if="item.type == 'text'" #default>
                        <el-collapse v-model="textCollapseActives">
                            <el-collapse-item name="1">
                                <template #title>
                                    <div class="title">文字属性</div>
                                </template>
                                <el-row :gutter="24" align="middle">
                                    <el-col :span="24">
                                        <operateItemTextContent v-model="item.textContent"></operateItemTextContent>
                                    </el-col>
                                    <el-col :span="12">
                                        <operateItemFontSize tooltip="文字大小相对于画布宽度 ,为 1 时则会占满整个画布，字体，数字，字母会略有影响 "
                                            v-model="item.fontSize">
                                        </operateItemFontSize>
                                    </el-col>
                                    <el-col :span="12">
                                        <operateItemFontWeight v-model="item.fontWeight"></operateItemFontWeight>
                                    </el-col>
                                    <el-col :span="12">
                                        <operateItemFontItalic v-model="item.italic"></operateItemFontItalic>
                                    </el-col>
                                    <el-col :span="12">
                                        <operateItemFontColor v-model="item.fontColor"></operateItemFontColor>
                                    </el-col>
                                    <el-col :span="12">
                                        <operateItemLineHeight v-model="item.lineHeight"></operateItemLineHeight>
                                    </el-col>
                                    <el-col :span="12">
                                        <operateItemLetterSpacing v-model="item.letterSpacing">
                                        </operateItemLetterSpacing>
                                    </el-col>
                                    <el-col :span="24">
                                        <operateItemFontFamily v-model="item.fontFamilyInfo" @font-load="fontLoad">
                                        </operateItemFontFamily>
                                    </el-col>
                                    <el-col :span="24">
                                        <operateItemPosition v-model="item.position"></operateItemPosition>
                                    </el-col>
                                    <el-col :span="12">
                                        <operateItemZindex v-model="item.zIndex">
                                        </operateItemZindex>
                                    </el-col>
                                </el-row>
                            </el-collapse-item>
                            <el-collapse-item name="2">
                                <template #title>
                                    <div class="title">高级属性</div>
                                </template>
                                <el-row :gutter="24" align="middle">
                                    <el-col :span="24">
                                        <operateItemWritingMode v-model="item.writingMode"></operateItemWritingMode>
                                    </el-col>

                                    <el-col :span="24">
                                        <operateItemScale v-model:x="item.scaleX" v-model:y="item.scaleY"
                                            v-model:z="item.scaleZ">
                                        </operateItemScale>
                                    </el-col>
                                    <el-col :span="24">
                                        <operateItemRotate v-model:x="item.rotateX" v-model:y="item.rotateY"
                                            v-model:z="item.rotateZ">
                                        </operateItemRotate>
                                    </el-col>
                                    <el-col :span="24">
                                        <operateItemSkew v-model:x="item.skewX" v-model:y="item.skewY">
                                        </operateItemSkew>
                                    </el-col>
                                </el-row>
                            </el-collapse-item>
                        </el-collapse>
                    </template>
                    <template v-if="item.type == 'image'">
                        image
                    </template>
                    <template v-if="item.type == 'background'">
                        <el-row :gutter="24" align="middle">
                            <el-col :span="24">
                                <operateItemSize label="背景尺寸" mode="percent" v-model:width="item.width"
                                    v-model:height="item.height" v-model:aspectRatio="item.aspectRatio">
                                </operateItemSize>
                            </el-col>
                            <el-col :span="24">
                                <operateItemPosition v-model="item.position"></operateItemPosition>
                            </el-col>
                            <el-col :span="12">
                                <operateItemBackgroundColor v-model="item.backgroundColor">
                                </operateItemBackgroundColor>
                            </el-col>
                            <el-col :span="12">
                                <operateItemZindex v-model="item.zIndex">
                                </operateItemZindex>
                            </el-col>
                            <el-col :span="24">
                                <operateItemBackgroundImageSelect v-model="item.backgroundImage">
                                </operateItemBackgroundImageSelect>
                            </el-col>
                        </el-row>
                    </template>
                </el-tab-pane>
            </el-tabs>
        </div>
    </el-scrollbar>
</template>
    
<script setup lang='ts'>
import { onMounted, ref, computed, watch, reactive, watchEffect, nextTick } from "vue";
import { Close } from '@element-plus/icons-vue'

import operateFormItem from "@/components/design/components/operate/operateFormItem.vue";
import operateItemTextContent from "@/components/design/components/operate/textContent.vue";
import operateItemFontSize from "@/components/design/components/operate/fontSize.vue";
import operateItemFontWeight from "@/components/design/components/operate/fontWeight.vue";
import operateItemFontItalic from "@/components/design/components/operate/italic.vue";
import operateItemFontColor from "@/components/design/components/operate/fontColor.vue";
import operateItemFontFamily from "@/components/design/components/operate/fontFamily.vue";
import operateItemLineHeight from "@/components/design/components/operate/lineHeight.vue";
import operateItemLetterSpacing from "@/components/design/components/operate/letterSpacing.vue";
import operateItemWritingMode from "@/components/design/components/operate/writingMode.vue";
import operateItemSize from "@/components/design/components/operate/size.vue";
import operateItemAspectRatio from "@/components/design/components/operate/aspectRatio.vue";
import operateItemPosition from "@/components/design/components/operate/position.vue";
import operateItemScale from "@/components/design/components/operate/scale.vue";
import operateItemRotate from "@/components/design/components/operate/rotate.vue";
import operateItemSkew from "@/components/design/components/operate/skew.vue";
import operateItemZindex from "@/components/design/components/operate/zIndex.vue";
import operateItemBackgroundColor from '@/components/design/components/operate/backgroundColor.vue'
import operateItemBackgroundImageSelect from '@/components/design/components/operate/backgroundImageSelect.vue'

import {
    CanvasController,
    canvasOptions,
    addCanvasChild,
    removeCavnasChild,
    getCanvasChildLabel,
    childrenTabActive,
    currentCanvasControllerInstance
} from "./index.tsx";

const textCollapseActives = ref(["1", "2", "3", "4"]);

function remove(index) {
    removeCavnasChild(index)
}

function fontLoad() {
    currentCanvasControllerInstance.value.updateCanvas();
}

</script>
    
<style></style>