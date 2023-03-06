
<template>
  <div id="rightMenu">
    <div class="header">
      <a v-for="title in ['素材资源','帮助']" :key="title" @click="page = title" :class="page === title ? 'active' : null">{{title }}</a>
    </div>
    <div class="content">
      <div id="custom" v-if="page === '素材资源'" style="height: 100%;">
        <div v-if="page === '素材资源'" id="custom-menu">
          <div @click="importImage"> <i class="bi bi-card-image"></i> 上传图片</div>
          <div @click="createText"><i class="bi bi-fonts"></i> 艺术字贴图</div>
        </div>
        <div id="custom-content">
          <el-scrollbar>
            <div class="texture" v-for="item,index in importedImages" :key="index">
              <img :src="item.url" style="width: 100%;" @click="$emit('addTexture',$event.target)">
            </div>
          </el-scrollbar>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { fileToHTMLImageElement } from "../../common/fileToHTMLImageElement";

import { importLocalImage } from "../../common/importLocalImage";
const page = ref('帮助');

const importedImages = reactive([])

async function importImage() {
  let files = await importLocalImage()
  let imgEls = await Promise.all(Array.prototype.map.call(files, fileToHTMLImageElement))
  imgEls.forEach((el, index) => {
    importedImages.push({
      el: el,
      url: URL.createObjectURL(files[index])
    })
  })
}


function createText() {
  // 打开创建艺术字弹窗
  debugger
}

</script>

<style lang="less">
#rightMenu {
  height: 100%;
  width: 300px;
  background: #474747;
  box-shadow: 0px 8px 40px rgba(0, 0, 0, 0.35);
}

#rightMenu .header {
  background: #323232;
  display: flex;
  height: 40px;
  justify-content: left;
  align-items: center;
  a {
    height: 100%;
    line-height: 40px;
    padding: 0 10px;
    color: #ddd;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
  }
  .active {
    background: #474747;
    color: #fff;
  }
}

#rightMenu .content {
  height: calc(100% - 40px);
}

#custom {
  height: 100%;
}

#custom-menu {
  height: 30px;
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
  height: calc(100% - 30px);
  & .el-scrollbar__view {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  & .texture {
    cursor: pointer;
    width: 80%;
    cursor: pointer;
    margin-top: 20px;
  }
}
</style>