<template>
  <van-popup
    round
    v-model:show="showUploadImagePopup"
    position="bottom"
    @open="open"
    @close="close"
    closeable
    style="padding-top: 36px"
    :style="{ height: 'auto', width: '100%' }"
    :safe-area-inset-top="true"
    :safe-area-inset-bottom="true"
  >
    <div class="flex flex-col" style="height: 100%">
      <van-form @submit="onSubmit" v-if="selectedFile">
        <van-cell-group inset>
          <van-field label="图片">
            <template #input>
              <s1-image
                v-if="selectedFile"
                style="width: 160px; height: 160px"
                fit="contain"
                :src="previewUrl"
              ></s1-image>
            </template>
          </van-field>
          <van-field
            v-model="form.name"
            label="名字"
            placeholder="名字"
            :rules="[{ required: true, message: '请填写名字' }]"
          />
          <van-field
            v-model="form.description"
            label="描述"
            placeholder="描述"
            :rules="[{ required: true, message: '请填写描述' }]"
          />
          <van-field label="是否公开">
            <template #input>
              <van-switch size="18px" v-model="form.isPublic" />
            </template>
          </van-field>
        </van-cell-group>
        <div style="margin: 16px">
          <van-button round block type="primary" native-type="submit" :loading="loading">
            上传
          </van-button>
        </div>
      </van-form>
      <div v-else class="flex justify-center items-center flex-col" style="padding: 24px">
        <van-uploader :after-read="afterRead" reupload />
      </div>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import { showUploadImagePopup } from "./index.ts";
import Api from "@/api";
import { currentOperatingBaseModelInfo } from "@/components/design/store";
import { usePaging } from "@/hooks/data/paging.ts";
import { currentModelController } from "@/components/design/store";
import { saveCustomModel } from "@/components/design/layout/saveModel/index.ts";
import { message } from "ant-design-vue";

const loading = ref(false);

const selectedFile = ref(false);
const previewUrl = ref();

const form = ref({
  name: "",
  description: "",
  isPublic: false,
});

function open() {}

async function onSubmit() {
  try {
    loading.value = true;
    message.success("保存成功");
  } catch (e) {
  } finally {
    loading.value = false;
  }
}

function close() {
  selectedFile.value = null;
  previewUrl.value = null;
}

const afterRead = (p) => {
  // 此时可以自行将文件上传至服务器
  selectedFile.value = p.file;
  previewUrl.value = p.objectUrl;
};
</script>

<style></style>
