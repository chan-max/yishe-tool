<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-02-10 22:16:12
 * @LastEditors: chan-max 2651308363@qq.com
 * @LastEditTime: 2024-02-13 23:44:19
 * @FilePath: /yishe/src/modules/app/views/index/swiper/share/index.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
-->
<template>
    <div class="ion-padding" style="margin-bottom: 24px">
        <h6>最近的朋友和群聊</h6>
        <div class="row"></div>
        <h6>分享给</h6>
        <div class="row">
            <div v-for="item in utils" class="item">
                <cr-image class="img" :src="item.src" @click="item.handler"></cr-image>
                <div class="label">{{ item.label }}</div>
            </div>
        </div>
    </div>

    <ion-modal :is-open="showFriends" :initial-breakpoint="1" :breakpoints="[0, 1]" @didDismiss="showFriends = false">
        <div style="height: 70vh" class="ion-padding">
            <ion-header>
                <div>
                    <ion-searchbar></ion-searchbar>
                </div>
            </ion-header>
            <ion-content>
                <ion-list>
                    <ion-item v-for="i in 20">
                    </ion-item>
                </ion-list>
                <ion-infinite-scroll @ionInfinite="ionInfinite">
                    <ion-infinite-scroll-content></ion-infinite-scroll-content>
                </ion-infinite-scroll>
            </ion-content>
        </div>
    </ion-modal>
    <ion-modal :is-open="showGroup" :initial-breakpoint="1" :breakpoints="[0, 1]" @didDismiss="showGroup = false">
        <div style="height: 70vh" class="ion-padding">
            <ion-header>
                <div>
                    <ion-searchbar></ion-searchbar>
                </div>
            </ion-header>
            <ion-content>
                <ion-list>
                    <ion-item v-for="i in 20">
                    </ion-item>
                </ion-list>
                <ion-infinite-scroll @ionInfinite="ionInfinite">
                    <ion-infinite-scroll-content></ion-infinite-scroll-content>
                </ion-infinite-scroll>
            </ion-content>
        </div>
    </ion-modal>

    <ion-modal :is-open="showFollowing" :initial-breakpoint="1" :breakpoints="[0, 1]" @didDismiss="showFollowing = false">
        <myfollowing :availableModelInfo="availableModelInfo"></myfollowing>
    </ion-modal>

    <ion-modal :is-open="showFollower" :initial-breakpoint="1" :breakpoints="[0, 1]" @didDismiss="showFollower = false">
        <div style="height: 70vh" class="ion-padding">
            <ion-header>
                <ion-searchbar placeholder="寻找我的粉丝"></ion-searchbar>
            </ion-header>
            <ion-content>
                <ion-list>
                    <ion-item v-for="i in 20">
                    </ion-item>
                </ion-list>
                <ion-infinite-scroll @ionInfinite="ionInfinite">
                    <ion-infinite-scroll-content></ion-infinite-scroll-content>
                </ion-infinite-scroll>
            </ion-content>
        </div>
    </ion-modal>
</template>

<script setup>
import { defineProps, ref } from "vue";
import crImage from "@/modules/app/components/image.vue";
import customerService from "@/icon/mobile/customer-service.svg?url";
import myfriend from "@/icon/mobile/myfriend.svg?url";
import mygroup from "@/icon/mobile/mygroup.svg?url";
import iconmyfollowing from "@/icon/mobile/myfollowing.svg?url";
import myfollower from "@/icon/mobile/myfollower.svg?url";

import myfollowing from './myfollowingModal.vue'

const props = defineProps(["availableModelInfo"]);

// 是否展示好友列表弹层
const showFriends = ref(false);

// 是否展示群组弹层
const showGroup = ref(false);

// 是否展示粉丝弹层
const showFollower = ref(false);

/* 最近的好友和群聊 */
const latest = ref([]);

// 是否展示正在关注弹层
const showFollowing = ref(false);

function ionInfinite(e) {
    e.target.complete()
}

/* 功能 */
const utils = ref([
    {
        src: myfriend,
        label: "我的好友",
        handler() {
            showFriends.value = true;
        },
    },
    {
        src: mygroup,
        label: "我的群聊",
        handler() {
            showGroup.value = true;
        },
    },
    {
        src: customerService,
        label: "发给客服",
        handler() {
        },
    },
    {
        src: iconmyfollowing,
        label: "我的关注",
        handler() {
            showFollowing.value = true;
        },
    },
    {
        src: myfollower,
        label: "我的粉丝",
        handler() {
            showFollower.value = true;
        },
    },
]);
</script>
<style lang="less" scoped>
h6 {
    font-size: 12px;
}

.img {
    width: 48px;
    height: 48px;
}

.row {
    width: 100%;
    display: flex;
    padding: 5px;
    column-gap: 18px;
}

.label {
    font-size: 10px;
}

.item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    row-gap: 8px;
}

ion-list {
    background: transparent;
}

ion-item {
    --background: transparent;
}
</style>
