<template>
    <div class="designiy-image-sticker">
        <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item title="最近更新" name="1">
        <div>
          Consistent with real life: in line with the process and logic of real
          life, and comply with languages and habits that the users are used to;
        </div>
        <div>
          Consistent within interface: all elements should be consistent, such
          as: design style, icons and texts, position of elements, etc.
        </div>
      </el-collapse-item>
      <el-collapse-item title="当前最热" name="2">
        <div>
          Operation feedback: enable the users to clearly perceive their
          operations by style updates and interactive effects;
        </div>
        <div>
          Visual feedback: reflect current state by updating or rearranging
          elements of the page.
        </div>
      </el-collapse-item>
      <el-collapse-item title="我的收藏" name="3">
        <div>
          Simplify the process: keep operating process simple and intuitive;
        </div>
        <div>
          Definite and clear: enunciate your intentions clearly so that the
          users can quickly understand and make decisions;
        </div>
        <div>
          Easy to identify: the interface should be straightforward, which helps
          the users to identify and frees them from memorizing and recalling.
        </div>
      </el-collapse-item>
      <el-collapse-item title="分类" name="4">
        <div>
          Decision making: giving advices about operations is acceptable, but do
          not make decisions for the users;
        </div>
        <div>
          Controlled consequences: users should be granted the freedom to
          operate, including canceling, aborting or terminating current
          operation.
        </div>
      </el-collapse-item>
    </el-collapse>
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
  