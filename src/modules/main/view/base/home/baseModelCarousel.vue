<!--
 * @Author: chan-max 2651308363@qq.com
 * @Date: 2024-02-21 23:15:13
 * @LastEditors: chan-max 2651308363@qq.com
 * @LastEditTime: 2024-02-22 10:06:23
 * @FilePath: /yishe/src/modules/main/view/base/home/baseModelCarousel.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
-->
<template>
  <div class="container" ref="container">
    <img v-for="item in items" :src="item.preview_img">
  </div>
</template>

<script setup lang="ts">
import { getBaseModel } from "@/api";
import { onBeforeMount, ref } from "vue";
import { useElementSize } from "@vueuse/core";

const container = ref(null);
const { width, height } = useElementSize(container);

const items = ref()

onBeforeMount(async () => {
  items.value = await getBaseModel();
});
</script>

<style scoped>
.container{
    width: 100%;
    display: flex;
    overflow:auto;
    flex-shrink: 0;
    column-gap: 20px;
}

img{
    height: 100px;
    width: 300px;
    object-fit: cover;
    transition: all .3s;
}

img:hover{
    transform: scale(1.2);
}
</style>
