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
        <ion-avatar style="width:30px;height:30px">
          <img
            :alt="commentInfo.t_user.preview_avatar"
            :src="commentInfo.t_user.preview_avatar"
          />
        </ion-avatar>
      </div>
      <div class="content">评论内容</div>
      <div style="flex: 1"></div>
      <div class="save">点赞</div>
    </div>
    <div class="children"></div>
  </div>
</template>
<script setup>
import { defineProps } from "vue";

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
  column-gap: 20px;
}
</style>
