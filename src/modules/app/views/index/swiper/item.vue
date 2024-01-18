<template>
  <div class="item">
    <div class="image" v-if="showImage">
      <van-image style="width: 100%; height: 100%" fit="cover" :src="item.preview_img">
        <template v-slot:loading>
          <ion-skeleton-text :animated="true"></ion-skeleton-text>
        </template>
      </van-image>
    </div>
    <div class="viewer" v-if="showViewer"></div>
    <div class="menu">
      {{ item }}
    </div>
  </div>
</template>
<script setup>
import { defineProps, ref, onMounted, watch, onUnmounted } from 'vue';
import { activeIndex, activeIndexChange } from "./index.ts";

const props = defineProps(["item", "index"]);

watch(activeIndex,() => {
    if(activeIndex.value == props.index){
        console.log( props.index)
    }
},{immediate:true})

onUnmounted(() => {
  console.log( "onUnmounted")
})

// 是否展示图片
const showImage = ref(true);

// 是否展示模型预览
const showViewer = ref(true);
</script>
<style lang="less" scoped>
.item {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
}

.image {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 2;
}

::v-deep {
  .image img {
    width: 100%;
    height: 100%;
  }
}

.viewer {
  width: 100%;
  height: 100%;
  background: #6900ff;
  position: absolute;
  z-index: 1;
}

.menu {
  width: 100%;
  height: 50px;
  position: absolute;
  bottom: 0;
  z-index: 10;
}
</style>
