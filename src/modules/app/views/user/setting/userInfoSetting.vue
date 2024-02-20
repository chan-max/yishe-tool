<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-26 22:01:48
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-02-06 20:08:43
 * @FilePath: /1s/src/modules/app/views/user/setting/userInfoSetting.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
-->
<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button @click="$router.back()"></ion-back-button>
        </ion-buttons>
        <ion-title>编辑个人信息</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list :inset="true">
        <ion-item>
          <ion-avatar slot="start">
            <img
              alt="Silhouette of a person's head"
              src="/defaultMobileAvatar.svg"
            />
          </ion-avatar>
        </ion-item>
        <ion-item>
          <ion-input label="昵称"></ion-input>
        </ion-item>
        <ion-item>
          <ion-input label="签名"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label> 生日 </ion-label>
          <ion-datetime-button datetime="datetime"></ion-datetime-button>
        </ion-item>
        <ion-modal :keep-contents-mounted="true">
          <ion-datetime presentation="date" id="datetime"></ion-datetime>
        </ion-modal>
      </ion-list>
    </ion-content>
  </ion-page>
</template>
<script setup></script>
<style lang="less" scoped>

</style>
