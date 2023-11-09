<template lang="">
    <div class="user-avatar">
        <el-popover
        placement="bottom"
        :title="` 欢迎, ${loginStatusStore.userInfo?.account} !`"
        trigger="hover"
        >
        <div class="user-center-popover">
            <div><el-button size="small">个人中心</el-button></div>
            <div>
            <el-button
                v-if="loginStatusStore.isAdmin"
                size="small"
                @click="$router.push({ name: 'Admin' })"
                >管理员</el-button
            >
            </div>
            <div><el-button @click="doLogout" size="small">退出登录</el-button></div>
        </div>

        <template #reference>
            <el-avatar size="normal" shape="circle" :src="avatar" />
        </template>
        </el-popover>
    </div>
</template>
<script setup>

import { useLoginStatusStore } from "@/store/stores/user";
import { doLogout } from "@/actions/loginAction";
import { computed, ref, onMounted, watchEffect } from "vue";
import { useRoute } from "vue-router";
import { Pointer,CaretBottom } from "@element-plus/icons-vue";

let route = useRoute();

// 顶部头像
const loginStatusStore = useLoginStatusStore();
const avatar = computed(() => {
  const loginStatusStore = useLoginStatusStore();
  return loginStatusStore.userInfo?.avatar || "/defaultAvatar/avatar3.png";
});

</script>
<style lang="less">
    .user-avatar{
        display: flex;
        justify-content: center;
        align-items: center;
        .el-avatar{
            height:30px;
            width:30px;
        }
    }
    
    .user-avatar-unlogin{
        font-weight: bold;
        font-size: 12px;
        cursor: default;
    }

    .user-avatar-unlogin-item{
        cursor: pointer;
    }

    .user-avatar-unlogin-item:hover{
        cursor: pointer;
        opacity: .9;
    }
    
</style>