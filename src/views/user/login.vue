<template>
  <div class="login-form">
    <el-form :model="loginForm">
      <el-form-item label="账号" required>
        <el-input v-model="loginForm.account" />
      </el-form-item>
      <el-form-item label="密码" required>
        <el-input v-model="loginForm.password" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit"> 登录 </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { reactive, toRaw } from "vue";
import { login } from "@/api/index";
import { StatusCodeEnum } from "@common/enum/statusCode.js";
import { useLoginStatusStore } from "@/store/stores/user";
import { useRouter } from "vue-router";
import {message} from 'ant-design-vue';
import { doLogin } from '../../actions/login';

const userStore = useLoginStatusStore();
const router = useRouter();

const loginForm = reactive({
  account: "",
  password: "",
});


async function submit() {
  let res = await login(toRaw(loginForm));
  let status = res.status;
  if (status === StatusCodeEnum.ACCOUNT_NOT_EXIST) {
    message.info('账号不存在')
  } else if (status === StatusCodeEnum.PASSWORD_ERROR) {
    message.info('密码错误')
  } else if (status === StatusCodeEnum.LOGIN_SUCCESS) {
    message.success('登陆成功')
    doLogin(res.data)
  }
}


</script>

<style>
.login-form {
  width: 400px;
  height: 300px;
}
</style>
