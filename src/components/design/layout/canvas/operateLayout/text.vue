<template>
    <template v-if="currentOperatingCanvasChild.type == CanvasChildType.TEXT">
        <el-collapse v-model="textCollapseActives">
            <el-collapse-item name="1" title="文字属性">
                <el-row align="middle">
                    <el-col :span="24">
                        <operateItemTextContent v-model="currentOperatingCanvasChild.textContent">
                        </operateItemTextContent>
                    </el-col>
                    <el-col :span="24">
                        <operateItemSwitch label="使用繁体字" v-model="currentOperatingCanvasChild.isTraditionalChinese">
                        </operateItemSwitch>
                    </el-col>
                    <el-col :span="24">
                        <operateItemFontSize v-model="currentOperatingCanvasChild.fontSize">
                        </operateItemFontSize>
                    </el-col>
                    <el-col :span="24">
                        <operateItemFontItalic v-model="currentOperatingCanvasChild.italic"></operateItemFontItalic>
                    </el-col>
                    <el-col :span="24">
                        <operateItemFontColor v-model="currentOperatingCanvasChild.fontColor">
                        </operateItemFontColor>
                    </el-col>
                    <el-col :span="24">
                        <operateItemLineHeight v-model="currentOperatingCanvasChild.lineHeight">
                        </operateItemLineHeight>
                    </el-col>
                    <el-col :span="24">
                        <operateItemLetterSpacing v-model="currentOperatingCanvasChild.letterSpacing">
                        </operateItemLetterSpacing>
                    </el-col>
                    <el-col :span="24">
                        <operateItemFontFamily v-model="currentOperatingCanvasChild.fontFamilyInfo" @font-load="fontLoad">
                        </operateItemFontFamily>
                    </el-col>
                    <el-col :span="24">
                        <operateItemFontWeight v-model="currentOperatingCanvasChild.fontWeight">
                        </operateItemFontWeight>
                    </el-col>
                    <el-col :span="24">
                        <operateItemTextShadow v-model="currentOperatingCanvasChild.textShadow">
                        </operateItemTextShadow>
                    </el-col>
                    <el-col :span="24">
                        <operateItemWritingMode v-model="currentOperatingCanvasChild.writingMode">
                        </operateItemWritingMode>
                    </el-col>
                    <el-col :span="24">
                        <operateItemTextStroke v-model:width="currentOperatingCanvasChild.textStrokeWidth"
                            v-model:color="currentOperatingCanvasChild.textStrokeColor">
                        </operateItemTextStroke>
                    </el-col>
                </el-row>
            </el-collapse-item>

            <el-collapse-item name="2" title="通用属性">

                <operateItemCommonGroup v-model="currentOperatingCanvasChild"></operateItemCommonGroup>
            </el-collapse-item>


            <el-collapse-item name="4">
                <template #title>
                    <div class="title">环形文字</div>
                </template>
                <el-row :gutter="24" align="middle">
                    <el-col :span="24">
                        <operateItemSwitch label="使用圆形文字" v-model="currentOperatingCanvasChild.isRoundText">
                        </operateItemSwitch>
                    </el-col>
                    <el-col :span="24">
                        <operateItemEllipseTextRadius
                            v-model:horizontal="currentOperatingCanvasChild.roundTextHorizontalRadius"
                            v-model:vertical="currentOperatingCanvasChild.roundTextVerticalRadius">
                        </operateItemEllipseTextRadius>
                    </el-col>
                    <el-col :span="24">
                        <operateItemRoundTextStartDeg v-model="currentOperatingCanvasChild.roundTextStartDeg">
                        </operateItemRoundTextStartDeg>
                    </el-col>
                    <el-col :span="24">
                        <operateItemSwitch label="是否使用逆时针排列" v-model="currentOperatingCanvasChild.isCounterclockwise">
                        </operateItemSwitch>
                    </el-col>
                </el-row>
            </el-collapse-item>
            <el-collapse-item name="5">
                <template #title>
                    <div class="title">滤镜效果</div>
                </template>
                <operateItemFilterGroup v-model="currentOperatingCanvasChild.filter"></operateItemFilterGroup>
            </el-collapse-item>
        </el-collapse>
    </template>
