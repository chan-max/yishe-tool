<template>
  <van-popup
    round
    v-model:show="showUploadPopup"
    position="bottom"
    @open="open"
    closeable
    style="padding-top: 36px"
    :style="{ height: 'auto', width: '100%' }"
    :safe-area-inset-top="true"
    :safe-area-inset-bottom="true"
  >
    <div class="flex flex-col" style="height: 100%">
      <van-form @submit="onSubmit">
        <van-cell-group inset>
          <van-field label="缩略图">
            <template #input>
              <van-image width="160px" height="160px" fit="contain" :src="previewUrl" />
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
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import { showUploadPopup } from "./index.ts";
import Api from "@/api";
import { currentOperatingBaseModelInfo } from "@/components/design/store";
import { usePaging } from "@/hooks/data/paging.ts";
import { currentModelController } from "@/components/design/store";
import { saveCustomModel } from "@/components/design/layout/saveModel/index.ts";
import { message } from "ant-design-vue";

const loading = ref(false);

const form = ref({
  name: "",
  description: "",
  isPublic: false,
});

const previewUrl = ref();

function open() {
  previewUrl.value = currentModelController.value.getScreenshotBase64();
}

async function onSubmit() {
  try {
    loading.value = true;
    await saveCustomModel(form.value);
    showUploadPopup.value = false;
    message.success("上传成功");
  } catch (e) {
  } finally {
    loading.value = false;
  }
}
</script>

<style></style>
