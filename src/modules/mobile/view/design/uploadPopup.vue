<template>
  <van-popup
    round
    v-model:show="showUploadPopup"
    position="bottom"
    closeable
    style="padding-top: 32px"
    :style="{ height: '90%', width: '100%' }"
    :safe-area-inset-top="true"
    :safe-area-inset-bottom="true"
  >
    <div class="flex flex-col" style="height: 100%"></div>
    <van-action-bar>
      <van-action-bar-button @click="upload" color="#6900ff" :loading="loading">
        上传该模型
      </van-action-bar-button>
    </van-action-bar>
  </van-popup>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { showUploadPopup } from "./index.ts";
import Api from "@/api";
import { currentOperatingBaseModelInfo } from "@/components/design/store";
import { usePaging } from "@/hooks/data/paging.ts";
import { currentModelController } from "@/components/design/store";
import { saveCustomModel } from "@/components/design/layout/saveModel/index.ts";
import { message } from "ant-design-vue";
import { showToast } from "vant";
import { useLoginStatusStore } from "@/store/stores/login";

const loading = ref(false);

const form = ref({});

const loginStore = useLoginStatusStore();

async function upload() {
  if (!loginStore.userInfo?.id) {
    showToast("请先登录后在保存");
    return;
  }

  try {
    loading.value = true;

    await saveCustomModel(form.value);

    showUploadPopup.value = false;

    message.success("保存成功");
  } catch (e) {
  } finally {
    loading.value = false;
  }
}
</script>

<style></style>
