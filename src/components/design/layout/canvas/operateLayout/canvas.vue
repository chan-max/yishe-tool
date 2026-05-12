<template>
  <el-collapse v-model="canvasCollapseActives">
    <el-collapse-item name="5" title="快捷操作">
      <div class="canvas-actions">
        <el-button
          type="primary"
          size="small"
          :icon="CloudUploadOutlined"
          :loading="saveLoading"
          @click="handleSaveSticker"
        >
          保存贴纸
        </el-button>
        <el-button
          size="small"
          :icon="DownloadOutlined"
          :loading="exportLoading"
          @click="handleExportPng"
        >
          导出PNG
        </el-button>
        <el-popconfirm
          title="确定清空画布？所有元素将被删除，此操作不可撤销。"
          confirm-button-text="清空"
          cancel-button-text="取消"
          :icon="DeleteOutlined"
          icon-color="#ff4d4f"
          @confirm="handleClearCanvas"
        >
          <template #reference>
            <el-button
              size="small"
              :icon="DeleteOutlined"
              danger
            >
              清空画布
            </el-button>
          </template>
        </el-popconfirm>
      </div>
    </el-collapse-item>
    <el-collapse-item name="1" title="画布配置">
      <operateItemAbsoluteSize label="画布尺寸(px)" v-model:width="currentOperatingCanvasChild.width"
        v-model:height="currentOperatingCanvasChild.height">
      </operateItemAbsoluteSize>

      <operateCanvasSizePresets @select="handlePresetSelect"></operateCanvasSizePresets>

      <!-- 不再支持画布单位选择，默认全部使用px -->
      
      <!-- <operateItemAbsoluteUnitSelect @change="absoluteUnitChange" label="画布尺寸单位" v-model="canvasStickerOptions.unit">
      </operateItemAbsoluteUnitSelect> -->

      <operateItemSwitch label="在主画布中显示" v-model="showMainCanvas"></operateItemSwitch>
      
      <operateAspectRatio @change="aspectRatioChange"></operateAspectRatio>

      <!-- <operateItemSwitch label="显示真实大小" v-model="canvasStickerOptions.showCanvasRealSize"></operateItemSwitch> -->
      <operateItemColor label="辅助背景颜色" tooltip="用于辅助画布中的元素，不会对实际画布产生影响" type="pure"
        v-model="canvasStickerOptions.supportBackgroundColor"></operateItemColor>

    </el-collapse-item>
    <el-collapse-item name="2" title="画布属性">

      <operateItemColor label="画布背景颜色" tooltip="画布背景颜色" v-model="currentOperatingCanvasChild.backgroundColor">
      </operateItemColor>

      <operateItemFontSize label="画布基础字号" v-model="currentOperatingCanvasChild.fontSize">
      </operateItemFontSize>

    </el-collapse-item>
    <el-collapse-item name="4" title="画布滤镜效果">
      <operateItemFilterGroup v-model="currentOperatingCanvasChild.filter"></operateItemFilterGroup>
    </el-collapse-item>
    <operateItemClipPath v-model="currentOperatingCanvasChild.clipPath"></operateItemClipPath>
  </el-collapse>
</template>
    
<script setup lang='ts'>
import { onMounted, ref, computed, watch, reactive, watchEffect, nextTick } from "vue";
import { message } from "ant-design-vue";
import { CloudUploadOutlined, DownloadOutlined, DeleteOutlined } from "@ant-design/icons-vue";
import { canvasToFile, downloadByFile } from '@/common/transform';
import { uploadToCOS } from '@/api/cos';
import { createSticker } from '@/api';
import { useLoginStatusStore } from '@/store/stores/login';
import Utils from '@/common/utils';
import operateAspectRatio from '@/components/design/layout/canvas/operate/aspectRatio.vue';
import operateCanvasSizePresets from '@/components/design/layout/canvas/operate/size/canvasSizePresets.vue';
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
import operateItemClipPath from '@/components/design/layout/canvas/operate/clipPath/index.vue';

import {
  updateCanvasStickerOptionsUnit
} from '../helper'

import {
  CanvasController,
  canvasStickerOptions,
  addCanvasChild,
  removeCavnasChild,
  currentCanvasControllerInstance,
  showMainCanvas,
  currentOperatingCanvasChild,
  CanvasChildType,
  updateRenderingCanvas,
  renderingLoading
} from "../index.tsx";

const saveLoading = ref(false)
const exportLoading = ref(false)

