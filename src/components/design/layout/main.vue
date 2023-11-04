<template>
  <div id="designiy-canvas-container" ref="mountContainer"></div> 
  <loading v-if="isLoading"></loading>
  <diydialog    
    :header="false"
    style="width:100%;height:var(--1s-header-height);top:0;"
    >
    <header-menu/>
  </diydialog>

  <diydialog     
    :header="false"
    style="left:0;bottom:0;width:var(--1s-left-menu-width);height:calc(100% - var(--1s-header-height))"
    >
    <left-menu></left-menu>
  </diydialog>


  <diydialog :header="false" style="height:var(--1s-bottom-menu-height);bottom:30px;">
    <bottom-menu></bottom-menu>
  </diydialog>


  <diydialog
    :show="showBaseModelSelectDialog"
    title="选择模型"
    @close="showBaseModelSelectDialog = false"
  >
    <base-model-select></base-model-select>
  </diydialog>

  <diydialog
    title="设置场景"
    :show="showSceneControlDialog"
    @close="showSceneControlDialog = false"
  >
    <scene-control></scene-control>
  </diydialog>
  <diydialog
    :header="false"
    :show="showImageStickerDialog"
    style="height:calc(100% - var(--1s-header-height));bottom:0;left:calc(var(--1s-left-menu-width) + 2px);"
  >
    <image-sticker @dragover="stickeOn"></image-sticker>
  </diydialog>
  <diydialog
    :header="false"
    :show="showTextStickerDialog"
    style="height:calc(100% - var(--1s-header-height));bottom:0;left:calc(var(--1s-left-menu-width) + 2px);"
  >
    <text-sticker></text-sticker>
  </diydialog>

  <diydialog
    :header="false"
    :show="showWorkTreeDialog"
    style="height:calc(100% - var(--1s-header-height));bottom:0;right:0;"
  >
    <work-tree></work-tree>
  </diydialog>

  <diydialog
    :header="false"
    :show="showDecalControlDialog"
    style="height:calc(100% - var(--1s-header-height));bottom:0;right:0;"
  >
    <decal-control></decal-control>
  </diydialog>
</template>
<script setup>
import { computed, onMounted, ref, watchEffect ,watch} from "vue";
import { ModelController } from "../core/controller";
import headerMenu from "./headerMenu.vue";
import loading from "./loading.vue";
import { 
  currentController,canvasBgColor,
  canvasBgOpacity, showBaseModelSelectDialog ,
  currentModelInfo,showSceneControlDialog,
  showImageStickerDialog,
  showTextStickerDialog,showWorkTreeDialog, showDecalControlDialog,
  isLoading
  } from "../store";
import { message } from "ant-design-vue";
import { ElMessage } from "element-plus";
import leftMenu from "./leftMenu.vue";
import diydialog from "../components/dialog.vue";
import baseModelSelect from "./baseModelSelect/index.vue";
import sceneControl from './sceneControl/index.vue'
import imageSticker from './imageSticker/index.vue'
import textSticker from './textSticker/index.vue'
import workTree from './workTree/index.vue'
import bottomMenu from './bottomMenu.vue'
import decalControl from './decalControl/index.vue'

import {
  Mesh,
  MeshBasicMaterial,
  Object3D,
  Raycaster,
  Texture,
  TextureLoader,
  Vector3,
  BoxGeometry,
  Euler,
DirectionalLight,
AmbientLight,
PointLight,
AxesHelper,
} from "three";
import { DecalGeometry } from "three/examples/jsm/geometries/DecalGeometry";

isLoading.value = true

// 挂载容器
const mountContainer = ref();

const modelController = new ModelController();

const { scene } = modelController

currentController.value = modelController

watch(currentModelInfo,() => {
  const {file} = currentModelInfo.value;
  modelController.setMainModel(file)
})

// 创建场景、相机和渲染器等...

// 添加环境光
const ambientLight = new AmbientLight(0xffffff, 0.5); // 设置颜色和强度
scene.add(ambientLight);

// 添加平行光
const directionalLight1 = new DirectionalLight(0xffffff, 0.4); // 设置颜色和强度
directionalLight1.position.set(1, 1, 1); // 设置光源位置
scene.add(directionalLight1);

// 添加平行光
const directionalLight2 = new DirectionalLight(0xffffff, 0.4); // 设置颜色和强度
directionalLight2.position.set(-1, -1, -1); // 设置光源位置
scene.add(directionalLight2);

// 添加点光源
const pointLight = new PointLight(0xffffff, 0.4); // 设置颜色和强度
pointLight.position.set(0, 0, 2); // 设置光源位置
scene.add(pointLight);


// scene.add(new AxesHelper(0.5))

// 改变画布背景颜色
watchEffect(() => modelController.setBgColor(canvasBgColor.value, canvasBgOpacity.value));

// 渲染动画
onMounted(() => {
  modelController.render(mountContainer.value);
  isLoading.value = false
});

// 贴图逻辑暂时保留
function stickeOn(img,info) {
  modelController.stickOnMousePosition(img,info)
}

</script>

<style lang="less">

#designiy-canvas-container {
  width: 100%;
  height: 100%;
  background: #fff;
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

.designiy-center-float {
  z-index: 10;
}
</style>