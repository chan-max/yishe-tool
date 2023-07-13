<template>
  <el-row justify="center" style="height: 100%">
    <el-col :xl="12" :lg="14" style="height: 100%">
      <div id="header-container">
        <div class="logo" style="cursor: pointer" @click="$router.push({ name: 'Home' })">
          衣设网 1s.design
        </div>
        <div class="header-container-link hidden-sm-and-down">作品展</div>
        <div class="header-container-link hidden-sm-and-down">设计室</div>
        <div class="header-container-link hidden-sm-and-down">工作台</div>
        <div class="header-container-link hidden-sm-and-down">商场</div>
        <div style="flex: auto"></div>

        <div class="header-container-link" @click="toggleLanguage">
          {{ $t("language") }}
        </div>
        <el-button
          v-if="!loginStatusStore.isLogin"
          @click="$router.push({ name: 'Login' })"
          type="primary"
        >
          <span style="font-size: 14px">登 录 </span>
        </el-button>

        <el-popover
          v-else
          placement="bottom"
          :title="` 欢迎, ${loginStatusStore.userInfo.account} !`"
          trigger="hover"
        >
          <div class="user-center-popover">
            <div><el-button size="small">个人中心</el-button></div>
            <div><el-button @click="doLogout" size="small">退出登录</el-button></div>
          </div>
          <template #reference>
            <el-avatar shape="square" size="small" :src="avatar" />
          </template>
        </el-popover>
      </div>
    </el-col>
  </el-row>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { useLoginStatusStore } from "@/store/stores/user";
import { doLogout } from "../../actions/loginAction";
import { computed } from "vue";

const loginStatusStore = useLoginStatusStore();

const avatar = computed(() => {
  const loginStatusStore = useLoginStatusStore();
  return loginStatusStore.userInfo.avatar || "/default-user-avatar.png";
});

const { t, locale, global } = useI18n();

function toggleLanguage() {
  if (locale.value == "en") {
    locale.value = "cn";
  } else {
    locale.value = "en";
  }
}
</script>

<style lang="less">
.logo {
  font-size: 17px;
  display: flex;
  margin-right: 20px;
  justify-content: space-around;
  align-items: center;
  font-weight: bold;
  .line {
    width: 1px;
    height: 50%;
    background: #888;
    margin: 10px;
  }
}

#header-container {
  width: 100%;
  height: 100%;
  padding: 0 15px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-container-link {
  margin: 0 20px;
  color: #333;
  font-size: 14px;
  cursor: pointer;
}

.user-center-popover {
  display: flex;
  justify-content: space-around;
  height: 80px;
  align-items: center;
  flex-direction: column;
}
</style>
