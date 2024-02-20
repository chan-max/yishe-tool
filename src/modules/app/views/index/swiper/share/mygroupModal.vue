<!--
 * @Author: chan-max 2651308363@qq.com
 * @Date: 2024-02-14 09:21:55
 * @LastEditors: chan-max 2651308363@qq.com
 * @LastEditTime: 2024-02-14 09:37:18
 * @FilePath: /yishe/src/modules/app/views/index/swiper/share/ mygroupModal.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
-->
<template>
    <div style="height: 70vh">
        <div style="padding-top: 20px;">
            <ion-searchbar placeholder="我关注的人"></ion-searchbar>
        </div>
        <ion-content>
            <div style="padding: 16px;">
                <div v-for="item in list" class="item">
                    <cr-avatar style="width: 32px;height:32px;" :src="item.user_info.preview_avatar"></cr-avatar>
                    <div style="font-size: 18px;"> {{ item.user_info.name }} </div>
                    <div style="flex:1;"></div>
                    <div slot="end" @click="share(item)"> 转发 </div>
                </div>
                <ion-infinite-scroll @ionInfinite="ionInfinite">
                    <ion-infinite-scroll-content></ion-infinite-scroll-content>
                </ion-infinite-scroll>
            </div>
        </ion-content>
    </div>
</template>
    
<script setup>
import { ref } from 'vue';
import { getMyFollowings, } from '@/api'
import { usePaging } from '@/hooks/data/paging.ts'
import crAvatar from '@/modules/app/components/avatar.vue'

const props = defineProps(["availableModelInfo"]);

const { list, getList } = usePaging(getMyFollowings)

async function ionInfinite(e) {
    await getList()
    e.target.complete();
}

function share(item) {
    const availableModelId = props.availableModelInfo.id
    /*
        sendMessage({
            type: 'availableModelShared',
            userId: 
        })
    */
}

</script>
    
<style scoped lang="less">
.item {
    display: flex;
    align-items: center;
    column-gap: 12px;
}
</style>