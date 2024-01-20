<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-19 21:34:20
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-01-20 00:24:20
 * @FilePath: /1s/src/modules/app/components/modelComment/commentItem.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
-->
<template>
  <div class="comment-item">
    <div class="main">
      <div class="avatar">
        <ion-avatar style="width: 30px; height: 30px">
          <img
            :alt="commentInfo.t_user.preview_avatar"
            :src="commentInfo.t_user.preview_avatar"
          />
        </ion-avatar>
      </div>
      <div class="comment-main">
        <div class="comment-info">
          <span class="name">{{ commentInfo.t_user.name || "未命名" }} </span>
          <span class="timeago"> {{ timeago(commentInfo.createdAt) }}</span>
        </div>
        <div class="comment-content">
          {{ commentInfo.content }}
        </div>
      </div>
      <div class="like">
         <thumbup style="width: 14px; height: 14px;"></thumbup>
         {{ Math.floor(Math.random() * 100) }}
      </div>
    </div>
    <div class="children"></div>
  </div>
</template>
<script setup>
import { defineProps } from "vue";
import { timeago } from "@/common/time";
import thumbup from '@/icon/mobile/thumbup.svg?vueComponent';

const props = defineProps(["commentInfo"]);
</script>

<style lang="less" scoped>
.comment-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;
}

.main {
  width: 100%;
  display: flex;
  justify-content: space-between;
  column-gap: 0px;
  column-gap: 12px;
}

.comment-main {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  width: 0;
  flex: 1;
}

.comment-info {
  display: flex;
  column-gap: 8px;
}
.comment-content {
  padding: 5px;
  font-size: 12px;
  text-align: left;
}

.name,
.timeago {
  font-size: 12px;
}

.name {
  font-weight: bold;
}
.timeago {
  opacity: 0.4;
}

.like{
  font-size: 12px;
  display: flex;
  align-items: center;
  column-gap: 4px;
}
</style>
