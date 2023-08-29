<template>
  <div class="admin-image-upload">
    <el-form
      :rules="rules"
      label-position="right"
      label-width="100px"
      :model="form"
    >
      <el-form-item prop="name" required>
        <el-input v-model="form.name" size="large" placeholder="图片名称" />
      </el-form-item>
      <el-form-item prop="description" required>
        <el-input v-model="form.description" size="large" placeholder="图片描述" />
      </el-form-item>
    </el-form>
    <el-upload
      drag
      :multiple="false"
      :action="__DEV__ ? '/api/imageUpload' : '/imageUpload'"
      :data="form"
      :disabled="!!img.length"
      :auto-upload="false"
      accept=".jpg,.png"
      ref="upload"
      v-model:file-list="img"
    >
      <el-icon style="color: var(--el-color-primary); font-size: 50px"
        ><upload-filled
      /></el-icon>
      <div>点击或拖拽图片来上传</div>
      <template #tip>
        <div class="el-upload__tip">仅限 jpg,png 类型</div>
      </template>
    </el-upload>
    <el-button @click="submit" size="large" type="primary" style="width: 100%">
      上传
    </el-button>
    <el-button @click="remove" size="large" style="width: 100%; margin: 20px 0">
      移除当前文件
    </el-button>
  </div>
</template>
<script setup>
import { message } from "ant-design-vue";
import { ElMessage } from "element-plus";
import { reactive, ref, computed } from "vue";
import { UploadFilled } from "@element-plus/icons-vue";
import gltfViewer from "@/components/model/gltfViewer/index.vue";
import { base64ToFile } from "../../../common/transform/base64ToFile";

const upload = ref();

const img = ref([]);

const gltfViewerRef = ref();

const previewUrl = computed(
  () => img.value[0] && URL.createObjectURL(img.value[0].raw)
);

const rules = reactive({
  name: [{ required: true, message: "请输入模型名称", trigger: "blur" }],
  description: [{ required: true, message: "请输入模型描述", trigger: "blur" }],
});

const form = reactive({
  name: "",
  description: "",
});

function remove() {
  upload.value.handleRemove(img.value[0]);
}

function submit() {
  if (!img.value[0]) {
    message.error("选择模型文件");
    return;
  }
  if (img.value[0].size / 1024 / 1024 > 20) {
    message.error("模型最大限制为20mb");
    return;
  }

  upload.value.submit();
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
