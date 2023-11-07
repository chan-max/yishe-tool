<template>
  <div class="admin-image-upload">
    <el-form
      :rules="rules"
      label-position="right"
      label-width="100px"
      :model="form"
      style=""
    >
      <el-form-item prop="name" required>
        <el-input v-model="form.name" size="large" placeholder="图片名称" />
      </el-form-item>
      <el-form-item prop="description" required>
        <el-input v-model="form.description" size="large" placeholder="图片描述" />
      </el-form-item>
    </el-form>
    <el-upload
    ref="upload"
    :limit="1"
    :on-exceed="handleExceed"
    :auto-upload="false"
    v-model:file-list="files"
  >
    <template #trigger>
      <el-button type="primary">选择文件</el-button>
    </template>
  </el-upload>
    <el-button @click="submit" size="large" type="primary" style="width: 100%">
      上传
    </el-button>
    <el-button @click="remove" size="large" style="width: 100%; margin: 20px 0">
      移除当前文件
    </el-button>
    <img :src="previewUrl" style="width: 900px; height: 600px; margin: auto">
  </div>
</template>
<script setup>
import { message } from "ant-design-vue";
import { ElMessage } from "element-plus";
import { reactive, ref, computed } from "vue";
import { UploadFilled } from "@element-plus/icons-vue";
import { genFileId } from 'element-plus'
import { uploadImage } from '../../../../api/index';

const upload = ref();

const files = ref([]);

const previewUrl = computed(
  () => files.value[0] && URL.createObjectURL(files.value[0].raw)
);

const rules = reactive({
  name: [{ required: true, message: "请输入图片名称", trigger: "blur" }],
  description: [{ required: true, message: "请输入图片描述", trigger: "blur" }],
});

const form = reactive({
  name: "",
  description: "",
  file:""
});

function remove() {
  upload.value.clearFiles()
}

function handleExceed(files){
  upload.value.clearFiles()
  const file = files[0]
  file.uid = genFileId()
  upload.value.handleStart(file)
}

async function  submit() {
  const file = files.value[0]
  if (!file) {
    message.error("选择图片");
    return;
  }
  if (file.size / 1024 / 1024 > 20) {
    message.error("图片最大限制为20mb");
    return;
  }

  form.file = file.raw
  await uploadImage(form)
}
</script>

<style>
.admin-image-upload {
  width: 100%;
  height: 100%;
}

.el-form-item__content {
  margin-left: 0 !important;
}
</style>
