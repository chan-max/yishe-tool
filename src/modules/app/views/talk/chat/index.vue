<!--
 * @Author: chan-max 2651308363@qq.com
 * @Date: 2024-02-11 09:10:15
 * @LastEditors: chan-max 2651308363@qq.com
 * @LastEditTime: 2024-02-14 17:11:17
 * @FilePath: /yishe/src/modules/app/views/talk/chat/index.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
-->
<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button></ion-back-button>
                </ion-buttons>
                <ion-title>
                    <div>{{ route.query.title }} </div>
                </ion-title>
                <ion-buttons slot="end">
                    <cr-avatar :src="route.query.avatar" style="width:30px;height:30px;"></cr-avatar>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
            <h1>Page Two</h1>
            <p>Use the back button to navigate to the previous page.</p>
        </ion-content>
    </ion-page>
</template>

<script setup lang='ts'>
import crAvatar from '@/modules/app/components/avatar.vue'
import { useRoute } from 'vue-router'

// 当前聊天室的信息
const route = useRoute()

</script>
<style>
</style>