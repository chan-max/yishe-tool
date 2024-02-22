<!--
 * @Author: chan-max 2651308363@qq.com
 * @Date: 2023-12-16 12:40:26
 * @LastEditors: chan-max 2651308363@qq.com
 * @LastEditTime: 2024-02-22 22:27:36
 * @FilePath: /yishe/src/modules/main/view/base/home/home.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by 1s, All Rights Reserved. 
-->
<template>
    <div class="home">
        <div class="home-banner">
            <div class="home-banner-main-title">
                开放式服装设计&交易平台
            </div>

            <div class="home-banner-main-desc">
                我们提供一个交互式的市场，使消费者、设计师和制造商能够亲密无间地一起合作，无论身处何方，你都可以通过我们的平台探索创新、发现灵感、购买独特的设计作品，并与全球的时尚爱好者交流。我们相信每一个人都应该有机会打破传统，定制自己的生活方式。借助我们的线上服装设计和交易平台，在你与全球设计师的碰撞与交流中，让你的创新理念和独特范式尽情张扬。
            </div>

            <button class="button-try" @click="$router.push({ name: 'Design' })">
                快速开始
            </button>

            <div class="bannner-model">
                <gltf-viewer :model="modelInfo"></gltf-viewer>
            </div>
        </div>

        <div style="font-size: 20px;color:#555;"> 丰富的内置模型 </div>
        
        <carousel style="width:80%;padding:40px;"></carousel>

        <site-footer></site-footer>
    </div>
</template>

<script setup>

import siteFooter from '../footer/index.vue'
import gltfViewer from "@/components/model/gltfViewer/index.vue";
import carousel from './baseModelCarousel.vue'
import { onMounted, ref } from "vue";
import { getBannerModel } from "@/api";

let modelInfo = ref("");

onMounted(async () => {
    let data = await getBannerModel();
    modelInfo.value = data;
});

</script>

<style>
.home {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
}

.home-banner {
    width: 96%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    row-gap: 20px;
    padding: 120px 0;
    background: transparent;
    background-size: 100% 100%;
    position: relative;
    margin-top: 32px;
    margin-bottom: 32px;
}


.home-banner-main-title {
    font-size: 40px;
    color: #252525;
    font-weight: bold;
    text-align: center;
    line-height: 100px;
}

.home-banner-main-desc {
    color: #444;
    width: 70%;
    text-align: center;
    font-style: italic;
}

.bannner-model {
    height: 400px;
    width: 600px;
    border-radius: 20px;
    background-color: #f7f7f7;
}

.button-try {
    background: transparent;
    border-radius: 8px;
    border: 2px solid #6900ff;
    color: #6900ff;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    font-size: 1em;
    padding: 0.5rem 1rem;
    cursor: pointer;
    transition: all .2s;
    font-size: 18px;
    opacity: .8;
    font-weight: bold;
    margin: 40px;
}

.button-try:hover {
    opacity: 1;
    transform: scale(1.05);
}
</style>
