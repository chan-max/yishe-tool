<template>
  <div class="login-form">
    <el-form :model="loginForm">
      <el-form-item label="账号" required>
        <el-input v-model="loginForm.account" />
      </el-form-item>
      <el-form-item label="密码" required>
        <el-input v-model="loginForm.password" />
      </el-form-item>
      <el-form-item label="登陆方式"> </el-form-item>
      <el-switch
        :active-value="true"
        :inactive-value="false"
        v-model="isOnce"
      ></el-switch>
      仅此次登录
      <el-form-item>
        <el-button style="width: 100%" type="primary" @click="submit"> 登录 </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { reactive, toRaw,ref} from "vue";
import { login } from "@/api/index";
import { ResponseStatusCodeEnum } from "@common/enum/statusCode.js";
import { useLoginStatusStore } from "@/store/stores/user";
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";
import { ElMessage } from 'element-plus'

import { doLogin } from "../../actions/loginAction";

const userStore = useLoginStatusStore();
const router = useRouter();

const isOnce = ref(false);
const loginForm = reactive({
  account: "",
  password: "",
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
    doLogin(res.data, isOnce.value);
  }
}


</script>

<style>
.login-form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 300px;
  height: 100%;
}
</style>
