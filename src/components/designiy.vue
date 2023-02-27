<template>
  <div id="designiy" class="designiy">
    <div id="menu">
      <div style="margin-left: 10px">
        <a title="导入本地模型" @click="importModel">导入</a>
        <a> 自定义素材 </a>
        <a>设置</a>
        <a>编辑</a>
        <a>导入</a>
        <a>导出</a>
        <a> 场景 </a>
        <a>服装底色</a>
        <a @click="addTexture">添加贴图</a>
        <a>添加文字</a>
        <a>尺寸参考</a>
      </div>
    </div>
    <div id="diyContainer" ref="diyContainer"></div>
  </div>
</template>

<script setup>
import * as dat from "dat.gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { onMounted, ref } from "vue";
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
  FrontSide
} from "three";
import { onWindowResize } from "../utils/rerender";
import { importLocalImage } from "../common/importLocalImage";

import { sceneExportToGLTF } from "../common/exportToGLTF";
import { importLocalModel } from "../common/importLocalModel";

const diyContainer = ref();

// 存储整个模型相关的信息
const DESIGN_INFO = {
    currentGLTF:null, // 当前引入的gltf模型
    currentMaterial:null // 当前的贴图材质
};

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

async function importModel() {
  let gltf = await importLocalModel();
  DESIGN_INFO.currentGLTF = gltf;
  scene.add(gltf.scene);
}

async function addTexture() {
  let image = new Image();
  image.src = "examples/me.jpg";

  await waitImage(image);

  let canvas = document.createElement("canvas");
  canvas.width = 100;
  canvas.height = 100;
  let c = canvas.getContext("2d");
  c.fillStyle = "#00ff00";
  c.fillRect(0, 0, 100, 100);
  c.beginPath();
  c.beginPath();
  c.drawImage(image, 10, 10, 80, 80);

  let texture = new CanvasTexture(canvas);

  texture.matrixAutoUpdate = false;
  const material = new MeshBasicMaterial({
    map: texture,
    side: FrontSide,
  });
  DESIGN_INFO.currentMaterial = material
  DESIGN_INFO.currentGLTF.scene.traverse((child) => {
    if (child instanceof Mesh) {
      child.material = material;
    }
  });
}

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
    DESIGN_INFO.currentMaterial.map.wrapS = DESIGN_INFO.currentMaterial.map.wrapT = RepeatWrapping; //设置为可循环
  } else {
    DESIGN_INFO.currentMaterial.wrapS = DESIGN_INFO.currentMaterial.map.wrapT = ClampToEdgeWrapping; //设置会默认的最后一像素伸展
  }
  DESIGN_INFO.currentMaterial.map.needsUpdate = true;
});

function updateUV() {
  // 一种方法，直接全写在一个方法内
  //texture.matrix.setUvTransform( API.offsetX, API.offsetY, API.repeatX, API.repeatY, API.rotation, API.centerX, API.centerY );
  // 另一种方法，分开写
  DESIGN_INFO.currentMaterial.map.matrix
    .identity() //矩阵重置
    .translate(-gui.centerX, -gui.centerY) //设置中心点
    .rotate(gui.rotation) // 旋转
    .scale(gui.repeatX, gui.repeatY) //缩放
    .translate(gui.centerX, gui.centerY) //设置中心点
    .translate(gui.offsetX, gui.offsetY); //偏移
}

const controler = new OrbitControls(camera, renderer.domElement);

function render() {
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

// 轨道控制器

onMounted(() => {
  diyContainer.value.appendChild(renderer.domElement); //body元素中插入canvas对象
  render();
});
</script>

<style>
#designiy {
  position: relative; /* for the absoluate menu */
}

#diyContainer {
  width: 100%;
  height: 100%;
}

#menu {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 35px;
  border-bottom: 5px solid #333;
  background-color: #444;
  display: flex;
  align-items: center;
}
#menu a {
  color: #d5d5d5;
  font-size: 14px;
  padding: 2px 10px;
}
#menu a:hover {
  background: #333;
  cursor: pointer;
}
</style>