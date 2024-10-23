<template>
  <div class="avatar flex items-center justify-center">
    <s1-image
      style="width: 36px; height: 36px; border-radius: 18px"
      :src="loginStore.userInfo?.avatar || Utils.const.defaultUserAvatar"
    />
  </div>
</template>

<script setup lang="ts">
import { useLoginStatusStore } from "@/store/stores/login";
import Utils from "@/common/utils";
const loginStore = useLoginStatusStore();
</script>

<style scoped lang="less">
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  // background-image: linear-gradient(
  //   45deg,
  //   #6900ff 5%,
  //   #f99c4a 15%,
  //   #f47838 30%,
  //   #e75157 45%,
  //   #d92d7a 70%,
  //   #cc2a92 80%,
  //   #c32e92 95%
  // );
  background-color: #eee;
}
</style>
