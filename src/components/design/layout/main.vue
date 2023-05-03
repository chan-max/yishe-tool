<template>
  <loading v-if="isLoading"></loading>
  <div id="design-canvas-container" ref="mountContainer"></div>

</template>

<script setup>
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Color,
  AxesHelper,
  AmbientLight,
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  Vector3,
  BufferGeometry,
  Line,
  LineBasicMaterial,
  MeshLambertMaterial,
  PointLight,
  OrthographicCamera,
  RepeatWrapping,
  ClampToEdgeWrapping,
  PlaneGeometry,
  DoubleSide,
  CanvasTexture,
  FrontSide,
  SphereGeometry,
  BoxHelper,
} from "three";
import loading from "./loading.vue";
import * as dat from "dat.gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { computed, getCurrentInstance, onMounted, ref, render, shallowRef, watch } from 'vue';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { waitImage } from "../../../common/waitImage";
import { debounce, getElementPureHeight, getElementPureWidth, onWindowResize } from "../utils/utils";
import { importLocalImage } from "../../../common/importLocalImage";
import { importLocalModel } from "../../../common/importLocalModel";
import { Loading } from "@element-plus/icons-vue";
import { importBuiltInModel } from "../../../common/importBuiltInModel";
import { useDraggable } from "@vueuse/core";
import { ModelInfo } from '../const'
import { currentGltf, showRightMenu, isLoading, container, currentModel, currentMaterial, textureCanvas, currentCustomTextureCanvas, currentFilename } from '../store';
import { setBasicLight } from '../scene/lightControl';  
import { Designiy } from '../scene/instance/Designiy'

const mountContainer = ref()


const setup = () => {
  let designiy = new Designiy({
    container: mountContainer.value
  })


  designiy.scene.add(new Mesh(new BoxGeometry(1,1,1),new MeshBasicMaterial()))


  designiy.render()
}


onMounted(setup)
</script>

<style lang="less">
#design-canvas-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>