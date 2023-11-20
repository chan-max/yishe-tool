<template>
  <div class="admin-model-upload">
    <el-form
      :rules="rules"
      label-position="right"
      label-width="100px"
      :model="form"
      style=""
    >
      <el-form-item prop="name" required>
        <el-input v-model="form.name" size="large" placeholder="模型名称" />
      </el-form-item>
      <el-form-item prop="description" required>
        <el-input v-model="form.description" size="large" placeholder="模型描述" />
      </el-form-item>
      <el-form-item prop="sizes">
        <el-select v-model="form.sizes" placeholder="尺寸" multiple style="width: 240px">
          <el-option
            v-for="size in sizes"
            :key="size"
            :label="size"
            :value="size"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <el-upload
      drag
      :multiple="false"
      :data="form"
      :disabled="!!file.length"
      :auto-upload="false"
      accept=".glb,.gltf"
      ref="upload"
      v-model:file-list="file"
    >
      <el-icon style="color: var(--el-color-primary); font-size: 50px"
        ><upload-filled
      /></el-icon>
      <div>点击或拖拽模型文件来上传</div>
      <template #tip>
        <div class="el-upload__tip">仅限 glb,gltf 类型,大小限制为20mb</div>
      </template>
    </el-upload>
    <el-button @click="submit" size="large" type="primary" style="width: 100%">
      上传
    </el-button>
    <el-button @click="remove" size="large" style="width: 100%; margin: 20px 0">
      移除当前文件
    </el-button>
    <gltf-viewer
      ref="gltfViewerRef"
      style="width: 900px; height: 600px; margin: auto"
      :model="prerviewModel"
    ></gltf-viewer>
  </div>
</template>
<script setup>
import { message } from "ant-design-vue";
import { ElMessage } from "element-plus";
import { reactive, ref, computed ,shallowReactive} from "vue";
import { UploadFilled } from "@element-plus/icons-vue";
import gltfViewer from "@/components/model/gltfViewer/index.vue";
import { base64ToFile } from "@/common/transform/base64ToFile";
import {uploadBaseModel} from '@/api'

const upload = ref();

const file = ref([]);

const sizes = ref(['S','M','L','XL','XXL','XXXL','XXXXL'])


const gltfViewerRef = ref();

const prerviewModel = computed(() => {
  return {
    baseModelUrl: file.value[0] && URL.createObjectURL(file.value[0].raw),
  };
});

const rules = reactive({
  name: [{ required: true, message: "请输入模型名称", trigger: "blur" }],
  description: [{ required: true, message: "请输入模型描述", trigger: "blur" }],
});

const form = shallowReactive({
  name: "",
  description: "",
  img: "",
  file:'',
  sizes:[]
});

function remove() {
  upload.value.handleRemove(file.value[0]);
}

async function submit() {
  if (!file.value[0]) {
    message.error("选择模型文件");
    return;
  }
  if (file.value[0].size / 1024 / 1024 > 20) {
    message.error("模型最大限制为20mb");
    return;
  }

  form.file = file.value[0].raw
  form.img = base64ToFile(gltfViewerRef.value.getScreenshot());

  await uploadBaseModel(form)
  
}
</script>

<style>
.admin-model-upload {
  width: 100%;
  height: 100%;
}

.el-form-item__content {
  margin-left: 0 !important;
}
</style>
