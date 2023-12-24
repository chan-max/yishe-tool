<!--
 * @Author: chan-max 2651308363@qq.com
 * @Date: 2023-12-23 20:38:25
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2023-12-24 18:06:12
 * @FilePath: /1s/src/components/design/components/screenshot.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by 1s, All Rights Reserved. 
-->

<template>
  <audio ref="audio">
    <source src="/audio/screenshot.mp3" type="audio/mp3" />
  </audio>
  <Transition name="screenshot" @before-enter="transitioning = true" @after-enter="transitioning = false">
    <div v-if="show" class="screenshot" @mouseenter="mouseenter" @mouseleave="mouseleave">
      <img :src="src" style="width: 100%; height: 100%; object-fit: contain" />
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, defineExpose, nextTick } from "vue";
import {message} from 'ant-design-vue'

// 组件一旦展示就会进入动画流程
const show = ref(false);

// 图片路径
const src = ref();

//截图音频
const audio = ref();

// 清除截图缩略图的定时器
var timer = null

// 动画是否在运行中
const transitioning = ref(false)

function mouseenter(){
  if(transitioning.value) return
  clearTimeout(timer);
}

function mouseleave(){
  clear()
}

function clear(){
  clearTimeout(timer)
  console.log('leave')
  timer = setTimeout(() => {
    show.value = false
  }, 3000);
}



async function execScreenshot(base64) {
  audio.value.play();
  src.value = base64;
  if (show.value) {
    show.value = false;
    await nextTick();
  }
  show.value = true;

  message.success({
    duration:1,
    content:'截图成功'
  })
  clear()
}

defineExpose({
  execScreenshot,
});
</script>
<style>
.screenshot {
  position: fixed;
  z-index: 9;
  z-index: 1;
  width: 200px;
  height: auto;
  right: 30px;
  bottom: 30px;
  border: 5px solid #fff;
  /* animation: screenshot 0.5s forwards; */
  box-shadow: 0px 10px 15px 0px rgba(0, 0, 0, 0.3);
  border-radius: 5px;
}

/* @keyframes screenshot {
  0% {
    width: 100%;
    height: 100%;
    bottom: 0;
    right: 0;
  }
  100% {
    bottom: 30px;
    right: 30px;
    width: 200px;
    height: auto;
  }
} */

.screenshot-enter-from{
  width: 100%;
  height: 100%;
  right: 0;
  bottom: 0;
}

.screenshot-enter-active{
  transition: all .3s ease-out;
}

.screenshot-enter-to{
  width: 200px;
  height: auto;
  right: 30px;
  bottom: 30px;
}


.screenshot-leave-to{
  right: -1000px;
  bottom: 30px;
}

.screenshot-leave-active{
  transition: all 1s;
}
</style>
