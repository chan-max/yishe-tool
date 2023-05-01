<template>
  <div class="accountApply-form">
    <el-form :model="signUpForm">
      <el-form-item label="手机号" required>
        <el-input v-model="signUpForm.phonenumber" />
      </el-form-item>
      <el-form-item label="账号" required>
        <el-input v-model="signUpForm.account" />
      </el-form-item>
      <el-form-item label="密码" required>
        <el-input v-model="signUpForm.password" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit"> 注册 </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRaw } from "vue";
import { signUp, getAccountStatus } from "@/api/index";

const signUpForm = reactive({
  phonenumber: "",
  account: "",
  password: "",
});

async function submit() {
  let res = await signUp(toRaw(signUpForm));
  console.log(res);
}
</script>
<style>
.accountApply-form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>