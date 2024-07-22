<template>
  <el-popover placement="auto" width="auto" trigger="click">
    <template #reference>
      <slot></slot>
    </template>
    <div class="container">
      <el-descriptions :column="2" size="small">
        <template #title>
          贴纸信息
        </template>
        <template #extra>
        </template>
        <el-descriptions-item label="名称" width="120">{{ stickerInfo.name || '未命名' }}</el-descriptions-item>
        <el-descriptions-item label="类型">
          {{ getStickerTypeLabel(stickerInfo.type) || '无' }}
        </el-descriptions-item>
        <el-descriptions-item label="上传者">{{ stickerInfo.uploader?.account || '未知' }}</el-descriptions-item>
        <el-descriptions-item label=""></el-descriptions-item>
        <el-descriptions-item label="上传时间" :span="2">
          {{ stickerInfo.createTime }}
        </el-descriptions-item>
        <el-descriptions-item label="描述" :span="2">
          {{ stickerInfo.description || '无' }}
        </el-descriptions-item>
        <el-descriptions-item label="关键字" :span="2">
          {{ stickerInfo.keywords || '无' }}
        </el-descriptions-item>
        <el-descriptions-item label="操作" :span="2">
          <el-button size="small" round link type="primary" @click="addCanvasBackground"> 添加画布元素背景<el-icon>
              <TopRight />
            </el-icon> </el-button>
        </el-descriptions-item>
      </el-descriptions>
      <el-button-group class="w-full" style="display:flex;">
        <el-button style="flex:1;" @click="use" type="primary"> 使用该贴纸 </el-button>
      </el-button-group>
    </div>
  </el-popover>
</template>
<script setup lang="ts">
import { currentController,showCanvasLayout } from "@/components/design/store";
import { getStickerTypeLabel } from './index'
import { TopRight } from '@element-plus/icons-vue'
import { addCanvasChild, currentOperatingCanvasChildIndex, canvasStickerOptions } from '@/components/design/layout/canvas/index.tsx'


const props = defineProps({
  stickerInfo: {
    default: {} as any
  },
});


// 添加背景元素
function addCanvasBackground() {
  let child = canvasStickerOptions.value.children[currentOperatingCanvasChildIndex.value]
  if (child.type = 'background') {
    child.backgroundImage = props.stickerInfo
  } else {
    addCanvasChild({
      type: 'background',
      backgroundImage: props.stickerInfo
    })
  }
  showCanvasLayout.value = true
}

function use() {
  currentController.value.addClickDelaySticker({
    ...props.stickerInfo,
  });
}
</script>

<style scoped lang="less">
.container {
  width: 300px;
  height: auto;
}

:deep(.el-descriptions__label) {
  // font-weight: bold;
}
</style>

