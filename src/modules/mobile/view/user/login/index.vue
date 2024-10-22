<template>
  <div
    style="width: 100%; height: 100%; row-gap: 24px"
    class="flex flex-col items-center justify-center"
  >
    <h1 style="width: 90vw">欢迎登录到衣设</h1>
    <van-form @submit="onSubmit" style="width: 100vw" label-width="48px">
      <van-cell-group inset>
        <van-field
          v-model="loginForm.account"
          name="用户"
          label="用户"
          placeholder="用户名或手机号"
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <van-field
          v-model="loginForm.password"
          type="password"
          name="密码"
          label="密码"
          placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
      </van-cell-group>
      <div style="margin: 16px">
        <van-button round block type="primary" native-type="submit" :loading="loading">
          提交
        </van-button>
      </div>
    </van-form>
    <div class="flex items-center justify-between" style="width: 80vw">
      <a @click="forget">忘记密码</a>
      <a @click="signup">快速注册</a>
    </div>
  </div>
</template>

<script setup>
import { reactive, toRaw, ref, computed, onMounted, nextTick } from "vue";
import { login } from "@/api/index";
import { ResponseStatusCodeEnum } from "@common/statusCode.js";
import { useLoginStatusStore } from "@/store/stores/login";
import { useRouter, useRoute } from "vue-router";
import { message } from "ant-design-vue";
import { ElMessage } from "element-plus";

import { View, Hide, User, Lock } from "@element-plus/icons-vue";
import { doLoginAction } from "@/store/stores/loginAction";
import iconQrcode from "@/icon/qrcode-half.svg?component";
import {
  openLoginDialog,
  showLoginFormModal,
} from "@/modules/main/view/user/login/index.tsx";
import { showToast } from "vant";

const userStore = useLoginStatusStore();
const router = useRouter();

const route = useRoute();

const loading = ref(false);

const isOnce = ref(false);

const loginForm = reactive({
  account: "",
  password: "",
});

async function onSubmit(form) {
  try {
    loading.value = true;
    let res = await login(toRaw(loginForm));
    doLoginAction(res.data, isOnce.value);

    showToast("登录成功");
    router.replace("/");
    await nextTick();
    loading.value = false;
  } catch (e) {
    loading.value = false;
  }
}

function signup() {
  router.push({ name: "Signup" });
}

function forget() {
  showToast("请联系客服");
}
</script>

<style lang="less"></style>
