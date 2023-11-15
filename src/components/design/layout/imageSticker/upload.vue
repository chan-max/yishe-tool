<template>
  <div class="designiy-image-sticker-upload">
    <el-upload drag :auto-upload="false" :show-file-list="false">
      <template #trigger>  点击或拖拽上传自定义图片   </template>
    </el-upload>
  </div>
</template>
<script setup>
import { UploadFilled } from '@element-plus/icons-vue';
</script>
<style lang="less"></style>
