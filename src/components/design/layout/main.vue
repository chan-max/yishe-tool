<template>
  <loading v-if="isLoading"></loading>
  <div class="designiy-top">
    <header-menu/>
  </div>
  <div class="designiy-left">
    <left-menu></left-menu>
  </div>
  <div class="designiy-right"></div>
  <div class="designiy-bottom"></div>
  <div id="designiy-canvas-container" ref="mountContainer"></div>

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
    style="width:300px;height:calc(100% - 35px);"
    :position="{left:'40px',bottom:0}"
  >
    <image-sticker></image-sticker>
  </diydialog>
</template>
<script setup>
import { computed, onMounted, ref, watchEffect ,watch} from "vue";
import { Designiy } from "../designiy";
import headerMenu from "./headerMenu.vue";
import loading from "./loading.vue";
import { canvasBgColor, canvasBgOpacity, showBaseModelSelectDialog ,currentModelInfo,showSceneControlDialog,showImageStickerDialog} from "../store";
import stickersTabs from "./stickers/stickersTabs.vue";
import { message } from "ant-design-vue";
import { ElMessage } from "element-plus";
import leftMenu from "./leftMenu.vue";
import diydialog from "../components/dialog.vue";
import baseModelSelect from "./baseModelSelect/index.vue";
import sceneControl from './sceneControl/index.vue'
import imageSticker from './imageSticker/index.vue'


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
} from "three";
import { DecalGeometry } from "three/examples/jsm/geometries/DecalGeometry";

// 挂载容器
const mountContainer = ref();

const designiy = new Designiy();

// 是否处于加载中
const isLoading = computed(() => designiy.loading.value);

watch(currentModelInfo,() => {
  const {
    file
  } = currentModelInfo.value

  designiy.setMainModel(file)
})







designiy.addDirectionalLight(0xffffff, 0.8, 0, 0, 10);
designiy.addDirectionalLight(0xffffff, 0.8, 0, 0, -10);

// 改变画布背景颜色
watchEffect(() => designiy.setBgColor(canvasBgColor.value, canvasBgOpacity.value));


// 渲染动画
onMounted(() => designiy.render(mountContainer.value));




// 贴图逻辑暂时保留
function dragend(draggingEl) {
  let mesh = designiy.mainMesh;

  if (!mesh) {
    message.info("请先选择模型");
    return;
  }

  const aspectRatio = draggingEl.width / draggingEl.height;

  let raycaster = new Raycaster();

  raycaster.setFromCamera(designiy.mouse, designiy.camera);

  const intersects = raycaster.intersectObject(mesh, true);

  if (intersects.length > 0) {
    var position = intersects[0].point;
    var size = new Vector3(0.1, 0.1 / aspectRatio, 0.1);
    var n = intersects[0].face.normal.clone();
    n.transformDirection(mesh.matrixWorld);
    n.add(intersects[0].point);
    let helper = new Object3D();
    helper.position.copy(intersects[0].point);
    helper.lookAt(n);
    let euler = helper.rotation;
    var decalGeometry = new DecalGeometry(mesh, position, euler, size);

    let texture = new Texture(draggingEl);
    texture.needsUpdate = true;
    var decal = new Mesh(
      decalGeometry,
      new MeshBasicMaterial({ map: texture, transparent: true })
    );
    designiy.scene.add(decal);
  }
}
</script>

<style lang="less">
.designiy-top {
  height: 30px;
  width: 100%;
  position: absolute;
  top: 0;
  z-index: 10;
}

.designiy-left {
  position: absolute;
  left: 0;
  top: 30px;
  height: calc(100% - 30px);
  width: 36px;
  background: #fff;
  border-right: 1px solid #eee;
  overflow: auto;
  z-index: 10;
}

.designiy-right {
  position: absolute;
  right: 0;
  top: 30px;
  height: calc(100% - 30px);
  width: auto;
  background: #fff;
  border-left: 1px solid #eee;
  overflow: auto;
  z-index: 10;
}

.designiy-bottom {
  z-index: 10;
}

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
