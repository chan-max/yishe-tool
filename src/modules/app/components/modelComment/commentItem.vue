<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-19 21:34:20
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-02-04 15:41:02
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
          <img :src="commentInfo.t_user.preview_avatar || '/mobileDefaultAvatar.svg'" />
        </ion-avatar>
      </div>
      <div class="comment-main">
        <div class="comment-info">
          <span class="name">{{ commentInfo.t_user.name || "未命名" }} </span>
          <span class="timeago"> {{ timeago(commentInfo.createdAt) }}</span>
          <div style="flex:1"></div>
        </div>
        <div class="comment-content">
          {{ commentInfo.content }}
        </div>
      </div>
      <div class="like" @click="like" :class="{ liked: commentInfo.liked }">
        <thumbup class="thumbup" style="width: 14px; height: 14px;"></thumbup>
        {{ commentInfo.like_count || 0 }}
      </div>
    </div>
    <div class="operate">
      <span class="reply" @click="reply(commentInfo, rootCommentInfo)"> 回复 </span>
      <span class="delete" v-if="loginStore.userInfo?.id == commentInfo.user_id" @click="deleteComment(commentInfo,rootCommentInfo)"> 删除
      </span>
    </div>
    <div v-if="commentInfo.children && commentInfo.parent_id == 0 && commentInfo.root_children_count" class="children">
      <comment-item v-for="item in commentInfo.children" :root-comment-info="rootCommentInfo" :comment-info="item"
        @reply="reply"></comment-item>
    </div>
    <div v-if="commentInfo.parent_id == 0 && commentInfo.root_children_count" class="more" @click="more(commentInfo)">
      {{ loading ? '加载中...' : '查看更多回复' }}
    </div>
  </div>
</template>
<script setup>
import { defineProps } from "vue";
import { timeago } from "@/common/time";
import thumbup from '@/icon/mobile/thumbup.svg?component';
import { likeAvailableModelComment } from '@/api'
import { getAvailableModelComment, deleteAvailableModelComment } from "@/api/api/comment";
import commentItem from './commentItem.vue'
import { modelInfo, sortType, toggleSort } from "./index";
import { usePaging } from "@/hooks/data/paging";
import { useLoginStatusStore } from "@/store/stores/login";

const loginStore = useLoginStatusStore()

const props = defineProps(["commentInfo", "rootCommentInfo"]);

const emits = defineEmits(['reply','delete'])

// 顶评论
async function like() {
  // 只要点过赞，就设为点赞状态
  props.commentInfo.liked = true;
  (props.commentInfo.like_count)++
  await likeAvailableModelComment({
    commentId: props.commentInfo.id,
    count: 1
  })
}

function reply(commentInfo, rootCommentInfo) {
  emits('reply', commentInfo, rootCommentInfo)
}

/*
  获取评论的子评论
*/
const { list, getList, loading } = usePaging((params) => {
  return getAvailableModelComment({
    isChildren: true,
    availableModelId: modelInfo.value.id,
    sortType: sortType.value,
    rootId: props.commentInfo.root_id,
    ...params,
  });
}, {
  immediate: false,
  pageSize: 10
});

// 将子评论保留在节点上
props.commentInfo.children = list


async function more() {
  await getList();
}

async function deleteComment(commentInfo,rootCommentInfo) {
  await deleteAvailableModelComment({ 
    commentId: props.commentInfo.id, 
    rootCommentId:props.rootCommentInfo.id,
    availableModelId: modelInfo.value.id 
  })
  emits('delete',commentInfo,rootCommentInfo)
  // 处理删除反显
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
  align-items: center;
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

.like {
  font-size: 12px;
  display: flex;
  align-items: center;
  column-gap: 4px;
  transition: all .2s;
  padding: 4px;
}

.like:active {
  transform: scale(.8);
}

.liked {
  color: #6900ff;
}

.reply {
  font-size: 12px;
  opacity: .6;
}

.reply:active {
  opacity: .8;
}

.more {
  margin-left: 40px;
  padding: 5px 0;
  font-size: 12px;
  opacity: .6;
  display: flex;
  align-items: center;
}

.more:active {
  opacity: 1;
}

.more::before {
  content: '';
  height: 1px;
  background: var(--ion-text-color);
  width: 20px;
  margin-right: 8px;
  opacity: .4;
}

.more::after {
  content: '';
  height: 1px;
  background: var(--ion-text-color);
  width: 20px;
  margin-left: 8px;
  opacity: .4;
}

.children {
  margin-left: 20px;
}

.delete {
  font-size: 12px;
  opacity: .9;
  color: var(--ion-color-danger);
}

.delete:active {
  opacity: 1;
}

.operate {
  margin-left: 40px;
  display: flex;
  justify-content: space-between;
  column-gap: 6px;
}
</style>
