<template>
  <div class="admin-model-upload">
    <el-form
      :rules="rules"
      label-position="top"
      label-width="100px"
      :model="form"
      style=""
    >
      <el-form-item label="名称" prop="name" required>
        <el-input v-model="form.name" size="large" />
      </el-form-item>
      <el-form-item label="描述" prop="description" required>
        <el-input v-model="form.description" size="large" />
      </el-form-item>
    </el-form>
    <el-upload 
    drag
     action="#" 
     :auto-upload="false"     
     accept=".glb,.gltf"
     >
      <el-icon style="color:var(--el-color-primary);font-size:50px;"><upload-filled /></el-icon>
      <div>点击或拖拽模型文件来上传</div>
      <template #tip>
        <div class="el-upload__tip">仅限 glb,gltf 类型</div>
      </template>
    </el-upload>

  </div>
</template>
<script setup>

import {message}from 'ant-design-vue'
import { reactive } from "vue";
import { UploadFilled } from "@element-plus/icons-vue";

const rules = reactive({
  name: [{ required: true, message: "请输入模型名称", trigger: "blur" }],
  description: [{ required: true, message: "请输入模型描述", trigger: "blur" }],
});

const form = reactive({
  name: "",
  description: "",
});



</script>

<style>
.admin-model-upload {
  width: 100%;
  height: 100%;
}
</style>
