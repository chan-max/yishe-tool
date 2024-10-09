<template>
  <div class="single-file-uploader">
    <el-upload
      ref="uploadRef"
      :auto-upload="false"
      :limit="1"
      :on-exceed="handleExceed"
      :accept="accept"
    >
      <template #trigger>
        <el-button type="primary">选择文件</el-button>
      </template>
      <template #tip> {{ tip }} </template>
    </el-upload>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { Plus } from "@element-plus/icons-vue";
import Api from "@/api";
import { message } from "ant-design-vue";
import { genFileId } from "element-plus";

/**
 * 这里采用的策略为选择及上传，删除即删除
 */

const props = defineProps({
  tip: {
    default: "",
  },
  accept: {
    default: "*",
  },
});

const model = defineModel({
  default: [],
});

const uploadRef = ref();

const handleExceed = (files) => {
  uploadRef.value!.clearFiles();
  const file = files[0];
  file.uid = genFileId();
  uploadRef.value!.handleStart(file);
};

/**
 * @method 同步上传操作 ,包括新增的和删除的
 */
async function upload() {}

defineExpose({
  upload,
});
</script>

<style lang="less"></style>
