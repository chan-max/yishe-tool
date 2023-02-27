<template>
  <div id="designiy" class="designiy">
    <d-menu @importModel="i"></d-menu>
    <div id="diyContainer" ref="diyContainer"></div>
  </div>
</template>

<script setup>
import dMenu from "./menu.vue";
import * as dat from "dat.gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { onMounted, ref, render } from "vue";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { waitImage } from "../common/waitImage";
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
  TextureLoader,
  OrthographicCamera,
  RepeatWrapping,
  ClampToEdgeWrapping,
  PlaneGeometry,
  DoubleSide,
  CanvasTexture,
} from "three";
import { onWindowResize } from "../utils/rerender";
import { importLocalImage } from "../common/importLocalImage";

import { sceneExportToGLTF } from "../common/exportToGLTF";

const diyContainer = ref();

function i(){
    alert(21564)
}

async function init() {
  var scene = new Scene();
  const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const light = new AmbientLight(0xffffff, 10, 100);

  scene.add(light);

  camera.position.set(0, 0, 1);
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

  let image = new Image();
  image.src = "examples/me.jpg";

  await waitImage(image);

  let canvas = document.createElement("canvas");
  canvas.width = 500;
  canvas.height = 500;
  let c = canvas.getContext("2d");
  c.fillStyle = "#00ff00";
  c.fillRect(0, 0, 200, 200);
  c.beginPath();
  c.beginPath();
  c.drawImage(image, 0, 0, 100, 100);

  let texture = new CanvasTexture(canvas);

  texture.matrixAutoUpdate = false;
  const material = new MeshBasicMaterial({
    map: texture,
    side: DoubleSide,
  });

  let canvas2 = document.createElement("canvas");
  canvas2.width = 500;
  canvas2.height = 500;
  let c2 = canvas2.getContext("2d");
  c2.fillStyle = "#0000ff";
  c2.fillRect(300, 300, 200, 200);
  c2.beginPath();
  c2.beginPath();
  c2.drawImage(image, 300, 300, 100, 100);

  let texture2 = new CanvasTexture(canvas2);

  texture2.matrixAutoUpdate = false;
  const material2 = new MeshBasicMaterial({
    map: texture2,
    side: DoubleSide,
  });

  const gui = {
    offsetX: 0,
    offsetY: 0,
    repeatX: 1,
    repeatY: 1,
    rotation: 0,
    centerX: 0.5,
    centerY: 0.5,
    RepeatWrapping: true,
  };
  var datGui = new dat.GUI();
  datGui.add(gui, "offsetX", 0.0, 1.0).onChange(updateUV);
  datGui.add(gui, "offsetY", 0.0, 1.0).onChange(updateUV);
  datGui.add(gui, "repeatX", 0.25, 10.0).onChange(updateUV);
  datGui.add(gui, "repeatY", 0.25, 10.0).onChange(updateUV);
  datGui.add(gui, "rotation", -2.0, 2.0).onChange(updateUV);
  datGui.add(gui, "centerX", 0.0, 1.0).onChange(updateUV);
  datGui.add(gui, "centerY", 0.0, 1.0).onChange(updateUV);
  datGui.add(gui, "RepeatWrapping").onChange(function (e) {
    if (e) {
      material.map.wrapS = material.map.wrapT = RepeatWrapping; //设置为可循环
    } else {
      material.map.wrapS = material.map.wrapT = ClampToEdgeWrapping; //设置会默认的最后一像素伸展
    }
    material.map.needsUpdate = true;
  });

  function updateUV() {
    // 一种方法，直接全写在一个方法内
    //texture.matrix.setUvTransform( API.offsetX, API.offsetY, API.repeatX, API.repeatY, API.rotation, API.centerX, API.centerY );
    // 另一种方法，分开写
    material.map.matrix
      .identity() //矩阵重置
      .translate(-gui.centerX, -gui.centerY) //设置中心点
      .rotate(gui.rotation) // 旋转
      .scale(gui.repeatX, gui.repeatY) //缩放
      .translate(gui.centerX, gui.centerY) //设置中心点
      .translate(gui.offsetX, gui.offsetY); //偏移
  }
  var loader = new GLTFLoader();

  loader.load("examples/model.gltf", function (gltf) {
    scene.add(gltf.scene);
    gltf.scene.traverse((child) => {
      if (child instanceof Mesh) {
        console.log(666);
        // child.material = material2;
      }
    });
  });

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