const canvasCollapseActives = ref(["1", "2", "3", "4", "5"])

watchEffect(() => {
  const canvasChild = currentOperatingCanvasChild.value
  if (!canvasChild || canvasChild.type !== 'canvas' || canvasChild.fontSize) {
    return
  }

  canvasChild.fontSize = {
    unit: 'px',
    value: 32,
  }
})


function absoluteUnitChange(unit) {
  updateCanvasStickerOptionsUnit(unit)
}


// 改变宽高比
function aspectRatioChange(asepctRatio) {

  /**
   * 分为基于宽度或高度
  */
 let canvasChild = canvasStickerOptions.value.children.find((item) => item.type == 'canvas');

  canvasChild.height.value =  Number((canvasChild.width.value / asepctRatio).toFixed(2))
}

function handlePresetSelect(preset: { width: number, height: number }) {
  let canvasChild = canvasStickerOptions.value.children.find((item: any) => item.type == 'canvas');
  if (canvasChild) {
    canvasChild.width.value = preset.width;
    canvasChild.height.value = preset.height;
  }
}

async function waitForRender(controller: any) {
  await new Promise<void>((resolve, reject) => {
    let attempts = 0
    const check = () => {
      if (!controller.loading.value && !renderingLoading.value) {
        resolve()
        return
      }
      attempts++
      if (attempts > 200) {
        reject(new Error('画布渲染超时'))
        return
      }
      setTimeout(check, 50)
    }
    check()
  })
}

async function handleSaveSticker() {
  const controller = currentCanvasControllerInstance.value
  if (!controller) {
    message.error('画布控制器未初始化')
    return
  }

  const loginStore = useLoginStatusStore()
  if (!loginStore.isLogin) {
    message.warning('请先登录后再保存贴纸到素材库')
    return
  }

  saveLoading.value = true
  try {
    await controller.activeUpdateRenderingCanvas()
    await waitForRender(controller)

    const canvasEl = controller.canvasEl
    if (!canvasEl) {
      message.error('画布元素未找到')
      return
    }

    const trimmedCanvas = Utils.trimCanvas(canvasEl)
    const file = await canvasToFile(trimmedCanvas)

    const cos = await uploadToCOS({
      file,
      category: 'sticker',
      account: loginStore.userInfo?.account || loginStore.userInfo?.name || undefined,
      userId: loginStore.userInfo?.id,
    })

    const name = `贴纸_${new Date().toLocaleString().replace(/[/:]/g, '-')}`
    await createSticker({
      url: cos.url,
      suffix: 'png',
      name,
      description: '',
      keywords: '',
      isCustom: true,
      meta: {
        data: JSON.parse(JSON.stringify(canvasStickerOptions.value)),
      },
      userId: loginStore.userInfo?.id || null,
    })

    message.success(`贴纸「${name}」已保存到素材库`)
  } catch (err: any) {
    message.error(`保存失败: ${err?.message || '未知错误'}`)
  } finally {
    saveLoading.value = false
  }
}

function handleClearCanvas() {
  const canvasChild = canvasStickerOptions.value.children.find((c: any) => c.type === 'canvas')
  if (!canvasChild) {
    message.error('画布未初始化')
    return
  }
  const count = canvasStickerOptions.value.children.filter((c: any) => c.type !== 'canvas').length
  canvasStickerOptions.value.children = [canvasChild]
  currentOperatingCanvasChildId.value = canvasChild.id
  message.success(`已清空画布，共删除 ${count} 个元素`)
}

async function handleExportPng() {
  const controller = currentCanvasControllerInstance.value
  if (!controller) {
    message.error('画布控制器未初始化')
    return
  }

  exportLoading.value = true
  try {
    await controller.activeUpdateRenderingCanvas()
    await waitForRender(controller)

    const canvasEl = controller.canvasEl
    if (!canvasEl) {
      message.error('画布元素未找到')
      return
    }

    const trimmedCanvas = Utils.trimCanvas(canvasEl)
    const filename = `design_${new Date().toLocaleString().replace(/[/:]/g, '-')}`
    const file = await canvasToFile(trimmedCanvas, `${filename}.png`)
    downloadByFile(file)

    message.success(`已导出 ${filename}.png`)
  } catch (err: any) {
    message.error(`导出失败: ${err?.message || '未知错误'}`)
  } finally {
    exportLoading.value = false
  }
}

</script>

<style lang="less" scoped>
.canvas-actions {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
</style>
