<!--
 * @Author: chan-max 2651308363@qq.com
 * @Date: 2023-12-16 12:40:25
 * @LastEditors: chan-max 2651308363@qq.com
 * @LastEditTime: 2023-12-23 15:12:31
 * @FilePath: /1s/src/components/user/userAvatar.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by 1s, All Rights Reserved. 
-->
<template>
    <div class="user-avatar">
        <el-popover
        placement="bottom-start"
        trigger="click"
        width="auto"
        >
        <template #reference>
            <el-avatar shape="circle" :src="avatar" />
        </template>
        <user-avatar-form></user-avatar-form>
        </el-popover>
    </div>
</template>
<script setup>

import { useLoginStatusStore } from "@/store/stores/login";
import { doLogout } from "@/store/stores/loginAction";
import { computed, ref, onMounted, watchEffect } from "vue";
import { useRoute } from "vue-router";
import userAvatarForm from './userAvatarForm.vue'

let route = useRoute();

// 顶部头像
const loginStatusStore = useLoginStatusStore();
const avatar = computed(() => {
  const loginStatusStore = useLoginStatusStore();
  // 默认头像
  return loginStatusStore.userInfo?.avatar || "/defaultAvatar/avatar3.png";
});

</script>
<style lang="less">
    .user-avatar{
        display: flex;
        justify-content: center;
        align-items: center;
        .el-avatar{
            height:32px;
            width:32px;
        }
    }
</style>