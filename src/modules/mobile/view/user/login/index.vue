<template>
  <div class="login">
    <div class="login-form">
      <div class="login-form-title">
        <el-form
          ref="formRef"
          label-position="top"
          :model="form"
          :rules="rules"
          hide-required-asterisk
        >
          <el-form-item>
            <div style="font-size: 24px">登录衣设网</div>
          </el-form-item>
          <el-form-item prop="account">
            <el-input
              v-model="form.account"
              placeholder="账号或者邮箱"
              @input="checkAccountStatus"
            >
              <template #prefix>
                <el-icon><User /></el-icon>
              </template>
              <template #suffix>
                  <el-icon
                  v-if="accountStatus == ResponseStatusCodeEnum.ACCOUNT_ALREADY_EXIST"
                  color="green"
                  ><CircleCheck
                /></el-icon>
                <el-icon
                  v-if="accountStatus == ResponseStatusCodeEnum.ACCOUNT_NOT_EXIST"
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
                <el-icon v-if="showPassword" @click="showPassword = true"
                  ><View
                /></el-icon>
                <el-icon v-else @click="showPassword = false"><Hide /></el-icon>
              </template>
            </el-input>
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
          <el-form-item style="width: 100%">
            <el-button
              :loading="loginLoading"
              @click="submit"
              style="width: 100%"
              type="primary"
            >
              登 录
            </el-button>
          </el-form-item>
          <el-form-item>
            <div style="display: flex; justify-content: end; width: 100%">
              <el-checkbox> 记住我 </el-checkbox>
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
} from "@element-plus/icons-vue";
import { login, getAccountStatus } from "@/api";
import { ResponseStatusCodeEnum } from "@common/statusCode.js";
import { useDebounceFn } from "@vueuse/core";
import { useLoginStatusStore } from "@/store/stores/login";
import { doLoginAction } from "@/store/stores/loginAction";
import { useRouter } from "vue-router";
import { showToast } from 'vant';

const router  = useRouter()

const rules = reactive({
  account: [{ required: true, message: "请输入账号", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
});

const formRef = ref();

// 密码输入框是否展示
const showPassword = ref(false);

// 是否正在登录
const loginLoading = ref(false);

// 账号是否可以登录
const accountStatus = ref("");

var form = reactive({
  account: "",
  password: "",
});

const checkAccountStatus = useDebounceFn(async () => {
  var res = await getAccountStatus({
    account: form.account,
  });
  
  accountStatus.value = res.status;
}, 2000);

async function submit() {
  try {
    await formRef.value.validate();
  } catch {
    return;
  }

  loginLoading.value = true;
  const res = await login(form);
  if (res.status === ResponseStatusCodeEnum.LOGIN_SUCCESS) {
    doLoginAction(res.data);
    showToast({
      message:'登陆成功',
      onClose(){
        router.replace({name:'Home'})
      }
    })
  } else if (res.status === ResponseStatusCodeEnum.PASSWORD_ERROR) {
    alert("账号密码错误");
  }
  loginLoading.value = false;
}

</script>
<style lang="less">
.login {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.login-banner {
  padding: 30px;
}

.login-form {
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
