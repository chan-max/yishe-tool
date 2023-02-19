<template>
  <div id="diyContainer" ref="diyContainer"></div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Color,
  AxesHelper,
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
} from "three";
import { onWindowResize } from "../utils/rerender";

const diyContainer = ref();

function init() {
  // create scene
  const scene = new Scene();
  // create camera
  const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  const renderer = new WebGLRenderer();

  onWindowResize(() => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    // camera.updateProjectionMatrix();
  });

  diyContainer.value.appendChild(renderer.domElement);

  const geometry = new BoxGeometry(1, 1, 1);
  const material = new MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new Mesh(geometry, material);
  scene.add(cube);

  camera.position.z = 5;

  function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
  }
  animate();
}
onMounted(init);
</script>

<style>
#diyContainer {
  width: 100%;
  height: 100%;
}
</style>