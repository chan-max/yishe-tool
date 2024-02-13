<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-02-10 22:16:12
 * @LastEditors: chan-max 2651308363@qq.com
 * @LastEditTime: 2024-02-11 21:55:29
 * @FilePath: /yishe/src/modules/app/views/index/swiper/share/index.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
-->
<template>
    <div class="ion-padding" style="margin-bottom: 24px;">
        <h6>最近的朋友和群聊</h6>
        <div class="row">
        </div>
        <h6>分享给</h6>
        <div class="row">
            <div v-for="item in utils" class="item">
                <cr-image class="img" :src="item.src" @click="item.handler"></cr-image>
                <div class="label">{{ item.label }}</div>
            </div>
        </div>
    </div>
    
    <ion-modal :is-open="showFriend" :initial-breakpoint="1" :breakpoints="[0, 1]" @didDismiss="showFriend = false">
        <div style="height: 50vh;" class="ion-padding">
            <ion-content>
                <ion-list>
                    <ion-item v-for="i in 20">{{ i }}</ion-item>
                </ion-list>
            </ion-content>
        </div>
    </ion-modal>
    <ion-modal :is-open="showGroup"></ion-modal>
</template>
    
<script setup lang='ts'>
import { defineProps, ref } from 'vue'
import crImage from '@/modules/app/components/image.vue'
import customerService from '@/icon/mobile/customer-service.svg?url'
import myfriend from '@/icon/mobile/myfriend.svg?url'
import mygroup from '@/icon/mobile/mygroup.svg?url'
const props = defineProps(["availableModelInfo"]);


// 是否展示好友列表
const showFriend = ref(false)

// 是否展示群聊列表
const showGroup = ref(false)


/* 最近的好友和群聊 */
const latest = ref([
])

/* 功能 */
const utils = ref([
    {
        src: myfriend,
        label: '我的好友',
        handler() {
            showFriend.value = true
        }
    },
    {
        src: mygroup,
        label: '我的群聊',
        handler() {

        }
    },
    {
        src: customerService,
        label: '发给客服',
        handler() {

        }
    },
])


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

ion-list{
    background: transparent;
}

ion-item{
    --background:transparent;
}

</style>