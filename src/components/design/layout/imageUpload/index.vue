<template>
  <div class="designiy-image-upload">
    <el-upload
      class="designiy-image-upload-dragger"
      drag
      :auto-upload="false"
      :show-file-list="false"
    >
    </el-upload>

    <div class="designiy-image-upload-form">
      <el-button type="primary"> 上传该图片 </el-button>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="less">
.designiy-image-upload {
  padding: 30px;
  display: flex;
  column-gap: 20px;
}

.designiy-image-upload-dragger {
  width: 300px;
  height: 300px;
  .el-upload{
    width:100%;
    height:100%;
  }
  .el-upload-dragger{
    width:100%;
    height:100%;
  }
}

.designiy-image-upload-form {
  width: 300px;
  height: 300px;
}
</style>
