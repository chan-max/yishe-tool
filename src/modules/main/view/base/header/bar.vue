<template>
  <div ref="headerBar" class="header-bar flex justify-center z-10">
    <div class="header-bar-content flex justify-between items-center">
      <div class="header-bar-logo">1s.design</div>

      <div style="width:30px;"></div>

      <div class="header-bar-menu-item">
        寻找模型
      </div>
      <div class="header-bar-menu-item">在线商场 </div>
      <div class="header-bar-menu-item">设计工具 </div>
      <div class="header-bar-menu-item">更多 </div>
      <div style="flex: 1"></div>
      <user-avatar v-if="loginStatusStore.isLogin" />
      <div v-else>
        <el-button @click="$router.push({name:'Signup'})" link round> 注 册 </el-button>
        <el-button @click="$router.push({name:'Login'})" round type="primary"> 登 录 </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Search } from "@element-plus/icons-vue";
import userAvatar from "@/components/user/userAvatar.vue";
import { ref, onMounted, onUnmounted } from "vue";
import iconArrowDown from "@/icon/arrow-down.svg?vueComponent";
import { useLoginStatusStore } from "@/store/stores/login";

const loginStatusStore = useLoginStatusStore();
</script>

<style lang="less">
.header-bar {
  width: 100%;
  height: 64px;
  background: #fff;
  border-bottom: 1px solid #eee;
}

.header-bar-content {
  width: 1600px;
  padding: 0 20px;
}

.header-bar-logo {
  font-size: 15px;
  font-weight: bold;
}

.header-bar-menu-item {
  font-size: 12px;
  height:100%;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  column-gap: 5px;
  text-wrap: nowrap;
  cursor: pointer;
  svg {
    width: 10px;
    height: 10px;
  }
}

.fixed {
  position: fixed;
}
</style>
@/store/stores/login