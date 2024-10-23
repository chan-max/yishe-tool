<template>
  <van-popup
    round
    v-model:show="showDecalOperationPopup"
    position="bottom"
    closeable
    style="padding-top: 36px"
    :style="{ height: 'auto', width: '100%' }"
    :safe-area-inset-top="true"
    :safe-area-inset-bottom="true"
  >
    <div class="flex flex-col" style="height: 100%">贴纸操作</div>
  </van-popup>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import { showDecalOperationPopup } from "./index.ts";
import Api from "@/api";
import { currentOperatingBaseModelInfo } from "@/components/design/store";
import { usePaging } from "@/hooks/data/paging.ts";
import { currentModelController } from "@/components/design/store";
import { saveCustomModel } from "@/components/design/layout/saveModel/index.ts";
import { message } from "ant-design-vue";
</script>

<style></style>
