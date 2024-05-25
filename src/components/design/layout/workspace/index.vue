<template>
  <div class="container">
    <div class="info">
      <base-gltf-viewer
        style="width: 100%; height: 200px; flex-shrink: 0; background: #eee"
        :src="currentOperatingBaseModelInfo?.url"
      ></base-gltf-viewer>
    </div>
    <div class="decal">
      <div class="decal-content">
        <template v-for="decal in stickers">
          <div class="decal-item">
            <el-image
              class="decal-item-image"
              :src="decal.src || decal.base64"
              fit="contain"
            >
            </el-image>
            <div class="decal-item-content">
              <div class="decal-item-content-title">这是一张贴纸</div>
              <div class="decal-item-content-desc">树正不怕月影斜</div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <div class="bottom">
      <el-button round>
        <span style="font-size: 11px; font-weight: 400"> 上传 </span>
      </el-button>
      <el-button
        type="primary"
        round
        style="
          flex: 1;
          background: linear-gradient(
            90deg,
            rgba(105, 0, 255, 1) 0%,
            rgba(105, 0, 255, 0.9) 100%
          );
        "
      >
        <span style="font-size: 11px; font-weight: 400"> 共 4 张贴纸 ， 保存该模型 </span>
      </el-button>
    </div>
  </div>
</template>
<script setup>
import { currentOperatingBaseModelInfo, currentController } from "../../store";
import { computed } from "vue";
import baseGltfViewer from "@/components/model/baseGltfViewer/index.vue";

const stickers = computed(() => {
  return currentController.value.decalControllers.map((decal) => {
    return decal.info;
  });
});
</script>
<style lang="less" scoped>
.container {
  width: 320px;
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
}
.decal {
  flex: 1;
  overflow: auto;
  display: flex;
  flex-direction: column;
}

.decal-content {
  width: 100%;
  height: 100%;
  overflow: auto;
  padding: 20px 0;
}

.decal-item {
  width: 100%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  column-gap: 14px;
  padding: 10px 20px;
  &:hover {
    background: #f6f6f6;
  }
}

.decal-item-image {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
}

.decal-item-content {
  height: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.decal-item-content-title {
  overflow: hidden; //超出的文本隐藏
  text-overflow: ellipsis; //溢出用省略号显示
  white-space: nowrap; //溢出不换行
  font-size: 1.5em;
  color: #999;
}

.decal-item-content-desc {
  overflow: hidden; //超出的文本隐藏
  text-overflow: ellipsis; //溢出用省略号显示
  font-size: 1em;
  color: #aaa;
}

.bottom {
  padding: 1em;
  display: flex;
}
</style>
