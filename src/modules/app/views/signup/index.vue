<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-01 14:32:43
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-01-06 22:54:14
 * @FilePath: /1s/src/modules/app/views/signup/index.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
-->
<template>
    <van-tabs v-model:active="active" swipeable>
      <van-tab v-for="index in 4" :title="'选项 ' + index"> 
        <div style="width: 100%;height:100%;">
          内容 {{ index }}
        </div>
      </van-tab>
    </van-tabs>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from "@ionic/vue";
import { ref } from "vue";

const active = ref("");
</script>

<style></style>
