<template>
    <div class="designiy-image-sticker debug">
        <img v-for="i in images" :src="i.path" style="width:100%;margin:5px;">
    </div>
  </template>
  <script setup>
import { onMounted, ref,computed } from "vue";
import {showBaseModelSelectDialog,currentModelInfo,canvasBgColor,canvasBgOpacity} from '../../store.ts'

import {getImageList} from '@/api/index'

const images = ref([])



onMounted(async () => {
  images.value = await getImageList();
});

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
  