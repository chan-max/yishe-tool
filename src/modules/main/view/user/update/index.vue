<template>
    <div class="update-container">
        <div class="update-form">
            <div style="font-size: 16px; color: #666; text-align: left; padding: 20px 0px">
                更新个人信息
            </div>
            <el-form :model="updateForm" ref="form" :rules="rules">
                <el-form-item prop="password">
                    <el-input placeholder="请输入密码" v-model="updateForm.password" type="password">
                        <template #prefix>
                            <el-icon>
                                <Lock />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="repassword">
                    <el-input placeholder="请再次确认密码" v-model="updateForm.repassword" type="password">
                        <template #prefix>
                            <el-icon>
                                <Lock />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="email">
                    <el-input placeholder="请输入邮箱" v-model="updateForm.email">
                        <template #prefix>
                            <el-icon>
                                <Message />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="validateCode">
                    <div class="signup-validateCode">
                        <el-input placeholder="请输入邮箱验证码" v-model="updateForm.validateCode">
                            <template #prefix>
                                <el-icon>
                                    <Bell />
                                </el-icon>
                            </template>
                        </el-input>
                        <el-button @click="sendCode">
                            <span style="font-size: 12px; font-weight: 400"> 发送验证码 </span>
                        </el-button>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button style="width: 100%" type="primary" @click="submit(form)">
                        修 改
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
} from "@element-plus/icons-vue";
import { useRouter } from "vue-router";

const router = useRouter();

const updateForm = reactive({
    account: "",
    password: "",
    email: "",
    repassword: "",
    validateCode: "",
});

const form = ref();

const rules = reactive({
    account: [
        {
            message: "账号由6～18位字符组成",
            required: true,
            max: 16,
            min: 6,
            trigger: ["blur"],
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
            message: "两次密码输入不一致",
            required: true,
            validator(form, val) {
                if (!val) {
                    form.message = "请输入确认密码";
                    return false;
                } else {
                    form.message = "两次密码输入不一致";
                    return val === updateForm.password;
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
        sendEmail({ email: updateForm.email });
    });
}

async function submit() {
    const validateRes = await form.value.validate(() => { });
    if (!validateRes) {
        return;
    }

    var formData = new FormData();

    formData.append("account", updateForm.account);
    formData.append("email", updateForm.email);
    formData.append("password", updateForm.password);
    formData.append("validateCode", updateForm.validateCode);

    await register(formData);
    message.success("注册成功！");
    router.replace({ name: "Login" });
}
</script>
<style>
.update-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    flex: auto;
    height: 100%;
}

.update-form {
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
  