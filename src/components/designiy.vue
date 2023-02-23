<template>
  <div id="designiy" class="designiy">
    <d-menu></d-menu>
    <div id="diyContainer" ref="diyContainer"></div>
  </div>
</template>

<script setup>
import dMenu from "./dMenu.vue";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { onMounted, ref, render } from "vue";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
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
} from "three";
import { onWindowResize } from "../utils/rerender";

const diyContainer = ref();

function init() {
  var scene = new Scene();
  const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const light = new AmbientLight(0xffffff, 10, 100);

  scene.add(light);

  camera.position.set(0, 0, 10);
  camera.lookAt(0, 0, 0);

  var renderer = new WebGLRenderer();
  renderer.setClearColor(0x252525); //设置背景颜色
  onWindowResize(() => {
    renderer.setSize(window.innerWidth, window.innerHeight); //设置渲染区域尺寸
    camera.aspect = window.innerWidth / window.innerHeight; // 保持缩放时模型不变形
    camera.updateProjectionMatrix();
  });

  diyContainer.value.appendChild(renderer.domElement); //body元素中插入canvas对象
  //执行渲染操作   指定场景、相机作为参数

  const loader = new GLTFLoader();

  loader.load(
    "examples/shirt.glb",
    function (model) {
      model.scene.scale.set(5, 5, 5);
      scene.add(model.scene);
      renderer.render(scene, camera);
    },
    undefined,
    function (error) {
      console.error(error);
    }
  );

  const controler = new OrbitControls(camera, renderer.domElement);

  function render() {
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  render();
}

// 轨道控制器

onMounted(init);
</script>


<style>
#designiy {
  position: relative; /* for the absoluate menu */
}

#diyContainer {
  width: 100%;
  height: 100%;
}
</style>