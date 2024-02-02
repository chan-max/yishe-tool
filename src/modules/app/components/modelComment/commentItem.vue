<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-19 21:34:20
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-02-02 23:49:25
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
      <div class="like" @click="like" :class="{liked:commentInfo.liked}">
         <thumbup class="thumbup" style="width: 14px; height: 14px;"></thumbup>
         {{ commentInfo.like_count || 0 }}
      </div>
    </div>
    <div class="reply" @click="reply(commentInfo)"> 回复 </div>
    <div class="children"></div>
  </div>
</template>
<script setup>
import { defineProps } from "vue";
import { timeago } from "@/common/time";
import thumbup from '@/icon/mobile/thumbup.svg?component';
import {likeAvailableModelComment} from '@/api'

const props = defineProps(["commentInfo"]);

const emits = defineEmits(['reply'])

// 顶评论
async function like() {
  // 只要点过赞，就设为点赞状态
  props.commentInfo.liked = true;
  
  (props.commentInfo.like_count)++
  await likeAvailableModelComment({
    commentId:props.commentInfo.id,
    count: 1
  })
}

function reply(info) {
    emits('reply',info)
}

</script>

<style lang="less" scoped>
.comment-item {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
  padding: 8px 0;
  font-size: 13px;
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
  transition: all .2s;
  padding: 4px;
}

.like:active{
  transform: scale(.8);
}

.liked{
  color: #6900ff;
}

.reply{
  margin-left: 40px;
  font-size: 12px;
  opacity: .6;
}
.reply:active{
  opacity: .8;
  text-decoration: underline;
}
</style>
