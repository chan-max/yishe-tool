<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-02-07 09:13:37
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-02-07 09:38:45
 * @FilePath: /1s/src/modules/app/components/avatar.vue
 * @Description:  移动端通用头像封装, 主要是加载中占位符号，和错误图的处理
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
-->
<template>
    <ion-avatar>
        <div class="placeholder" v-if="!load && !error">
            <ion-skeleton-text :animated="true"></ion-skeleton-text>
        </div>
        <img :src="src" @load="load = true" @error="onError($event)">
    </ion-avatar>
</template>
    
<script setup lang='ts'>
import { ref } from 'vue'

const props = defineProps([
    'src'
])

// 图片是否加载完成
const load = ref(false)

// 图片是否加载失败
const error = ref(false)

function onError(e) {
    error.value = true
    // 错误图
    e.target.src = '/mobileDefaultAvatar.svg'
}

</script>
    
<style scoped lang="less">
ion-avatar {
    overflow: hidden;
}

.placeholder {
    width: 100%;
    height: 100%;
}
</style>