</template>
    
<script setup lang='ts'>
import { onMounted, ref, computed, watch, reactive, watchEffect, nextTick } from "vue";

import operateItemColor from "@/components/design/layout/canvas/operate/color/index.vue";
import operateItemTextContent from "@/components/design/layout/canvas/operate/textContent.vue";
import operateItemFontSize from "@/components/design/layout/canvas/operate/fontSize.vue";
import operateItemFontWeight from "@/components/design/layout/canvas/operate/fontWeight.vue";
import operateItemFontItalic from "@/components/design/layout/canvas/operate/italic.vue";
import operateItemFontColor from "@/components/design/layout/canvas/operate/fontColor.vue";
import operateItemFontFamily from "@/components/design/layout/canvas/operate/fontFamily/fontFamily.vue";
import operateItemLineHeight from "@/components/design/layout/canvas/operate/lineHeight.vue";
import operateItemLetterSpacing from "@/components/design/layout/canvas/operate/letterSpacing.vue";
import operateItemWritingMode from "@/components/design/layout/canvas/operate/writingMode.vue";
import operateItemSize from "@/components/design/layout/canvas/operate/size/relativeSize.vue";
import operateItemAbsoluteSize from "@/components/design/layout/canvas/operate/size/absoluteSize.vue";
import operateItemPosition from "@/components/design/layout/canvas/operate/position/position.vue";
import operateItemZindex from "@/components/design/layout/canvas/operate/zIndex.vue";
import operateItemBackgroundColor from "@/components/design/layout/canvas/operate/backgroundColor.vue";
import operateItemImageSelect from "@/components/design/layout/canvas/operate/imageSelect/index.vue";
import operateItemSwitch from "@/components/design/layout/canvas/operate/basicSwitch.vue";
import operateItemPadding from "@/components/design/layout/canvas/operate/padding.vue";
import operateItemBorderRadius from "@/components/design/layout/canvas/operate/borderRadius.vue";
import operateItemQrcodeErrorCorrectionLevel from "@/components/design/layout/canvas/operate/qrcodeErrorCorrectionLevel.vue";
import operateItemQrcodeType from "@/components/design/layout/canvas/operate/qrcodeType.vue";
import operateItemBorderWidth from "@/components/design/layout/canvas/operate/border/borderWidth.vue";
import operateItemRectBorderRadius from "@/components/design/layout/canvas/operate/border/rectBorderRadius.vue";
import operateItemAbsoluteUnitSelect from "@/components/design/layout/canvas/operate/absoluteUnitSelect.vue";
import operateItemTextShadow from "@/components/design/layout/canvas/operate/text-shadow/index.vue";
import operateItemRoundTextStartDeg from "@/components/design/layout/canvas/operate/text/roundTextStartDeg.vue";
import operateItemEllipseTextRadius from "@/components/design/layout/canvas/operate/text/ellipseTextRadius.vue";
import operateItemTextStroke from "@/components/design/layout/canvas/operate/text/textStroke.vue";
import operateItemFilterGroup from "@/components/design/layout/canvas/operate/filter/group.vue";
import operateItemObjectFit from "@/components/design/layout/canvas/operate/objectFit.vue";
import operateItemCommonGroup from '@/components/design/layout/canvas/operate/commonGroup.vue';



import {
    updateCanvasStickerOptionsUnit
} from '../helper'

import {
    CanvasController,
    canvasStickerOptions,
    addCanvasChild,
    removeCavnasChild,
    currentOperatingCanvasChildIndex,
    currentCanvasControllerInstance,
    showMainCanvas,
    currentOperatingCanvasChild,
    CanvasChildType,
    updateRenderingCanvas
} from "../index.tsx";


const textCollapseActives = ref(["1", "2", "3", "4", '5']);
</script>
    
<style></style>