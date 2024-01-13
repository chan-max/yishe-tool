<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-13 10:49:39
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-01-13 21:51:54
 * @FilePath: /1s/src/modules/app/views/market/model/modelCard.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
-->
<template>
  <ion-card class="item" @click="go(item)">
    <img alt="preview" :src="item.preview_img" style="width: 100%" />
    <ion-card-header>
      <ion-card-title> {{ item.name || "未命名" }} </ion-card-title>
      <ion-card-subtitle> {{ item.desciption || "无描述" }}</ion-card-subtitle>
    </ion-card-header>
    <ion-card-content>
      <div class="footer">
        <ion-thumbnail slot="start" style="width: 20px; height: 20px">
          <img alt="avatar" :src="item.t_user.preview_avatar" />
        </ion-thumbnail>
        {{ item.t_user.name || "未命名" }}
        <div style="flex: 1"></div>
        {{ timeago(item.createdAt) }}
      </div>
    </ion-card-content>
  </ion-card>
</template>

<script setup>
import { isOpen, modalInfo } from "./index.ts";
import {timeago} from '@/common/time'
const props = defineProps(["item"]);


function go(item) {
  modalInfo.value = item;
  isOpen.value = true;
}
</script>

<style scoped>
.footer {
  display: flex;
  align-items: center;
  column-gap: 6px;
}

ion-thumbnail{
  --border-radius:50%;
}
</style>
