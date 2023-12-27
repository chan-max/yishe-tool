<template>
  <div class="designiy-header">
    <div class="designiy-header-logo">
      <icon-logo></icon-logo>
    </div>
    
    <div style="flex-grow: 1"></div>

    <icon-help style="width: 24px; height: 24px;color:#333;"></icon-help>

    <el-button @click="showSaveModel = true" type="primary" color="#333" round> 上 传 </el-button>

    <user-avatar  v-if="loginStatusStore.isLogin"/>
    <el-button @click="$router.push({name:'Login'})" v-else type="primary" round>  登 录 </el-button>
  </div>
</template>

<script setup>
import { getBaseModel, getBaseSkybox } from "@/api/index.ts";
import { ref, defineEmits, defineProps, computed, onMounted } from "vue";
import { canvasBgColor, canvasBgOpacity, isDarkMode, currentController, showSaveModel } from "../store";


import {Share} from '@element-plus/icons-vue'
import userAvatar from '@/components/user/userAvatar.vue'
import headerMenuDropdown from './headerMenuDropdown/index.vue'
import { onShortcutTrigger } from '../shortcut/index';
import iconHelp from '@/icon/help.svg?vueComponent'
import { useLoginStatusStore } from "@/store/stores/login";


const loginStatusStore = useLoginStatusStore();

const props = defineProps([]);





</script>

<style lang="less">
.designiy-header {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: start;
  align-items: center;
  column-gap: 8px;
  padding-right: 10px;
  .el-button + .el-button{
    margin:0;
  }
}

.designiy-header-select-model {
  margin: 0 10px;
}

.designiy-header-select-model-btn {
  min-width: 60px;
}

.designiy-header-change-bgcolor {
  color: #555;
  display: flex;
  align-items: center;
  font-size: 12px;
  margin: 0 10px;
}

.designiy-header-logo {
  width: 80px;
  height: 46px;
}

.designiy-header-item {
  color: #eee;
  font-size: 12px;
  margin: 0 7px;
  cursor: pointer;
}

.designiy-header-quit {
  color: var(--1s-icon-color);
  padding: 0 5px;
  font-size: 18px;
}
</style>