<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-02-10 22:16:12
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-02-10 23:08:22
 * @FilePath: /1s/src/modules/app/views/index/swiper/share/index.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
-->
<template>
    <div class="ion-padding">
        <h6>分享给朋友或群聊</h6>
        <div style="width:100%;overflow:auto;">
            <div style="width:1200px;height:60px;"></div>
        </div>
        <h6> 其他 </h6>
        <div style="width:100%;overflow:auto;">
            <div style="width:1200px;height:60px;"></div>
        </div>
    </div>
</template>
    
<script setup lang='ts'>
import { defineProps } from 'vue'
const props = defineProps(["availableModelInfo"]);

</script>
    
<style lang="less" scoped>
h6 {
    font-size: 12px;
}

</style>