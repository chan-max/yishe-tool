<template>
  <div class="designiy-text-sticker-resource">
    <div class="designiy-text-sticker-resource-header">
      <el-input v-model="input" placeholder="寻找文字贴纸">
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
        <template #suffix>
          <el-icon><Operation /></el-icon>
        </template>
      </el-input>
      <el-select v-model="value" placeholder="选择图片分类">
        <template #prefix>
          <el-icon><FolderOpened /></el-icon>
        </template>
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <div class="designiy-text-sticker-resource-content">
      <div class="designiy-text-sticker-resource-item" v-for="item in data">
        <el-image
          @load="load($event, item)"
          :src="item.imgFullpath"
          style="width: 100%; height: 100%;padding:10px;"
          fit="contain"
          lazy
        >
          <template #placeholder>
            Loading
          </template>
          <template #error>
            error
          </template>
        </el-image>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search, Operation, FolderOpened } from "@element-plus/icons-vue";
import { ref,onBeforeMount } from "vue";
import {getTextSticker} from '@/api'
import {currentController} from '../../store'
import { initDraggableElement } from "../../utils/draggable";
const input = ref("");

const data = ref()

onBeforeMount(async () => {
  data.value = await getTextSticker()
})

function load(e,item){
  var el = e.target
  initDraggableElement(el,() => {
    currentController.value.stickToMousePosition(el)
  })
}

</script>

<style>
.designiy-text-sticker-resource {
  display: flex;
  height: 100%;
  flex-direction: column;
  .el-input__wrapper {
    box-shadow: none;
    background-color: #f9f9f9;
    font-size: 12px;
  }
}

.designiy-text-sticker-resource-header {
  padding: 10px;
  row-gap: 10px;
  display: flex;
  flex-direction: column;
}

.designiy-text-sticker-resource-content {
  width: 100%;
  flex: 1;
  columns: 2;
  column-gap: 6px;
  overflow: auto;
  padding:10px;
}

.designiy-text-sticker-resource-item{
  height:120px;
  margin-bottom: 6px;
  background-color:#fafafa;
  border-radius:10px;
}

</style>
