<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-01 21:36:27
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-02-04 10:37:32
 * @FilePath: /1s/src/modules/app/views/login/index.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
-->
<template>
  <ion-page>
    <ion-content :fullscreen="true" class="ion-padding">
      <div class="page">
        <ion-list-header style="padding-left:calc(var(--ion-safe-area-left, 0px) + 8px);">
          <ion-label>
            <div style="padding:20px 0">
              登录到衣设
            </div>
          </ion-label>
        </ion-list-header>
        <ion-list lines="none">
          <ion-item>
            <ion-input
              label="账号或邮箱"
              label-placement="floating"
              v-model="form.account"
              placeholder=""
              fill="outline"
            ></ion-input>
          </ion-item>
          <ion-item>
              <ion-input
                label="密码"
                label-placement="floating"
                v-model="form.password"
                type="password"
                placeholder=""
                fill="outline"
              ></ion-input>
          </ion-item>
          
          <ion-item>
            <div style="width:100%;display:flex;justify-content: end;">
              <a class="forget">忘记密码？</a>
            </div>
          </ion-item>
          <ion-item >
            <ion-button size="default" style="width: 100%" @click="submit" expand="block">
              登 录
            </ion-button>
          </ion-item>
          <ion-item>
            <a class="signup" @click="signup"> 一键快速注册 </a>
          </ion-item>
        </ion-list>
      </div>
    </ion-content>
  </ion-page>
</template>
<script setup>
import { ref, reactive } from "vue";

import { ResponseStatusCodeEnum } from "@common/statusCode.js";

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonBackButton,
  IonInput,
  IonList,
  IonItem,
  IonLabel,
  IonListHeader,
  loadingController,
  toastController,
} from "@ionic/vue";
import { eye, lockClosed, person, checkmarkCircle, closeCircle } from "ionicons/icons";
import { login } from "@/api";
import { doLoginAction } from "@/store/stores/loginAction";
import { useRouter } from "vue-router";

const router = useRouter();

const form = reactive({ account: "", password: "" });

async function submit() {
  const toast = await toastController.create({
    duration: 1000,
    position: "bottom",
  });

  const loading = await loadingController.create({
    message: "正在登录...",
    duration: 0,
  });
  loading.present();
  try {
    const res = await login(form);
    await loading.dismiss();
    switch (res.status) {
      case ResponseStatusCodeEnum.LOGIN_SUCCESS:
        toast.message = "登录成功";
        toast.icon = checkmarkCircle;
        toast.style = "color:var(--ion-color-success)";
        doLoginAction(res.data);
        await toast.present();
        setTimeout(() => {
          router.push({ path: "/" });
        }, 1000);
        break;
      case ResponseStatusCodeEnum.PASSWORD_ERROR:
        toast.message = "密码错误";
        await toast.present();
        break;
      case ResponseStatusCodeEnum.ACCOUNT_NOT_EXIST:
        toast.icon = closeCircle;
        toast.style = "color:var(--ion-color-danger)";
        toast.message = "账号不存在";
        await toast.present();
        break;
    }
  } catch (e) {
    loading.dismiss();
  }
}

function forgetPassword(){
  router.push({
    name:"ForgetPassword"
  })
}

function signup(){
  router.push({
    name:"Signup"
  })
}

</script>

<style lang="less" scoped>
.page {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  justify-content: center;
  position: relative;
}


ion-input{
  border-bottom: 1px solid #ddd;
}

.dark{
  ion-input{
    border-bottom: 1px solid #222;
  }
}

a{
  font-size: 12px;
}

.signup{
  text-align: center;
  width: 100%;
  color: #3665f3;
}


</style>
