<!--
 * @Author: chan-max 2651308363@qq.com
 * @Date: 2023-12-16 12:40:26
 * @LastEditors: chan-max 2651308363@qq.com
 * @LastEditTime: 2024-02-12 19:43:18
 * @FilePath: /yishe/src/modules/main/view/base/home/home.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by 1s, All Rights Reserved. 
-->
<template>
 <div class="home">
    <banner></banner>
    <div style="height:3000px;"></div>
 </div>
</template>

<script setup>
import banner from './banner.vue'
</script>

<style>

.home{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
}

</style>
