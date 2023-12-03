<template>
  <div class="signup">
    <div class="signup-banner">
      <el-button round>
        <el-icon><Back /></el-icon>
        返回
      </el-button>
    </div>
    <div class="signup-form">
      <div class="signup-form-title">
        <el-form
          ref="formRef"
          label-position="top"
          :model="form"
          :rules="rules"
          hide-required-asterisk
        >
          <el-form-item>
            <div style="font-size: 24px">注册一个账号</div>
          </el-form-item>
          <el-form-item prop="account">
            <el-input v-model="form.account" placeholder="账号">
              <template #prefix>
                <el-icon><User /></el-icon>
              </template>
              <template #suffix>
                <el-icon
                  v-if="accountStatus == ResponseStatusCodeEnum.ACCOUNT_NOT_EXIST"
                  color="green"
                  ><CircleCheck
                /></el-icon>
                <el-icon
                  v-if="accountStatus == ResponseStatusCodeEnum.ACCOUNT_ALREADY_EXIST"
                  color="red"
                  ><CircleClose
                /></el-icon>
                <!-- <el-icon><Warning /></el-icon> -->
              </template>
            </el-input>
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              :type="showPassword ? 'text' : 'password'"
              v-model="form.password"
              placeholder="密码"
            >
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
              <template #suffix>
                <el-icon v-if="showPassword" @click="toggle"><View /></el-icon>
                <el-icon v-else @click="toggle"><Hide /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item prop="repassword">
            <el-input v-model="form.repassword" type="password" placeholder="确认密码">
              <template #prefix> 
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item prop="email">
            <el-input v-model="form.email" placeholder="输入邮箱">
              <template #prefix>
                <el-icon><Message /></el-icon>
              </template>

              <template #suffix>
                <el-button @click="send" link> 发送验证码 </el-button>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item prop="validateCode">
            <el-input v-model="form.validateCode" placeholder="输入邮件验证码">
              <template #prefix>
                <el-icon><Message /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item style="width: 100%">
            <el-button
              :loading="signupLoading"
              @click="submit"
              style="width: 100%"
              type="primary"
            >
              注 册
            </el-button>
          </el-form-item>
          <el-form-item>
            <div
              style="
                display: flex;
                width: 100%;
                justify-content: space-between;
                padding: 0 4px;
              "
            >
              <el-link> 忘记密码? </el-link>
              <el-link> 注册账号 </el-link>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script setup>
import { reactive, ref } from "vue";
import {
  User,
  Lock,
  View,
  Hide,
  Back,
  CircleCheck,
  CircleClose,
  Warning,
  Message,
} from "@element-plus/icons-vue";
import { signup, getAccountStatus } from "@/api";
import { ResponseStatusCodeEnum } from "@common/statusCode.js";
import { useDebounceFn } from "@vueuse/core";

const rules = reactive({
  account: [
    {
      required: true,
      trigger: ["blur"],
        async asyncValidator(rule, val, callback) {
          if (!val) {
            rule.message = "请输入账号";
            return callback(new Error());
          }

          var res = await getAccountStatus({
            account: form.account,
          });
          accountStatus.value = res.status;

          if (res.status == ResponseStatusCodeEnum.ACCOUNT_ALREADY_EXIST) {
            rule.message = " 账号已存在";
            return callback(new Error());
          }
        },
    },
  ],
  email: [
    { message: "请输入正确的邮箱格式", type: "email", required: true, trigger: ["blur"] },
  ],
  password: [
    {
      message: "密码由6～18位字符组成",
      required: true,
      max: 16,
      min: 6,
      trigger: ["blur"],
    },
  ],
  repassword: [
    {
      required: true,
      validator(rule, val, callback) {
        if (!val) {
          rule.message = "请输入确认密码";
          return false;
        }
        if (val !== form.password) {
          rule.message = "两次密码输入不一致";
          return false;
        }
        return true
      },
      trigger: ["blur"],
    },
  ],
  validateCode: {
    len: 6,
    required: true,
    message: "请输入验证码",
  },
});

const formRef = ref();

// 密码输入框是否展示
const showPassword = ref(false);
function toggle() {
  showPassword.value = !showPassword.value;
}

// 是否正在登录
const signupLoading = ref(false);

// 账号是否可以登录
const accountStatus = ref("");

// 验证码是否已经发送
const isSending = ref(false);

var form = reactive({
  account: "",
  email: "",
  password: "",
  repassword: "",
  validateCode: "",
});

async function submit() {
  try {
     await formRef.value.validate();
  } catch (e) {
    return;
  }

  signupLoading.value = true;
  const res = await signup(form);
  if(res.status == ResponseStatusCodeEnum.SIGNUP_SUCCESS){
    alert('Signup successful')
  }else{
    alert('Signup failed')
  }

  signupLoading.value = false;
}

async function send() {
  if (form.email) {
    return;
  }
}
</script>
<style lang="less">
.signup {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.signup-banner {
  padding: 30px;
}

.signup-form {
  width: auto;
  padding: 30px;

  .el-input,
  .el-button {
    height: 48px;
  }

  .el-button,
  .el-input__wrapper {
    border-radius: 8px;
  }
}
</style>
