<template>
  <div class="designiy-header">
    <div class="designiy-header-logo"></div>
    <div class="designiy-header-item">
      撤销
      <font-awesome-icon style="transform: scaleX(-1)" :icon="['fas', 'share']" />
    </div>
    <div class="designiy-header-item">
      <font-awesome-icon :icon="['fas', 'share']" />
      重做
    </div>
    <div style="flex-grow: 1"></div>

    <div class="designiy-header-mode-switch">
      <el-switch title="切换白天/黑色模式" v-model="isDarkMode" :active-action-icon="Moon" :inactive-action-icon="Sunny" />
    </div>
    <el-button @click="save" type="primary" size="small"  style="height:26px;font-size: 10px;margin-right: 10px;">
      <span style="font-weight: bold;font-size: 12px;">保 存</span>
    </el-button>
  </div>
</template>

<script setup>
import { getBaseModelList, getBaseSkybox } from "@/api/index.ts";
import { ref, defineEmits, defineProps, computed, onMounted } from "vue";
import { canvasBgColor, canvasBgOpacity, isDarkMode ,currentController} from "../store";
import Color from "color";
import { Edit, Share, Delete ,Sunny,Moon} from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from 'element-plus'
import {uploadModel} from '@/api'

const props = defineProps([]);

async function save(){
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
    data.append('img',img)
    await uploadModel(data)
}


</script>

<style lang="less">
.designiy-header {
  width: 100%;
  height: 100%;
  background-color: #fcfcfc;
  display: flex;
  justify-content: start;
  align-items: center;
  box-sizing: border-box;
  padding-right: 0px;
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
  width: 50px;
  height: 40px;
}

.designiy-header-item {
  color: #eee;
  font-size: 12px;
  margin: 0 7px;
  cursor: pointer;
}

.designiy-header-mode-switch{
  margin-right: 10px;
  span{
    height: 28px;
  }

  .el-switch__action{
   width: 20px!important;
   height: 20px!important;
   color: #06f;
   svg{
      color:var(--el-color-primary);
    }
  }

  .is-checked{
    .el-switch__action{
      background-color: #2c2c2c;
      left: calc(100% - 22px)!important;
    }
    .el-switch__core{
    background: #555!important;
  }
    svg{
      color:#fff;
    }
  }

  .el-switch__core{
    border: none;
  }

}
</style>
