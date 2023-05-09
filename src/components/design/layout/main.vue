<template>
  <div id="designiy-container">
    <div id="designiy-canvas-container" ref="mountContainer"></div>
    <header-menu></header-menu>
  </div>
</template>
<script setup>
import {
  onMounted,
  ref
} from "vue";
import { Designiy } from "../scene/designiy";
import headerMenu from "./headerMenu.vue";
import bgControlForm from "./bgControlForm.vue";

import { AxesHelper, BoxGeometry, Mesh, MeshBasicMaterial } from 'three';

const mountContainer = ref();

let designiy = new Designiy();

designiy.addModel("shirt.glb")

designiy.addAmientLight(0xffffff, 0.2);
designiy.addDirectionalLight(0xffffff, 1, 10, 10, 10);

designiy.setBgColor('#252525')


onMounted(() => {
  designiy.render(mountContainer.value);
});
</script>

<style lang="less">
#designiy-container {
  width: 100%;
  height: 100%;
  position: relative;
}

#designiy-canvas-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
