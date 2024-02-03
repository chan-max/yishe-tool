<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-14 11:33:51
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-02-03 21:16:18
 * @FilePath: /1s/src/modules/app/components/modelComment/comment.vue
 * @Description:
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
-->
<template>
  <div class="comment">
    <ion-header>
      <ion-toolbar>
        <ion-title> 评论（{{ modelInfo.comment_count }}） </ion-title>
        <ion-buttons slot="end">
          <ion-button @click="toggleSort">
            {{ sortType == CommentSortType.HOTEST ? "按热度排序" : "按时间排序" }}
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list class="ion-padding">
        <comment-item v-for="(item, index) in list" @reply="reply" :commentInfo="item" :rootCommentInfo="item">
        </comment-item>
      </ion-list>
      <ion-infinite-scroll @ionInfinite="ionInfinite">
        <ion-infinite-scroll-content></ion-infinite-scroll-content>
      </ion-infinite-scroll>
    </ion-content>
    <ion-footer>
      <div class="footer ion-padding">
        <ion-avatar style="margin-top: 4px">
          <img class="avatar" :src="avatar" />
        </ion-avatar>
        <ion-textarea :auto-grow="false" ref="input" v-model="comment" :placeholder="isReplying ? '正在回复' : '快来评论吧'"
          @ionBlur="ionBlur"></ion-textarea>
        <ion-button @click="addComment" size="small" style="height: 40px">
          {{ isReplying ? "回复" : "评论" }}
          <ion-icon slot="end" :icon="chatbubbleEllipsesOutline"></ion-icon>
        </ion-button>
      </div>
    </ion-footer>
  </div>
</template>
<script setup>
import { reactive, ref, computed, shallowRef } from "vue";
import { modelInfo, sortType, toggleSort } from "./index";
import { addAvailableModelComment, CommentSortType } from "@/api/api/comment";
import { chatbubbleEllipsesOutline } from "ionicons/icons";
import { useLoginStatusStore } from "@/store/stores/login";
import { usePaging } from "@/hooks/data/paging";
import { getAvailableModelComment } from "@/api/api/comment";
import commentItem from "./commentItem.vue";

const loginStore = useLoginStatusStore();

const avatar = computed(() => {
  return loginStore.userInfo?.preview_avatar || "/mobileDefaultAvatar.svg";
});

// 当前评论内容
const comment = ref();

const { page, pages, list, getList } = usePaging((params) => {
  return getAvailableModelComment({
    availableModelId: modelInfo.value.id,
    sortType: sortType.value,
    parentId: 0,
    ...params,
  });
});

const ionInfinite = async (ev) => {
  await getList();
  ev.target.complete();
};

// 评论输入框是否应该获取焦点
const input = ref();

// 是否正在回复中
const isReplying = ref(false);

// 正在回复的评论
const replyingComment = ref();
// 正在评论的根评论
const replyingRootComment = ref();

function reply(current,root) {
  input.value.$el.setFocus();
  isReplying.value = true;
  replyingComment.value = current;
  replyingRootComment.value = root
}

function ionBlur() {
  // 输入框失去焦点, 现在逻辑为输入框为空且失去焦点时失去回复状态
  if (!comment.value) {
    isReplying.value = false;
  }
}

/*
  添加评论
*/

// 评论的父id
const parentId = ref(0);

async function addComment() {
  if (!comment.value) {
    // 无内容
    return;
  }
  
  try {
    // 返回的结果用于反显界面
    const latestComment = await addAvailableModelComment({
      availableModelId: modelInfo.value.id,
      content: comment.value,
      userId: loginStore.userInfo?.id,
      parentId: isReplying.value ? replyingComment.value.id : 0,
      // 为保证 rootid 同一层级的唯一性, 使用当前时间戳
      rootId: isReplying.value ? replyingComment.value.root_id : new Date().getTime(), 
    });
     

    latestComment.t_user = loginStore.userInfo;
    modelInfo.value.comment_count++;

    if (isReplying.value) {
      replyingRootComment.value.children.unshift(latestComment);
    } else {
      // 同步评论数量
      // 同步视图
      // 默认添加的评论作者始终是用户本人，避免再次查库直接使用本地用户信息
      list.value.unshift(latestComment);
      // 清空
    }
    comment.value = "";
    isReplying.value = false;
  } catch (e) {
    alert("评论失败");
  }
}
</script>

<style lang="less" scoped>
.comment {
  width: 100%;
  height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

ion-modal {
  --height: auto;
}

ion-toolbar {
  --background: transparent;
}

ion-list {
  --background: transparent;
}

.list-ios {
  background-color: transparent;
}

ion-avatar {
  flex-shrink: 0;
  height: 30px;
  width: 30px;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: start;
  border-top: 1px solid #eee;
  column-gap: 20px;
}

.dark {
  .footer {
    border-top: 1px solid #222;
  }
}
</style>
