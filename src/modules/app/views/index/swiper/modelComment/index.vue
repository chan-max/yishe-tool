<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-14 11:33:51
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-02-10 21:27:46
 * @FilePath: /1s/src/modules/app/views/index/swiper/modelComment/index.vue
 * @Description:
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
-->
<style lang="less" scoped src="./index.less"></style>
<template>
  <div class="comment">
    <ion-header>
      <ion-toolbar>
        <ion-title> 评论({{ availableModelInfo.comment_count }}) </ion-title>
        <div class="sort" slot="end" @click="toggleSort">
          <template v-if="sortType == CommentSortType.HOTEST">
            <div>按热度排序</div>
            <hot-sort></hot-sort>
          </template>
          <template v-else>
            <div>按时间排序</div>
            <time-sort></time-sort>
          </template>
        </div>
      </ion-toolbar>
    </ion-header>
    <ion-content class="comment-content">
      <div v-if="firstLoading" class="w-full h-full flex justify-center items-center">
        <ion-spinner name="dots"></ion-spinner>
      </div>
      <ion-list v-else-if="availableModelInfo.comment_count" class="ion-padding" lines="none">
        <bar v-for="item in list" :commentInfo="item" @reply="reply(item, item)" @like="like"
          @delete="deleteComment(item, item)" @more="more(item)" :show-delete="loginStore.userInfo?.id == item.user_id"
          :show-more="item.root_children_count" :loading-children="item.loading">
          <template v-if="item.children && item.children.length" #children>
            <bar v-for="itemChild in item.children" :commentInfo="itemChild" @reply="reply(itemChild, item)" @like="like"
              @delete="deleteComment(itemChild, item)" :show-delete="loginStore.userInfo?.id == itemChild.user_id"
              :show-more="false">
            </bar>
          </template>
        </bar>
      </ion-list>
      <div v-else class="w-full h-full flex justify-center items-center flex-col opacity-10">
        <no-comment style="width:80px;height:80px"></no-comment>
        <span class="font-bold">暂无评论</span>
      </div>
      <ion-infinite-scroll @ionInfinite="ionInfinite">
        <ion-infinite-scroll-content></ion-infinite-scroll-content>
      </ion-infinite-scroll>
    </ion-content>
    <ion-footer>
      <div class="footer ion-padding">
        <ion-textarea :auto-grow="true" fill="outlined" placeholder="快来评论吧～" ref="commentInput" v-model="commentInputContent"
          @ionBlur="ionBlur">
        </ion-textarea>
        <div @click="addComment" style="text-wrap: nowrap;">
          {{ isReplying ? ' 回复' : '评论' }}
        </div>
      </div>
    </ion-footer>
  </div>
</template>
<script setup>
import { sortType, toggleSort } from "./index";
import { CommentSortType, getAvailableModelComment, addAvailableModelComment, deleteAvailableModelComment } from "@/api/api/comment";
import bar from "./bar.vue";
import { usePaging } from "@/hooks/data/paging.ts";
import { useLoginStatusStore } from "@/store/stores/login";
import { likeAvailableModelComment } from "@/api";
import { chatbubbleEllipsesOutline } from "ionicons/icons";
import { ref, watch } from "vue";
import { vibrate, impact } from '@/modules/app/helper/device.ts';
import timeSort from '@/icon/mobile/time-sort.svg?component';
import hotSort from '@/icon/mobile/hot-sort.svg?component';
import noComment from '@/icon/mobile/no-comment.svg?component'


const loginStore = useLoginStatusStore();

const props = defineProps(["availableModelInfo"]);

const { list, getList, reset ,loading,firstLoading} = usePaging((params) => {
  return getAvailableModelComment({
    availableModelId: props.availableModelInfo.id,
    sortType: sortType.value,
    parentId: 0, // 获取所有根评论
    ...params,
  });
}, {
  resListFilter: (item) => {
    // 过滤掉出现过的评论
    return list.value.every((child) => child.id != item.id)
  }
});

