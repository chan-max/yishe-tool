<template>
    <div class="update-container">
        <div class="update-form">
            <div style="font-size: 16px; color: #666; text-align: left; padding: 20px 0px">
                更新个人信息
            </div>
            <el-form :model="form" ref="formRef" :rules="rules">
                <el-form-item prop="avatar">
                    <div class="w-full flex justify-center">
                        <el-upload ref="upload" :show-file-list="false" :auto-upload="false" :on-change="handleChange">
                            <div class="flex justify-center items-center"
                                style="width:120px;height:120px; border-radius: 6px;overflow:hidden;  border: 1px dashed #ddd;">
                                <img v-if="imageUrl" :src="imageUrl" class="w-full h-full"
                                    style="border-radius: 6px;width:100px;height:100px;" />
                                <el-icon v-else class="avatar-uploader-icon">
                                    <Plus />
                                </el-icon>
                            </div>
                        </el-upload>
                    </div>
                </el-form-item>

                <el-form-item>
                    <el-button style="width: 100%" type="primary" @click="submit(form)" :loading="loading">
                        修 改
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
  
<script setup>
import { reactive, toRaw, ref, onBeforeMount, shallowRef } from "vue";
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
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useLoginStatusStore } from "@/store/stores/login";
import { ApiFilled } from "@ant-design/icons-vue";
import Api from '@/api'

const router = useRouter()

const loginStore = useLoginStatusStore()

onBeforeMount(() => {
    if (!loginStore.isLogin) {
        router.replace({
            name: 'Home'
        })
    }
})

const imageUrl = ref('')

const upload = ref()



// 当前选择的头像文件
const avatarFile = shallowRef()
const handleChange = (file) => {
    avatarFile.value = file.raw
    imageUrl.value = URL.createObjectURL(file.raw)
}


const form = ref({})

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
                    return val === form.password;
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



const formRef = ref()

const loading = ref(false)
async function submit() {
    const validateRes = await formRef.value.validate(() => { });
    if (!validateRes) {
        return;
    }

    loading.value = true
    // 选择了新头像
    if (avatarFile.value) {
        let { url } = await Api.uploadToCOS({ file: avatarFile.value })
        form.value.avatar = url
    }

    try {
        await Api.updateUserInfo({
            ...form.value
        })
        message.success('信息更新成功')

    } finally {
        loading.value = false
    }
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
  