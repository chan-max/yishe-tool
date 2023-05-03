
<template>
  <div id="rightMenu">
    <div id="operation">
      <div id="textureCanvas">
        <canvas v-show="currentGltf" ref="textureCanvas" width="300" height="300"></canvas>
        <text v-show="!currentGltf">暂未导入模型</text>
      </div>
      <label>
        选择材质:
        <select v-model="currentOperatingTexture">
          <option v-for="item,index in textureInfos" :key="index" :value="item">{{ item.name }}</option>
        </select>
      </label>
      <label><button>移除该材质</button></label>
      <label>横向坐标: <input type="range" v-model.number="currentOperatingTextureX"> </label>
      <label>纵向坐标: <input type="range" v-model.number="currentOperatingTextureY"> </label>
      <label>贴图宽度: <input type="range" v-model.number="currentOperatingTextureWidth"> </label>
      <label>贴图高度: <input type="range" v-model.number="currentOperatingTextureHeight"> </label>
      <label>顺时针旋转角度: <input type="range" v-model="currentOperatingTextureRotation"> </label>
      <label>图片宽高比始终不变: <input type="checkbox"> </label>
      <label>允许图片裁剪: <input type="checkbox"> </label>
      <label>贴图层级: <input type="number"> </label>
    </div>
    <div id="custom">
      <div id="custom-menu">
        <div @click="importImage"> <i class="bi bi-card-image"></i> 上传图片</div>
        <div @click="createText"><i class="bi bi-fonts"></i> 艺术字贴图</div>
      </div>
      <div id="custom-content">
        <el-scrollbar>
          <div class="texture" v-for="item,index in importedImages" :key="index">
            <img :src="item.url" title="点击添加到操作台" style="width: 100%;" @click="addToOperate(item)">
          </div>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, shallowRef, watchEffect, watch } from "vue";
import { fileToHTMLImageElement } from "../../common/fileToHTMLImageElement";
import { CustomTextureCanvas } from "./utils/customTextureCanvas";
import { importLocalImage } from "../../common/importLocalImage";
import { currentGltf, currentMaterial, currentCustomTextureCanvas, textureCanvas, currentModel } from './utils/store'
import { CanvasTexture, MeshBasicMaterial, Texture } from "three";


// 保存从外界导入的图片资源
const importedImages = reactive([])

async function importImage() {
  let files = await importLocalImage()
  let imgEls = await Promise.all(Array.prototype.map.call(files, fileToHTMLImageElement))
  imgEls.forEach((el, index) => {
    importedImages.push({
      image: el,
      imageWidth: el.width,
      imageHeight: el.height,
      name: files[index].name,
      url: URL.createObjectURL(files[index])
    })
  })
}

// 已进行贴图的图片资源
const textureInfos = reactive([])

// 操作贴图的表单信息
const currentOperatingTexture = shallowRef()
const currentOperatingTextureX = shallowRef()
const currentOperatingTextureY = shallowRef()
const currentOperatingTextureWidth = shallowRef()
const currentOperatingTextureHeight = shallowRef()
const currentOperatingTextureRotation = shallowRef()
const currentOperatingTextureKeep = shallowRef()
const currentOperatingTextureAllowCut = shallowRef()

watch([currentOperatingTextureX, currentOperatingTextureY, currentOperatingTextureWidth, currentOperatingTextureHeight, currentOperatingTextureRotation],
  onFormInfoChange)


const isTextureChange = ref(false)

function onFormInfoChange() {
  // 防止 首次加载引发的更新
  if (isTextureChange.value) {
    isTextureChange.value = false
    return
  }

  if (!currentOperatingTexture.value) {
    return
  }
  // 更新当前材质
  let texture = currentOperatingTexture.value
  texture.x = currentOperatingTextureX.value
  texture.y = currentOperatingTextureY.value
  texture.w = currentOperatingTextureWidth.value
  texture.h = currentOperatingTextureHeight.value
  currentCustomTextureCanvas.value.updateTexture(texture)
  updateModelTexture()
}


// 切换当前的贴图
watch(currentOperatingTexture, onOperatingTextureChange)
function onOperatingTextureChange() {
  let textureInfo = currentOperatingTexture.value
  let { x, y, w, h } = textureInfo
  isTextureChange.value = true
  currentOperatingTextureX.value = x
  currentOperatingTextureY.value = y
  currentOperatingTextureWidth.value = w
  currentOperatingTextureHeight.value = h
  currentCustomTextureCanvas.value.initTexture(currentOperatingTexture.value)
  updateModelTexture()
}


// 确认将图片贴到模型

function addToOperate(img) {

  if (!currentGltf.value) {
    alert('请先导入模型')
    return
  }

  // 此时贴图已经使用到canvas

  // 初始化
  const textureInfo = {
    ...img,
    x: currentOperatingTextureX.value || 0,
    y: currentOperatingTextureY.value || 0,
    w: currentOperatingTextureWidth.value || 0,
    h: currentOperatingTextureHeight.value || 0,
    r: 0
  }

  textureInfos.push(textureInfo)

  currentOperatingTexture.value = textureInfo

  //currentCustomTextureCanvas.value.drawImage(textureInfo.el, 0, 0, 300, 300)
  //   let ctx = currentCustomTextureCanvas.value.context
  //   ctx.save();//保存状态
  //   ctx.translate(150, 150);//设置画布上的(0,0)位置，也就是旋转的中心点
  //   ctx.rotate(45 * Math.PI / 180);
  //   ctx.drawImage(img.el, 0, 0, 50, 50);//把图片绘制在旋转的中心点，
  //   ctx.restore();//恢复状态
}

function updateModelTexture() {
  currentModel.value.material = new MeshBasicMaterial({ map: new CanvasTexture(textureCanvas.value) })
  // currentModel.value.material.map = new CanvasTexture(textureCanvas.value)
}

</script>

<style lang="less">
#rightMenu {
  height: 100%;
  background: #474747;
  box-shadow: 0px 8px 40px rgba(0, 0, 0, 0.35);
  display: flex;
}

#custom {
  border-left: 5px solid #333;
  height: 100%;
  width: 250px;
}

#custom-menu {
  height: 50px;
  display: flex;
  font-size: 14px;
  font-weight: bold;
  justify-content: space-around;
  align-items: center;
  color: #ddd;
  border-bottom: 1px solid #333;
  cursor: pointer;
  & div:hover {
    color: #eee;
  }
}

#custom-content {
  height: calc(100% - 50px);
  & .el-scrollbar__view {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  & .texture {
    cursor: pointer;
    width: 80%;
    cursor: pointer;
    margin: 20px;
  }
}

#operation {
  height: 100%;
  width: 350px;
  display: flex;
  flex-direction: column;
  align-items: center;
  label {
    width: 300px;
    font-weight: bold;
    color: #ddd;
    font-size: 14px;
    padding: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  #textureCanvas {
    margin: 20px;
    width: 300px;
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #555;
    position: relative;
    text {
      position: absolute;
      color: #ddd;
      font-weight: bold;
      font-size: 14px;
    }
  }
}
</style>