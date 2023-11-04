<template lang="">
    <div class="heade-user">
        <div v-if="!loginStatusStore.isLogin" class="heade-user-unlogin">
            <span class="heade-user-unlogin-item" @click="$router.push({name:'Login'})">登录</span>
            /
            <span class="heade-user-unlogin-item" @click="$router.push({name:'Signup'})">注册</span>
        </div>
        <el-popover
        v-else
        placement="bottom"
        :title="` 欢迎, ${loginStatusStore.userInfo.account} !`"
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
            <el-avatar size="normal" shape="square" :src="avatar" />
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
  return loginStatusStore.userInfo.avatar || "/defaultAvatar/avatar8.png";
});

</script>
<style lang="less">
    .heade-user{
        display: flex;
        justify-content: center;
        align-items: center;
        .el-avatar{
        width:32px;
        height:32px;
        }
    }
    
    .heade-user-unlogin{
        font-weight: bold;
        font-size: 16px;
        color: #fff;
        cursor: default;
    }

    .heade-user-unlogin-item{
        cursor: pointer;
    }

    .heade-user-unlogin-item:hover{
        cursor: pointer;
        opacity: .9;
    }
    
</style>