const ionInfinite = async (ev) => {
  await getList();
  ev.target.complete();
};

// 输入框的引用
const commentInput = ref()

// 输入框的内容
const commentInputContent = ref()

// 是否在回复
const isReplying = ref(false)
// 正在回复的评论
const replyingComment = ref();
// 正在评论的根评论
const replyingRootComment = ref();

/* 切换排序方式 */
watch(sortType, async () => {
  // 直接清空原有数据，并且加载一次
  reset()
  await getList()
})

/* 回复根评论 */
function reply(current, root) {
  commentInput.value.$el.setFocus();
  isReplying.value = true;
  replyingComment.value = current;
  replyingRootComment.value = root
}


function ionBlur() {
  // 输入框失去焦点, 现在逻辑为输入框为空且失去焦点时失去回复状态
  if (!commentInput.value) {
    isReplying.value = false;
  }
}

/* 添加新评论 */
async function addComment() {
  if (!commentInputContent.value) {
    // 无内容
    return;
  }

  try {
    // 返回的结果用于反显界面
    const latestComment = await addAvailableModelComment({
      availableModelId: props.availableModelInfo.id,
      content: commentInputContent.value,
      userId: loginStore.userInfo?.id,
      parentId: isReplying.value ? replyingComment.value.id : 0,
      // 注：如果是根评论,其根id就是其id，在后台生成数据时生成
      rootId: isReplying.value ? replyingComment.value.root_id : '',
    });

    // 
    latestComment.t_user = loginStore.userInfo;
    // 更新评论数

    if (isReplying.value) {
      if (!replyingRootComment.value.children) {
        replyingRootComment.value.children = []
      }

      replyingRootComment.value.children.unshift(latestComment);
    } else {
      list.value.unshift(latestComment);
    }

    // reset 状态
    commentInputContent.value = "";
    isReplying.value = false;
    replyingComment.value = null
    replyingRootComment.value = null
    props.availableModelInfo.comment_count++
  } catch (e) {
    alert("评论失败");
  }
}


/* 删除评论 */
async function deleteComment(commentInfo, rootCommentInfo) {
  await deleteAvailableModelComment({
    commentId: commentInfo.id,
    rootCommentId: rootCommentInfo.id,
    availableModelId: props.availableModelInfo.id
  })
  // 删除成功

  if (commentInfo.id == rootCommentInfo.id) {
    // 根评论
    list.value.splice(list.value.indexOf(commentInfo), 1)
  } else {
    // 子评论
    rootCommentInfo.children.splice(rootCommentInfo.children.indexOf(commentInfo), 1)
  }

  props.availableModelInfo.comment_count--
}

/*
  查看更多
  目前缺少剩多少条的功能
*/
async function more(commentInfo) {
  // 暂未初始化 
  if (!commentInfo.getList) {
    if (!commentInfo.children) {
      commentInfo.children = []
    }
    const { getList, loading } = usePaging((params) => {
      return getAvailableModelComment({
        isChildren: true,
        availableModelId: props.availableModelInfo.id,
        sortType: sortType.value,
        rootId: commentInfo.root_id,
        ...params,
      });
    }, {
      initialList: commentInfo.children,
      immediate: false,
      pageSize: 10,
      // 这里使用过滤是因为可能会出现用户新增评论，然后再加载评论，导致重复的问题
      resListFilter: (item) => {
        // 过滤掉出现过的评论
        return commentInfo.children.every((child) => child.id != item.id)
      }
    });

    // 执行获取列表
    commentInfo.getList = getList;
    commentInfo.loading = loading;
    await getList()
  } else {
    // 已经初始化
    commentInfo.getList()
  }
}

/*
  点赞评论 , 相对独立的模块，需要加防抖 
*/
async function like(commentInfo) {
  await likeAvailableModelComment({
    commentId: commentInfo.id,
    count: 1,
  });
  impact()
  // 反显状态
  commentInfo.liked = true;
  commentInfo.like_count++;
}
</script>

