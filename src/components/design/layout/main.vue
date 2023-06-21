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
import stickersTabs from "./stickers/stickersTabs.vue";
import {
  Mesh,
  MeshBasicMaterial,
  Object3D,
  Raycaster,
  Texture,
  TextureLoader,
  Vector3,
} from "three";
import { DecalGeometry } from "three/examples/jsm/geometries/DecalGeometry";

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

designiy.onMainModelClick(() => {
  debugger;
});

// 改变画布背景颜色
watchEffect(() => designiy.setBgColor(CanvasBgColor.value, CanvasBgOpacity.value));

onMounted(() => designiy.render(mountContainer.value));

function dragend(draggingEl) {
  let raycaster = new Raycaster()
  raycaster.setFromCamera(designiy.mouse, designiy.camera);
  const intersects = raycaster.intersectObject(designiy.mainMesh);

  if (intersects.length > 0) {
    var n = intersects[0].face.normal.clone();
    n.transformDirection(designiy.mainMesh.matrixWorld);
    n.add(intersects[0].point);

    let helper = new Object3D();

    helper.position.copy(intersects[0].point);
    helper.lookAt(n);
    
    var position = intersects[0].point;
    var size = new Vector3(0.1, 0.1, 0.1);

    var decalGeometry = new DecalGeometry(designiy.mainMesh, position, helper.rotation, size);

    var decal = new Mesh(decalGeometry, new MeshBasicMaterial({ color: 0xff0000 }));
    designiy.scene.add(decal);
  }
}

// designiy.onClick((des) => {
//   let {
//     mouse,
//     mainMesh,
//     camera,
//     scene
//   } = des;

//   let raycaster = new Raycaster()
//   raycaster.setFromCamera(mouse, camera);
//   const intersects = raycaster.intersectObject(mainMesh);

//   if (intersects.length > 0) {
//     var n = intersects[0].face.normal.clone();
//     n.transformDirection(mainMesh.matrixWorld);
//     n.add(intersects[0].point);

//     let helper = new Object3D();

//     helper.position.copy(intersects[0].point);
//     helper.lookAt(n);

//     var position = intersects[0].point;
//     var size = new Vector3(0.1, 0.1, 0.1);

//     var decalGeometry = new DecalGeometry(mainMesh, position, helper.rotation, size);

//     var decal = new Mesh(decalGeometry, new MeshBasicMaterial({ color: 0xff0000 }));
//     scene.add(decal);
//   }
// });
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
  position: absolute;
  right: 0;
  top: 50px;
  height: calc(100% - 50px);
  width: auto;
  background: #fff;
  border-right: 1px solid #ddd;
  overflow: auto;
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
