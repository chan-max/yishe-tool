<template>
  <div
    style="width: 100%; height: 100%; row-gap: 24px"
    class="flex flex-col items-center justify-center"
  >
    <h1 style="width: 90vw">欢迎注册衣设账号</h1>
    <van-form @submit="onSubmit" style="width: 100vw" label-width="64px">
      <van-cell-group inset>
        <van-field
          v-model="signupForm.account"
          name="用户"
          label="用户"
          placeholder="用户名或手机号"
          :rules="[
            { required: true, message: '请填写用户名' },
            { validator: accountValidator, message: '账号长度为5-16位' },
          ]"
        />
        <van-field
          v-model="signupForm.password"
          type="password"
          name="密码"
          label="密码"
          placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
        <van-field
          v-model="signupForm.repassword"
          type="password"
          name="确认密码"
          label="确认密码"
          placeholder="确认密码"
          :rules="[{ required: true, validator: repassword, message: '密码不一致' }]"
        />
      </van-cell-group>
      <div style="margin: 16px">
        <van-button round block type="primary" native-type="submit" :loading="loading">
          注册
        </van-button>
      </div>
    </van-form>
    <div class="flex items-center justify-between" style="width: 80vw">
      <a></a>
      <a @click="login">返回登录</a>
    </div>
  </div>
</template>

<script setup>
import { reactive, toRaw, ref } from "vue";
import { sendEmail, register } from "@/api/index";
import { ResponseStatusCodeEnum } from "@common/statusCode.js";
import { message } from "ant-design-vue";
import {
  View,
  Hide,
  User,
  Lock,
  Message,
  InfoFilled,
  Bell,
  Place,
  Iphone,
} from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { showToast } from "vant";

const router = useRouter();

const signupForm = reactive({
  account: "",
  password: "",
  repassword: "",
  email: "",
  validateCode: "",
  inviteCode: "",
});

function accountValidator() {
  let len = signupForm.account.length;
  return len >= 5 && len <= 16;
}

function repassword() {
  return signupForm.password == signupForm.repassword;
}

const loading = ref(false);
async function onSubmit() {
  try {
    loading.value = true;
    var formData = new FormData();

    formData.append("account", signupForm.account);
    formData.append("email", signupForm.email);
    formData.append("password", signupForm.password);
    formData.append("validateCode", signupForm.validateCode);
    formData.append("inviteCode", signupForm.inviteCode);

    await register(formData);

    showToast("注册成功！");
    router.replace({ name: "Login" });
  } catch (e) {
    loading.value = false;
  }
}

function login() {
  router.push({
    name: "Login",
  });
}
</script>
<style>
.signup-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  flex: auto;
  height: 100%;
}

.signup-form {
  width: 360px;

  .el-input__inner {
    font-size: 12px;
    font-weight: 300;
  }

  .el-input__prefix {
    color: #000;
  }
}

.signup-link {
  color: #999;
  font-size: 12px;
  font-weight: 400;
  text-decoration: underline;

  &:hover {
    cursor: pointer;
    color: var(--el-color-primary);
    text-decoration: underline;
  }
}

.signup-validateCode {
  display: flex;
  width: 100%;
  gap: 10px;
  justify-content: space-between;
}
</style>
