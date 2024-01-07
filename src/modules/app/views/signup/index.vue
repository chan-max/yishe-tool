<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-01 14:32:43
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-01-07 08:32:08
 * @FilePath: /1s/src/modules/app/views/signup/index.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
-->
<template>
  <ion-page>
    <ion-content>
      <van-swipe v-if="showSwipe" style="width: 100%;height:100%;">
        <van-swipe-item v-for="i in 5">
            <div style="width: 100%;height:100%;display:flex;flex-direction: column;">
                {{ i }}
                <div style="flex:1"></div>
                {{ i }}
            </div>
        </van-swipe-item>
        <template #indicator="{ active, total }">
          <div class="custom-indicator">{{ active + 1 }}/{{ total }}</div>
        </template>
      </van-swipe>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from "@ionic/vue";
import { ref, onMounted } from "vue";

const active = ref("");

const swipe = ref();
const showSwipe = ref(false);

onMounted(() => {
  setTimeout(() => {
    showSwipe.value = true;
  }, 10);
});
</script>

<style>
.my-swipe .van-swipe-item {
  color: #fff;
  font-size: 20px;
  line-height: 150px;
  text-align: center;
  background-color: #39a9ed;
}
</style>
