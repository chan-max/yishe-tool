<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2023-12-16 12:40:26
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2023-12-16 23:12:29
 * @FilePath: /1s/src/modules/main/view/market/index.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by 1s, All Rights Reserved. 
-->
<template>
  <div class="market-container">
    <div class="market-title"></div>
    <div class="market-content">
      <card
        class="market-item"
        v-for="model in modelList"
        @click="edit(model)"
        :model="model"
      ></card>
    </div>
  </div>
</template>
<script setup>
import { getModelList } from "@/api/index";
import { onMounted, ref } from "vue";
import card from "./card.vue";
import { useRouter } from "vue-router";

const router = useRouter();

const modelList = ref();

onMounted(async () => {
  modelList.value = await getModelList();
});

function edit(model) {
  return
  router.push({
    name: "Design",
    query: {
      id: model.id,
    },
  });
}


</script>
<style>
.market-container {
  width: 100%;
  height: 100%;
  overflow: auto;
}

.market-title {
  font-size: 40px;
  font-weight: 500;
  color: #444;
  height: 60px;
  background-color: #fff;
}

.market-item {
  width: 280px;
  height: 160px;
}

.market-content {
  max-width: 1520px;
  margin: auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-auto-rows: 180px;
  justify-items: center;
}
</style>
