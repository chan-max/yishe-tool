<template>
    <div class="container flex flex-col items-center">
        <div v-loading="loading" v-bind="loadingOptions" style="
        width: 320px;
        height: 320px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 10px;
      ">
            <canvass></canvass>
        </div>
        <el-button-group link style="width: 100%; padding: 0 1em; display: flex; overflow: auto">
            <el-popover trigger="click" width="260">
                <div class="addchild">
                    <el-button size="small" @click="add('text')" round> 文字 </el-button>
                    <el-button size="small" @click="add('image')" round> 图片 </el-button>
                    <el-button size="small" @click="add('qrcode')" round> 二维码 </el-button>
                    <el-button size="small" @click="add('barcode')" round> 条形码 </el-button>
                    <el-button size="small" @click="add('stamp')" round> 印章 </el-button>
                    <el-button size="small" @click="add('background')" round> 背景 </el-button>
                    <el-button size="small" @click="add('other')" round> 其他 </el-button>
                    <div style="flex: 1"></div>
                </div>
                <template #reference>
                    <el-button type="primary" style="flex: 1" plain>
                        添加元素 {{ canvasOptions.children.length }}
                    </el-button>
                </template>
            </el-popover>
            <el-button @click="exportPng" type="primary" plain> 导出 png </el-button>
        </el-button-group>
        <div class="operate">
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
                                        <operateItemSize v-model:width="canvasOptions.width"
                                            v-model:height="canvasOptions.height"></operateItemSize>
                                    </el-col>
                                    <el-col :span="24">
                                        <operateItemAspectRatio v-model="canvasOptions.aspectRatio">
                                        </operateItemAspectRatio>
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
                                                <operateItemPosition v-model="item.position"></operateItemPosition>
                                            </el-col>
                                            <el-col :span="24">
                                                <operateItemScale v-model:x="item.scaleX" v-model:y="item.scaleY" v-model:z="item.scaleZ">
                                                </operateItemScale>
                                            </el-col>
                                            <el-col :span="24">
                                                <operateItemRotate v-model:x="item.rotateX" v-model:y="item.rotateY" v-model:z="item.rotateZ">
                                                </operateItemRotate>
                                            </el-col>
                                            <el-col :span="24">
                                                <operateItemSkew v-model:x="item.skewX" v-model:y="item.skewY">
                                                </operateItemSkew>
                                            </el-col>
                                        </el-row>
                                    </el-collapse-item>
                                </el-collapse>
                                <!-- <el-button @click="" type="danger" round
                                    style="width: 100%; margin-top: 1em">
                                    移除该元素
                                </el-button> -->
                            </template>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </el-scrollbar>
        </div>
    </div>
</template>

<script setup lang="tsx">
import {
    CanvasController,
    canvasOptions,
    addCanvasChild,
    removeCavnasChild,
    getCanvasChildLabel,
    childrenTabActive
} from "./index.tsx";
import { Close } from '@element-plus/icons-vue'
import { Canvg } from "canvg";
import { useLoadingOptions } from "@/components/loading/index.ts";
import { onMounted, ref, computed, watch, reactive, watchEffect, nextTick } from "vue";
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
const loadingOptions = useLoadingOptions();

import layout from "./layout.vue";

let cc = new CanvasController();

function exportPng() {
    cc.downloadPng();
}

let canvass = cc.getRender({ max: 320 });

const textCollapseActives = ref(["1", "2", "3", "4"]);

const loading = computed(() => {
    return cc.loading.value;
});

function fontLoad() {
    cc.updateCanvas();
}


function remove(index) {
    removeCavnasChild(index)
}

function add(type) {
    childrenTabActive.value = addCanvasChild({
        type: type,
    });
    document.body.click();
}
</script>

<style lang="less" scoped>
.container {
    width: 340px;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.operate {
    flex: 1;
    width: 100%;
    overflow: auto;
}

.title {
    font-size: 1rem;
    font-weight: bold;
}

.addchild {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    gap: 0.5em;

    :deep(.el-button + .el-button) {
        margin-left: 0;
    }
}
</style>
