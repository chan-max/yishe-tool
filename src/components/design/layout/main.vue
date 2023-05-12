<template>
  <div id="designiy-container">
    <div id="designiy-canvas-container" ref="mountContainer"></div>
    <header-menu></header-menu>
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { Designiy } from "../scene/designiy";
import headerMenu from "./headerMenu.vue";
import bgControlForm from "./bgControlForm.vue";
import { DecalGeometry } from "three/examples/jsm/geometries/DecalGeometry.js";
import { AxesHelper, BoxGeometry, Mesh, MeshBasicMaterial, Object3D, Raycaster, Vector3 } from "three";

const mountContainer = ref();

let designiy = new Designiy();

designiy.setMainModel("black_shirt.glb");

designiy.addAmientLight(0xffffff, 0.2);
designiy.addDirectionalLight(0xffffff, 0.8, 0, 0, 10);
designiy.addDirectionalLight(0xffffff, 0.8, 0, 0, -10);

designiy.setBgColor("#252525");

designiy.onClick((des) => {
  let {
    mouse,
    mainMesh,
    camera,
    scene
  } = des;


  let raycaster = new Raycaster()
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(mainMesh);
  if (intersects.length > 0) {
    var n = intersects[0].face.normal.clone();
    n.transformDirection(mainMesh.matrixWorld);
    n.add(intersects[0].point);

    let helper = new Object3D();

    helper.position.copy(intersects[0].point);
    helper.lookAt(n);

    var position = intersects[0].point;
    var size = new Vector3(0.1, 0.1, 0.1);

    var decalGeometry = new DecalGeometry(mainMesh, position, helper.rotation, size);
    
    var decal = new Mesh(decalGeometry, new MeshBasicMaterial({ color: 0xff0000 }));
    scene.add(decal);
  }
});

onMounted(() => designiy.render(mountContainer.value));
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
