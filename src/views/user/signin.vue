<template>
  <div class="signin-container">
    <el-form :model="signInForm">
      <el-form-item label="账号" required>
        <el-input v-model="signInForm.account" />
      </el-form-item>
      <el-form-item label="密码" required>
        <el-input v-model="signInForm.password" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit"> 登录 </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { reactive, toRaw } from "vue";
import { signIn } from '@api/index'
import { StatusCodeEnum } from "@common/enum/statusCode.js";
import { useUserStore } from '@/store/stores/user'
import {useRouter} from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

const signInForm = reactive({
  account: '',
  password: ''
})

async function submit() {
  let res = await signIn(toRaw(signInForm))
  let status = res.data.status
  if (status === StatusCodeEnum.ACCOUNT_NOT_EXIST) {
    alert('账号并不存在')
  } else if (status === StatusCodeEnum.PASSWORD_ERROR) {
    alert('密码错误')
  } else if (status === StatusCodeEnum.SIGNIN_SUCCESS) {
    alert('登陆成功')
    userStore.isSignedIn = true
    userStore.account = res.data.data.account
    router.push({
        name:'Home'
    })
  }
}

</script>

<style>
</style>