<template>
  <div class="accountApply-form" v-if="!accountIsAvailabel">
    <h1> 申请账号(账号作为身份的唯一验证),需要增加注册限制 </h1>
    <el-input v-model="account" @input="checkoutAccountIsAvailable" />
    <el-button @click="accountIsAvailabel = true"> 申请该账号 </el-button>
  </div>
  <div class="completeApplyInfo-form" v-else>
    <el-form :model="signUpForm">
      <el-form-item label="账号">
        <el-input v-model="signUpForm.account" />
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="signUpForm.password" />
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="signUpForm.name" />
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="signUpForm.phonenumber" />
      </el-form-item>
    </el-form>
    <button @click="signUp"> 完善信息 </button>
  </div>
</template>
  
<script lang="ts" setup>
import { accountIsExist } from "@/api/index";
import { reactive, ref } from "vue";

// 当前账号是否可用
const accountIsAvailabel = ref(false);

// 账号
const account = ref("");

const signUpForm = reactive({
  account: "",
  password: "",
  phonenumber: "",
  name: "",
});

//   检测账号是否可用，包括是否符合规则，是否重名
async function checkoutAccountIsAvailable() {
  // 检测账号是否符合规则
  let isExist = await accountIsExist({ account: account.value });
}

function signUp() {
  // 注册
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