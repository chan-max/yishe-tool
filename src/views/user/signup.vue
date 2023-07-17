<template>
  <div class="signup-container">
    <input ref="avatarInput" type="file" id="avatar" accept="image/*" />
    <el-input v-model="signupForm.phonenumber" placeholder="电话号" />
    <el-input v-model="signupForm.account" placeholder="账号" />
    <el-input v-model="signupForm.password" placeholder="密码" />
    <el-button type="primary" @click="submit"> 注册 </el-button>
  </div>
</template>

<script setup>
import { reactive, toRaw,ref } from "vue";
import { signup } from "@/api/index";
import { ResponseStatusCodeEnum } from "@common/enum/statusCode.js";
import {fileToBase64} from '@/common/transform/fileToBase64'

const avatarInput  = ref()

const signupForm = reactive({
  phonenumber: "",
  account: "",
  password: "",
  avatar:""
});

async function submit() {
  var formData = new FormData()
  let avatarBase64 = await fileToBase64(avatarInput.value.files[0])
  
  formData.append('avatar',avatarBase64)
  formData.append('phonenumber',signupForm.phonenumber)
  formData.append('account',signupForm.account)
  formData.append('password',signupForm.password)

  let res = await signup(formData);
  let status = res.status;
  if (status === ResponseStatusCodeEnum.SIGNUP_SUCCESS) {
    alert("注册成功");
  } else if (status === ResponseStatusCodeEnum.ACCOUNT_ALREADY_EXIST) {
    alert("账号已存在");
  }
}


</script>
<style>
.signup-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 300px;
  height: 100%;
}
</style>
