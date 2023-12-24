<!--
 * @Author: chan-max 2651308363@qq.com
 * @Date: 2023-12-16 12:40:26
 * @LastEditors: chan-max 2651308363@qq.com
 * @LastEditTime: 2023-12-23 08:09:33
 * @FilePath: /1s/src/modules/main/view/base/home/home.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by 1s, All Rights Reserved. 
-->
<template>
 <div class="home">
    <banner></banner>
    <div style="height:300px;"></div>
 </div>
</template>

<script setup>
import banner from './banner.vue'
</script>

<style>

.home{
    height: 100%;
    overflow: auto;
}

.home-news{
    width:100%;
    height: 52px;
    background: #4f95f7;
    line-height:52px;
    text-align: center;
    color:#fff;
}
</style>
