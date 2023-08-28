<template>
    <div class="designiy-image-sticker">
      66666
    </div>
  </template>
  <script setup>
  import { onMounted, ref,computed } from "vue";
  import {showBaseModelSelectDialog,currentModelInfo,canvasBgColor,canvasBgOpacity} from '../../store.ts'

  </script>
  <style lang="less">
    .designiy-image-sticker{
        padding:10px;

        .el-collapse{
            border:none;
        }
        .el-collapse-item{
            padding-bottom:2px;
        }
        .el-collapse-item__header{
            height:25px;
            padding-left:10px;
            background-color: #3d3d3d;
            border:none;
            color:#e5e5e5;
            font-size: 12px;
            font-weight: 100;
        }

        .el-collapse-item__wrap{
          background-color: #3d3d3d;
          border:none;
        }
    }
  </style>
  