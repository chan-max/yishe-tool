<template>
  <div class="container">
    <div class="info">
      <div class="preview">
        <base-gltf-viewer style="flex-shrink: 0; background: #eee"
          :src="currentOperatingBaseModelInfo?.url"></base-gltf-viewer>
      </div>
    </div>
    <div class="decal">
      <div class="decal-content" v-if="currentModelController?.decalControllers.length">
        <template v-for="(decal, index) in currentModelController.decalControllers" :key="index">
          <div class="decal-item" :class="{ active: isActive(decal) }">
            <desimage :src="decal.info.src" fit="contain" class="decal-item-image"></desimage>
            <div class="decal-item-content">
              <div class="decal-item-content-title text-ellipsis">名称</div>
              <div class="decal-item-content-desc text-ellipsis">
                添加于 {{ formatDate(decal.createdAt) }}
              </div>
            </div>
            <div style="flex: 1"></div>
            <div class="decal-item-bar">
              <el-button-group>
                <el-button link size="small" round>
                  <el-icon>
                    <icon-more></icon-more>
                  </el-icon>
                </el-button>
                <el-button link size="small" round @click="setting(decal)">
                  <el-icon>
                    <icon-setting></icon-setting>
                  </el-icon>
                </el-button>
                <el-button @click="removeDecal(decal)" link round type="danger">
                  <el-icon>
                    <icon-delete></icon-delete>
                  </el-icon>
                </el-button>
              </el-button-group>
            </div>
          </div>
        </template>
      </div>
      <template v-else>
        <div class="w-full h-full flex items-center justify-center">暂无贴纸</div>
      </template>
    </div>

    <div class="bottom">
      <el-button round>
        <span> 上传 </span>
      </el-button>
      <el-button :disabled="!currentModelController?.decalControllers.length" @click="showSaveModel = true" type="primary"
        round style="flex: 1">
        <span>
          共 {{ currentModelController?.decalControllers.length }} 张贴纸 ， 保存该模型
        </span>
      </el-button>
    </div>
  </div>
</template>
<script setup>
import {
  currentOperatingBaseModelInfo,
  currentModelController,
  showSaveModel,
  operatingDecal,
  showDecalControl,
} from "../../store";
import { computed, ref } from "vue";
import baseGltfViewer from "@/components/model/baseGltfViewer/index.vue";
import { useNow, useDateFormat } from "@vueuse/core";
import { MoreFilled, CloseBold, Edit, EditPen } from "@element-plus/icons-vue";
import iconSetting from "./setting.svg";
import iconDelete from "./remove.svg";
import iconMore from "./more.svg";
import desimage from '@/components/design/components/image.vue'


function formatDate(date) {
  const d = useDateFormat(date, "YYYY-MM-DD HH:mm:ss");
  return d.value;
}

function isActive(decal) {
  return decal.mouseover.value;
}

function setting(decal) {
  operatingDecal.value = decal;
  showDecalControl.value = true;
}

function removeDecal(decal) {
  decal.remove();
}
</script>
<style lang="less" scoped>
.container {
  width: 360px;
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
}

.info {
  padding: 1rem;
  display: flex;
  justify-content: space-between;
}

.preview {
  position: relative;
  width: 100%;
  height: 240px;
}

.decal {
  flex: 1;
  overflow: auto;
}

.decal-content {
  flex: 1;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  row-gap: 0.5rem;
}

.decal-item {
  width: 100%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  background-color: #f9f9f9;
  column-gap: 1rem;
  padding: 1rem;
  border-radius: 1rem;
  transition: all 0.3s;

  &:hover {
    box-shadow: rgba(115, 0, 255, 0.3) 0px 0px 0px 3px;
    cursor: pointer;
  }
}

.active {
  box-shadow: rgba(115, 0, 255, 0.3) 0px 0px 0px 3px;
}

.decal-item-image {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
}

.decal-item-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.decal-item-content-title {
  overflow: hidden; //超出的文本隐藏
  text-overflow: ellipsis; //溢出用省略号显示
  white-space: nowrap; //溢出不换行
  font-size: 1em;
  color: #555;
}

.decal-item-content-desc {
  overflow: hidden; //超出的文本隐藏
  text-overflow: ellipsis; //溢出用省略号显示
  font-size: 0.9em;
  color: #aaa;
}

.decal-item-bar {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;

  :deep(.el-button) {
    padding: 0 0.5em;
  }
}

.bottom {
  padding: 1em;
  display: flex;
}
</style>
