<template>
  <div class="signup-container">
    <div class="signup-form">
      <div class="flex items-center">
        <img src="/favicon.png" style="width: 20px; height: 20px; margin-right: 8px" />
        <div
          style="
            font-size: 14px;
            font-weight: bold;
            color: #666;
            text-align: left;
            padding: 20px 0px;
          "
        >
          注册衣设账号
        </div>
      </div>

      <el-form :model="signupForm" ref="form" :rules="rules">
        <el-form-item prop="account" required>
          <el-input placeholder="请输入账号" v-model="signupForm.account">
            <template #prefix>
              <el-icon>
                <User />
              </el-icon>
            </template>
            <template #suffix>
              <el-tooltip content="账号由5 ～ 16位数字，字母组成" placement="right">
                <el-icon>
                  <InfoFilled />
                </el-icon>
              </el-tooltip>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password" required>
          <el-input
            placeholder="请输入密码"
            v-model="signupForm.password"
            type="password"
          >
            <template #prefix>
              <el-icon>
                <Lock />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input
            placeholder="请再次确认密码"
            v-model="signupForm.repassword"
            type="password"
          >
            <template #prefix>
              <el-icon>
                <Lock />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="phone" required>
          <el-input placeholder="手机号" v-model="signupForm.phone">
            <template #prefix>
              <el-icon><Iphone /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="inviteCode">
          <el-input
            placeholder="邀请码 由公司或组织提供"
            v-model="signupForm.inviteCode"
            type="password"
          >
            <template #prefix>
              <el-icon><Place /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            style="width: 100%"
            type="primary"
            @click="submit(form)"
            :loading="loading"
          >
            注 册
          </el-button>
        </el-form-item>
      </el-form>
      <el-divider>
        <div class="signup-link" @click="$router.push({ name: 'Login' })">
          已有账号？去登录
        </div>
      </el-divider>
    </div>
  </div>
</template>

<script setup>
import { reactive, toRaw, ref } from "vue";
import { sendEmail, register } from "@/api/index";
import { ResponseStatusCodeEnum } from "@common/statusCode.js";
import { message } from "ant-design-vue";
import {
  View,
  Hide,
  User,
  Lock,
  Message,
  InfoFilled,
  Bell,
  Place,
  Iphone,
} from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import {
  openLoginDialog,
  showLoginFormModal,
} from "@/modules/main/view/user/login/index.tsx";

const router = useRouter();

const signupForm = reactive({
  account: "",
  password: "",
  email: "",
  repassword: "",
  validateCode: "",
  inviteCode: "",
});

const form = ref();

const rules = reactive({
  account: [
    {
      message: "账号由5～18位字符组成",
      required: true,
      max: 16,
      min: 5,
      trigger: ["blur"],
    },
  ],
  email: [
    { message: "请输入正确的邮箱格式", type: "email", required: true, trigger: ["blur"] },
  ],
  phone: [
    { required: true, message: "请输入手机号", trigger: ["blur", "change"] },
    {
      message: "请输入正确的手机号",
      validator: (rule, value, callback) => {
        if (!value) {
          return callback(new Error("手机号不能为空"));
        } else {
          const reg = /^1[3-9][0-9]\d{8}$/;
          // 这里定义的reg变量没有加引号，所以是一种特殊的数据类型，即正则，可以直接用test()方法
          if (reg.test(value)) {
            callback();
          } else {
            // 具体错误信息没有提示
            return callback(new Error("请输入正确的手机号"));
          }
        }
      },
      trigger: ["blur"],
    },
  ],
  password: [
    {
      message: "密码由5～16位字符组成",
      required: true,
      max: 16,
      min: 5,
      trigger: ["blur"],
    },
  ],
  repassword: [
    {
      message: "两次密码输入不一致",
      required: true,
      validator(form, val) {
        if (!val) {
          form.message = "请输入确认密码";
          return false;
        } else {
          form.message = "两次密码输入不一致";
          return val === signupForm.password;
        }
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

async function sendCode() {
  form.value.validateField("email", (v) => {
    if (!v) {
      return;
    }
    // 发送验证码
    sendEmail({ email: signupForm.email });
  });
}

const loading = ref(false);
async function submit() {
  const validateRes = await form.value.validate(() => {});
  if (!validateRes) {
    return;
  }

  try {
    loading.value = true;
    var formData = new FormData();

    formData.append("account", signupForm.account);
    formData.append("email", signupForm.email);
    formData.append("password", signupForm.password);
    formData.append("validateCode", signupForm.validateCode);
    formData.append("inviteCode", signupForm.inviteCode);

    await register(formData);

    message.success("注册成功！");

    router.replace({ name: "Home" });
    openLoginDialog();
  } catch (e) {
    loading.value = false;
  }
}
</script>
<style>
.signup-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  flex: auto;
  height: 100%;
}

.signup-form {
  width: 360px;

  .el-input__inner {
    font-size: 12px;
    font-weight: 300;
  }

  .el-input__prefix {
    color: #000;
  }
}

.signup-link {
  color: #999;
  font-size: 12px;
  font-weight: 400;
  text-decoration: underline;

  &:hover {
    cursor: pointer;
    color: var(--el-color-primary);
    text-decoration: underline;
  }
}

.signup-validateCode {
  display: flex;
  width: 100%;
  gap: 10px;
  justify-content: space-between;
}
</style>
