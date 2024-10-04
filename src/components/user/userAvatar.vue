<!--
 * @Author: chan-max 2651308363@qq.com
 * @Date: 2023-12-16 12:40:25
 * @LastEditors: chan-max 2651308363@qq.com
 * @LastEditTime: 2024-02-13 18:31:14
 * @FilePath: /yishe/src/components/user/userAvatar.vue
 * @Description:  用户相关操作
 * 
 * Copyright (c) 2023 by 1s, All Rights Reserved. 
-->
<template>
  <div class="user-avatar">
    <el-popover placement="bottom-start" trigger="hover" width="auto" :hide-after="0">
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
import userAvatarForm from "./userAvatarForm.vue";

let route = useRoute();

// 顶部头像
const loginStore = useLoginStatusStore();

const avatar = computed(() => {
  const loginStore = useLoginStatusStore();
  return loginStore.userInfo?.avatar || "/defaultAvatar/avatar3.png";
});
</script>
<style lang="less" scoped>
.user-avatar {
  border: 2px solid #ddd;
  border-radius: 50%;
  height: 32px;
  width: 32px;

  .el-avatar {
    height: 100%;
    width: 100%;
  }
}
</style>
