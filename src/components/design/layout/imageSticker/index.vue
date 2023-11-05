<template>
    <div class="designiy-image-sticker">
    <div class="designiy-image-sticker-container">
      <div class="designiy-image-sticker-container-item" title="拖动来进行贴图" v-for="i in images" draggable="false">
          <el-image @load="load($event,i)" :src="i.previewUrl" style="width: 100%;height: 100%;" fit="contain" lazy>
            <template #placeholder>
                <div class="designiy-image-sticker-container-item_loading">
                  <el-icon class="rolling-icon"><Loading /></el-icon>
                </div>
            </template>
            <template #error>
                <div class="designiy-image-sticker-container-item_error">
                  <el-icon style="color:#888"><Picture /></el-icon>
                </div>
            </template>
          </el-image>
      </div>
    </div>   
    </div>
</template>
<script setup>
import { onMounted, ref,computed } from "vue";
import {showBaseModelSelectDialog,currentModelInfo,canvasBgColor,canvasBgOpacity} from '../../store.ts'
import { Loading,CloseBold,CircleCloseFilled ,Picture} from "@element-plus/icons-vue";
import {getImageList} from '@/api/index'
import {initDraggableElement} from '../../utils/draggable'

const emits = defineEmits(['dragover'])

const images = ref([])

// image load success
function load(e,i){
  initDraggableElement(e.target,(img) => {
    emits('dragover',img,i)
  })
}


onMounted(async () => {
  images.value = await getImageList();
});
</script>
<style lang="less">

    .designiy-image-sticker-container{
      display: flex;
      flex-wrap: wrap;
      padding: 5px;
      justify-content: space-between;
      width:240px;
    }

    .designiy-image-sticker-container-item{
        margin: 5px 0;
        width:110px;
        height:70px;
        padding: 5px;
        background-color: var(--1s-image-sticker-image-background-color);
        border-radius: 5px;
        cursor:pointer;
        &_loading,&_error{
          width:100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
    }


  @keyframes rolling {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.rolling-icon {
  animation: rolling 3s linear infinite;
}
</style>
  