<template>
<div class="login-container">
  <div class="login-logo">1s.design</div>
  <div class="login-form">
    <div style="font-size: 16px;color: #666;text-align: left;padding: 20px 0px;">登录衣设账号</div>
    <el-form :model="loginForm"  ref="form"  :rules="rules" label-position="top">
      <el-form-item  prop="account">
        <el-input placeholder="请输入账号或邮箱" v-model="loginForm.account" >
          <template #prefix>
            <el-icon><User /></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input placeholder="请输入密码" v-model="loginForm.password" :type="showPassword ? 'text' : 'password'">
          <template #prefix>
            <el-icon><Lock /></el-icon>
          </template>
          <template #suffix>
            <span class="showPassword"  @click="showPassword = !showPassword">
              <el-icon v-if="showPassword"><View /></el-icon>
              <el-icon v-else><Hide /></el-icon>
            </span>
          </template>
        </el-input>
      </el-form-item>

      <div class="login-error">{{ errMsg }}</div>

      <el-form-item>
        <el-button style="width: 100%" type="primary" @click="submit(form)"> 登 录 </el-button>
      </el-form-item>
    </el-form>
    <div  style="display: flex;justify-content:space-between;">
      <div class="login-type">
        仅此次登陆
        <input type="checkbox" v-model="isOnce">
      </div>
      <div class="login-link">忘记密码？</div>
    </div>
    <el-divider>
      <div class="login-link" @click="$router.push({name:'Signup'})">没有账号？去注册</div>
    </el-divider>
  </div>
</div> 
</template>

<script setup>
import { reactive, toRaw,ref, computed, onMounted} from "vue";
import { login } from "@/api/index";
import { ResponseStatusCodeEnum } from "@common/enum/statusCode.js";
import { useLoginStatusStore } from "@/store/stores/user";
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";
import { ElMessage } from 'element-plus'

import { View ,Hide,User,Lock} from "@element-plus/icons-vue";
import { doLogin } from "../../actions/loginAction";

const userStore = useLoginStatusStore();
const router = useRouter();

const showPassword = ref(false)

const form = ref()

const errMsg = ref()

const isOnce = ref(false);

const loginForm = reactive({
  account: "",
  password: "",
});

const rules = reactive({
  account: [
    {  
    message:'请输入 6 ~ 16 位长度的账号',
    trigger: ['blur'],
    validator(rule,val){
      return val.length >= 6 && val.length <= 16
    },
    },
  ],
  password: [
    { 
      message:'请输入 6 ~ 16 位长度的密码',
      trigger:['blur'],
      validator(rule,val){
        return val.length >= 6 && val.length <= 16
      },
   },
  ],
})


async function submit(form) {

  const validateRes =  await form.validate(() => {})
 
  if(!validateRes){
    return
  }
  
  let res = await login(toRaw(loginForm));
  let status = res.status;
  if (status === ResponseStatusCodeEnum.ACCOUNT_NOT_EXIST) {
    message.info("账号不存在");
  } else if (status === ResponseStatusCodeEnum.PASSWORD_ERROR) {
    message.info("密码错误");
  } else if (status === ResponseStatusCodeEnum.LOGIN_SUCCESS) {
    message.success("登陆成功");
    doLogin(res.data, isOnce.value);
  }
}


</script>

<style>
.login-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  flex:auto;
}

.login-form{
  width: 360px;
  .el-input__inner{
    font-size: 12px;
    font-weight: 300;
  }

  .el-input__prefix{
    color: #000;
  }
}

.showPassword{
  cursor: pointer;
  line-height: 30px;
  display: flex;
  font-size: 12px;
  justify-content: center;
  align-items: center;
  color: var(--el-color-primary);
}

.login-logo{
  position: absolute;
  top: 50px;
  left: 50px;
}

.login-link{
  color: #999;
  font-size: 12px;
  font-weight: 400;
  text-decoration: underline;
  &:hover{
    cursor: pointer;
    color: var(--el-color-primary);
    text-decoration: underline;
  }
}

.login-type{
  color: #999;
  font-size: 12px;
  font-weight: 400;
  display: flex;
  justify-content: space-between;
  gap: 5px;
}

.login-error{
  height: 12px;
  line-height: 0px;
  font-size: 12px;
  width: 100%;
  text-align: right;
  color: var(--el-color-error);
}
</style>
