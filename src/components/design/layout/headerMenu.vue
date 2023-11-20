<template>
  <div class="designiy-header">
    <div class="designiy-header-logo"></div>

    <header-menu-dropdown/>
    
    <div style="flex-grow: 1"></div>

    <el-button @click="save" size="small" type="primary" round class="cursor-pointer" >
      保 存
    </el-button>

    <user-avatar />

  
  </div>
</template>

<script setup>
import { getBaseModelList, getBaseSkybox } from "@/api/index.ts";
import { ref, defineEmits, defineProps, computed, onMounted } from "vue";
import { canvasBgColor, canvasBgOpacity, isDarkMode, currentController } from "../store";
import {  ElMessageBox } from 'element-plus'
import { uploadModel } from '@/api'
import userAvatar from '@/components/user/userAvatar.vue'
import headerMenuDropdown from './headerMenuDropdown/index.vue'
import { onShortcutTrigger } from '../shortcut/index';

const props = defineProps([]);

onShortcutTrigger(['Ctrl+S'],save)

async function save() {
  await ElMessageBox.confirm(
    '确认将模型保存至工作台吗?',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'info',
      draggable: true,
    })


  const img = currentController.value.getScreenShotFile()
  const data = new FormData()
  data.append('img', img)
  data.append('modelInfo', JSON.stringify(currentController.value.exportTo1stf()))
  await uploadModel(data)
}


</script>

<style lang="less">
.designiy-header {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: start;
  align-items: center;
  box-sizing: border-box;
  column-gap: 10px;
  border-bottom: var(--1s-header-border-bottom);
  padding-right: 10px;
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
  width: var(--1s-left-menu-width);
  height: 46px;
  background:#6900ff;
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
