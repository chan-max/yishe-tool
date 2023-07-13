<template>
  <div class="login-form">
    <el-form :model="loginForm">
      <el-form-item label="账号" required>
        <el-input v-model="loginForm.account" />
      </el-form-item>
      <el-form-item label="密码" required>
        <el-input v-model="loginForm.password" />
      </el-form-item>
      <el-form-item label="登陆方式">
        <el-radio-group v-model="loginForm.loginType">
          <el-radio :label="LoginTypeEnum.ONCE">仅此一次</el-radio>
          <el-radio :label="LoginTypeEnum.ALWAYS">始终保留我的登录信息</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button style="width: 100%" type="primary" @click="submit"> 登录 </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { reactive, toRaw } from "vue";
import { login } from "@/api/index";
import { ResponseStatusCodeEnum } from "@common/enum/statusCode.js";
import { useLoginStatusStore } from "@/store/stores/user";
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";
import { doLogin } from "../../actions/loginAction";
import { LoginTypeEnum } from "@common/enum/loginType.js";

const userStore = useLoginStatusStore();
const router = useRouter();


const loginForm = reactive({
  account: "",
  password: "",
  loginType: LoginTypeEnum.ONCE,
});

async function submit() {
  let res = await login(toRaw(loginForm));
  let status = res.status;
  if (status === ResponseStatusCodeEnum.ACCOUNT_NOT_EXIST) {
    message.info("账号不存在");
  } else if (status === ResponseStatusCodeEnum.PASSWORD_ERROR) {
    message.info("密码错误");
  } else if (status === ResponseStatusCodeEnum.LOGIN_SUCCESS) {
    message.success("登陆成功");
    doLogin(res.data, loginForm.loginType);
  }
}



</script>

<style>
.login-form {
  width: 400px;
  height: 300px;
}
</style>
