<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-02-07 09:13:37
 * @LastEditors: chan-max 2651308363@qq.com
 * @LastEditTime: 2024-02-11 13:34:06
 * @FilePath: /yishe/src/modules/app/components/image.vue
 * @Description:  移动端通用头像封装, 主要是加载中占位符号，和错误图的处理
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
-->
<template>
  <div class="image" :class="{ round: round }">
    <ion-img
      v-if="!error"
      class="main"
      :src="src"
      @ionImgDidLoad="didLoad"
      @ionError="onError($event)"
    >
    </ion-img>
    <div class="placeholder" v-if="!load && !error">
      <ion-skeleton-text :animated="true"></ion-skeleton-text>
    </div>
    <div class="error" v-if="error">加载失败</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps(["src", "round"]);

function didLoad() {
  load.value = true;
}

// 图片是否加载完成
const load = ref(false);

// 图片是否加载失败
const error = ref(false);

function onError(e) {
  error.value = true;
}
</script>

<style scoped lang="less">
.image {
  width: 100%;
  height: 100%;
  position: relative;
}

ion-skeleton-text {
  margin: 0;
}

.round {
  border-radius: 50%;
}

.main {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
}
.placeholder {
  width: 100%;
  height: 100%;
  position: absolute;
}

.error {
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  background-color: var(--ion-background-color);
}
</style>
