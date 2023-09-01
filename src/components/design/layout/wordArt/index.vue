<template>
    <div class="designiy-word"> 
      <el-button style="width:280px;margin:5px 10px; " type="primary"  size="default"><span style="font-weight: bold">添加文字贴纸</span></el-button>
    </div>
  </template>
  <script setup>
  import { onMounted, ref,computed } from "vue";
  import {showBaseModelSelectDialog,currentModelInfo,canvasBgColor,canvasBgOpacity} from '../../store.ts'

  </script>
  <style lang="less">
    .designiy-word{
      display:flex;
      flex-direction:column;
    }
  </style>
  