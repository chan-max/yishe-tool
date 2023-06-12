<template>
  <loading v-if="isLoading"></loading>
  <div class="designiy-top">
    <header-menu @select-skybox="selectSkybox" @select-model="selectModel" />
  </div>
  <div class="designiy-left">
    <stickers-tabs @dragend="dragend"></stickers-tabs>
  </div>
  <div class="designiy-right"></div>
  <div class="designiy-bottom"></div>
  <div id="designiy-canvas-container" ref="mountContainer"></div>
</template>
<script setup>
import { computed, onMounted, ref, watchEffect } from "vue";
import { Designiy } from "../designiy";
import headerMenu from "./headerMenu.vue";
import loading from "./loading.vue";
import { CanvasBgColor, CanvasBgOpacity } from "../store";
import stickersTabs from "./stickersTabs.vue";

// 挂载容器
const mountContainer = ref();

const designiy = new Designiy();

// 是否处于加载中
const isLoading = computed(() => designiy.loading.value);

function selectModel(model) {
  designiy.setMainModel(model.source);
}

function selectSkybox(skybox) {
  designiy.setSkybox(skybox.source);
}

designiy.addDirectionalLight(0xffffff, 0.8, 0, 0, 10);
designiy.addDirectionalLight(0xffffff, 0.8, 0, 0, -10);



// 改变画布背景颜色
watchEffect(() =>
  designiy.setBgColor(CanvasBgColor.value, CanvasBgOpacity.value)
);

onMounted(() => designiy.render(mountContainer.value));

function dragend() {
  console.log("dragend！！！");
}
</script>

<style lang="less">
.designiy-top {
  height: 50px;
  width: 100%;
  position: absolute;
  top: 0;
}

.designiy-left {
  position: absolute;
  left: 0;
  top: 50px;
  height: calc(100% - 50px);
  width: auto;
  background: #fff;
  border-right: 1px solid #ddd;
  overflow: auto;
}
.designiy-right {
}

.designiy-bottom {
}

#designiy-canvas-container {
  width: 100%;
  height: 100%;
  background: #fff;
  overflow: hidden;
}
</style>
