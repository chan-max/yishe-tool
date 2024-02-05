<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-02-04 19:33:16
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-02-05 08:27:51
 * @FilePath: /1s/src/modules/app/components/modelComment/bar.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
-->
<template>
    <div class="bar">
        <div class="avatar">
            <ion-avatar style="width: 30px; height: 30px">
                <img :src="commentInfo.t_user.preview_avatar || '/mobileDefaultAvatar.svg'" />
            </ion-avatar>
        </div>
        <div class="main">
            <div class="header">
                <div class="name">{{ commentInfo.t_user.name || "他还没起名字" }}</div>
                <div class="timeago">{{ timeago(commentInfo.createdAt) }}</div>
            </div>
            <div class="content">
                {{ commentInfo.content }}
            </div>
            <div class="footer">
                <div class="reply" @click="$emit('reply')">回复</div>
                <div v-show="showDelete"  class="delete" @click="$emit('delete')">删除</div>
            </div>
            <div class="children">
                <slot name="children"></slot>
            </div>
            <div class="more" @click="$emit('more')" v-show="showMore"> 
                {{ loadingChildren ? '正在加载中...' : '查看更多评论' }}
            </div>
        </div>
        <div class="like" :style="{ color: commentInfo.liked && '#6900ff' }">
            <thumbup @click="$emit('like', commentInfo)" style="width: 14px; height: 14px;margin:4px;"
                ></thumbup>
            {{ commentInfo.like_count || 0 }}
        </div>
    </div>
</template>

<script setup>
import thumbup from "@/icon/mobile/thumbup.svg?component";
import { timeago } from "@/common/time";
const props = defineProps({
    commentInfo: {},
    showDelete: {
        default: false
    },
    showMore: {
        default: false
    },
    // 是否正在加载子评论
    loadingChildren:{
        default: false
    }
});


const emits = defineEmits([
    'reply', // 回复
    'like', // 喜欢
    'delete', // 删除
    'more' // 更多
])

</script>

<style scoped lang="less">
.bar {
    display: flex;
    width: 100%;
    height: auto;
    column-gap: 12px;
    padding: 10px;
}

.main {
    flex: 1;
    display: flex;
    flex-direction: column;
    row-gap: 10px;
}

.header {
    font-size: 11px;
    display: flex;
    align-items: center;
    column-gap: 10px;

    .name {
        opacity: 0.8;
    }

    .timeago {
        opacity: 0.4;
    }
}

.content {
    font-size: 14px;
}

.footer {
    display: flex;
    align-items: center;
    column-gap: 10px;
    font-size: 12px;

    .reply {
        opacity: .8;
    }

    .delete {
        opacity: .8;
        color: var(--ion-color-danger);
    }
}

.like {
    display: flex;
    padding: 4px 0;
}

.more {
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
</style>
