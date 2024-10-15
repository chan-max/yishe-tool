<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-28 20:45:34
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-01-28 22:05:03
 * @FilePath: /1s/src/modules/main/view/user/login/qrcodeLogin.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
-->
<template>
  <div class="qrcode-login">
    <div ref="qrcode" class="qrcode"></div>
    <div class="desc">打开移动端扫码登录</div>
    <a style="font-size: 12px" @click="loginType = LoginType.PASSWORD"> 返回账号登录 </a>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeMount } from "vue";
import { loginType, LoginType } from "./index.tsx";
import { QRCode } from "easyqrcodejs";
import { UAParser } from "ua-parser-js";
import { requestQRCodeLoginInfo } from "@/api";

const qrcode = ref();

onMounted(async () => {
  const parser = new UAParser();
  let result = parser.getResult();
  const info = {
    os: result.os.name,
    browser: result.browser.name,
    time: new Date(),
    location: "",
  };
  let res = await requestQRCodeLoginInfo(info);

  let options = {
    text: JSON.stringify(res.data),
  };

  new QRCode(qrcode.value, options);
});

const status = ref("expired");
</script>

<style scoped>
.qrcode-login {
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 10px;
}

.desc {
  font-size: 12px;
}
</style>
