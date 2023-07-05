<template>
  <div class="signup-container">
    <el-form :model="signupForm">
      <el-form-item label="手机号" required>
        <el-input v-model="signupForm.phonenumber" />
      </el-form-item>
      <el-form-item label="账号" required>
        <el-input v-model="signupForm.account" />
      </el-form-item>
      <el-form-item label="密码" required>
        <el-input v-model="signupForm.password" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit"> 注册 </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { reactive, toRaw } from "vue";
import { signup, getAccountStatus } from "@/api/index";
import { StatusCodeEnum } from "@common/enum/statusCode.js";

const signupForm = reactive({
  phonenumber: "",
  account: "",
  password: "",
});

async function submit() {
  let res = await signup(toRaw(signupForm));
  let status = res.status;
  if (status === StatusCodeEnum.SIGNUP_SUCCESS) {
    alert("注册成功");
  } else if (status === StatusCodeEnum.ACCOUNT_ALREADY_EXIST) {
    alert('账号已存在')
  }
}

</script>
<style>
.signup-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>