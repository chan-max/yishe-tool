<template>
  <div id="header-container">
    <div class="logo" style="cursor: pointer" @click="$router.push({ name: 'Home' })">
      衣设
    </div>

    <a class="header-container-link " @click="$router.push({name:'Workspace'})">工作台</a>
    <a class="header-container-link" @click="$router.push({name:'Market'})">商场</a>

    <div style="flex: auto"></div>

    <!-- <div class="header-container-link" @click="toggleLanguage">
      {{ $t("language") }}
    </div> -->

    <el-popover
    v-if="loginStatusStore.isLogin"
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
        <el-avatar size="small" :src="avatar" />
      </template>
    </el-popover>

    <el-button
      v-if="!loginStatusStore.isLogin"
      @click="$router.push({ name: 'Login' })"
      type="primary"
      round
    >
      <span style="font-size: 14px">登 录 </span>
    </el-button>


  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { useLoginStatusStore } from "@/store/stores/user";
import { doLogout } from "../../actions/loginAction";
import { computed, ref, onMounted, watchEffect } from "vue";
import { useRoute } from "vue-router";
import { Pointer,CaretBottom } from "@element-plus/icons-vue";


let route = useRoute();


const menuHomeTop = {
  background:'transparent',
  color:'#fff'
}

const menuHome = {
  background:'#fff',
  color:'#000'
}

const menu = {
  background:'#fff',
  color:'#000'
}

const menuStyle = computed(() => {
  return isHome.value ? isScrolled.value ? menuHome : menuHomeTop : menu
});



/*
  导航菜案三种样式
*/

const isHome = ref(true)
const  isScrolled = ref(false)

onMounted(() => {
  const appEl = document.querySelector("#app");
  appEl.onscroll = isHome && function (e) {
         if (appEl.scrollTop > 0) {
          isScrolled.value = true
        } else {
          isScrolled.value = false
        }
      }
})


watchEffect(() => {
  let _isHome = route.name === "Home";
  isHome.value = _isHome
});


// 顶部头像

const loginStatusStore = useLoginStatusStore();

const avatar = computed(() => {
  const loginStatusStore = useLoginStatusStore();
  return loginStatusStore.userInfo.avatar || "/default-user-avatar.png";
});

// 切花语言模式

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
#header-container {
  width: 100%;
  height: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: v-bind("menuStyle.background");

  @media screen and (min-width: 1920px) {
    padding: 0 10%;
  }
  transition: all 0.2s ease-in-out;
}

.logo {
  font-size: 17px;
  display: flex;
  margin-right: 20px;
  justify-content: space-around;
  align-items: center;
  font-weight: bold;
  color: #fff;
}

.header-container-link {
  margin: 0 14px;
  color: v-bind("menuStyle.color");
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  opacity: 0.8;
  transition: all .5s;
  &:hover{
    opacity: 1;
    box-shadow: 0px 3px 0px 0px white;
  }
}


.user-center-popover {
  display: flex;
  justify-content: space-around;
  height: 80px;
  align-items: center;
  flex-direction: column;
}

.header-container-link-active{
  color: var(--el-color-primary);
}
</style>
