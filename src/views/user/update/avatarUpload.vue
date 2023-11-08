<template>
  <el-upload
    class="avatar-uploader"
    :auto-upload="false"
    :show-file-list="false"
    v-model:file-list="files"
    :limit="1"
    :on-exceed="handleExceed"
    ref="upload"
  >
    <img v-if="files[0]" :src="previewUrl" class="avatar" />
    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
  </el-upload>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, computed } from 'vue';
import { ElMessage } from "element-plus";
import { Plus } from "@element-plus/icons-vue";

import  { UploadProps,genFileId } from "element-plus";

const files = ref([])
const upload = ref()

const previewUrl = computed(() => {
  return  URL.createObjectURL(files.value[0].raw)
})

function handleExceed(files){
  upload.value.clearFiles()
  const file = files[0]
  file.uid = genFileId()
  upload.value.handleStart(file)
}

</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
  object-fit: cover;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
