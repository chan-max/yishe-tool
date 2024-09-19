<template>
  <div class="banner flex flex-col items-center">

    <div style="z-index: 3;" class="title animate-gradient-text">开放式设计 & 交易平台
    </div>
    <div style="z-index: 3;" class="subtitle">开放式设计 & 交易平台</div>
    <div class="bar" style="z-index: 999;">
      <el-button size="large" type="primary" round @click="$router.push({ name: 'Design' })" class="font-bold">
        在线工具
      </el-button>
      <el-button size="large" round @click="$router.push({ name: 'Market' })" class="font-bold"> 逛一逛 </el-button>
    </div>
    <!-- <img src="/wave.svg" style="width: 100%;position:absolute;opacity:.3;bottom:-300px"> -->

    <vue-danmaku ref="danmukuRef" :debounce="333" useSlot v-model:danmus="danmus" loop :speeds="66" :top="48"
      :right="48" isSuspend style="height:90vh; width:100vw;position:absolute;top:10vh;left:0;z-index:2;">
      <template v-slot:dm="{ index, danmu }">
        <img style="width:100px;height:100px;border-radius: 5%;object-fit: contain;" :src="danmu.thumbnail">
      </template>
    </vue-danmaku>

    <div class="background">
    </div>

    <div class="circles circle-one"></div>
    <div class="circles circle-two"></div>
    <div class="circles circle-three"></div>
  </div>
</template>

<script setup lang="ts">
import vueDanmaku from 'vue3-danmaku'
import { usePaging } from "@/hooks/data/paging.ts";
import Api from '@/api'
import Utils from '@/common/utils'
import _ from 'lodash'
import { useResizeObserver } from '@vueuse/core'
import { useWindowSize, useDebounceFn } from '@vueuse/core'




const danmus = computed(() => {
  return _.shuffle([
    ...CustomModelList.value,
    ...StickerList.value
  ])
})



const { list: CustomModelList, getList: getCustomModelList, } = usePaging(
  (params) => {
    return Api.getCustomModelList({
      ...params,
      pageSize: 20,
      myUploads: false,
      random: true
    });
  },
  {
    forEach(item) {
      item.thumbnail = Utils.formatUrl(item.thumbnail)
      item.url = Utils.formatUrl(item.url)
    },
  }
);

const { list: StickerList, getList: getStickerList, } = usePaging(
  (params) => {
    return Api.getStickerList({
      ...params,
      pageSize: 20,
      myUploads: false,
      random: true
    });
  },
  {
    forEach(item) {
      item.thumbnail = Utils.formatUrl(item.thumbnail)
      item.url = Utils.formatUrl(item.url)
    },
  }
);


const danmukuRef = ref()




const { width, height } = useWindowSize()


// 监听窗口尺寸变化
watch([width, height], useDebounceFn(() => {
  danmukuRef.value.resize()
}))

</script>

<style scoped lang="less">
.banner {
  width: 100vw;
  height: 100vh;
  // background-color: #161616;
  background-color: #f5f5f7;
  padding-top: 32vh;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(2px);
  user-select: none;
}

.title {
  font-size: 72px;
  font-weight: bold;
}

.subtitle {
  font-size: 2em;
  color: #6e6e73;
  font-weight: 300;
}

.bar {
  padding: 20px;
}



.animate-gradient-text {

  background: radial-gradient(circle at 10% 20%, rgb(0, 0, 0) 0%, rgb(64, 64, 64) 90.2%);
  background-size: 200%;
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;
  background-clip: text;
  animation: animated-gradient 5s ease-in-out infinite;
}

/* Простенька Keyframe анімація */
@keyframes animated-gradient {

  0%,
  100% {
    background-position: 0 50%;
  }

  50% {
    background-position: 100% 50%;
  }
}



.banner {
  position: relative;
}





.background {
  height: 100%;
  width: 100%;
  backdrop-filter: blur(50px);
  display: grid;
  place-content: center;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}


</style>
