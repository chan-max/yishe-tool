<template>
  <div>
    <a-modal
      v-model:open="showAutocreateModal"
      title="自动生成功能"
      width="100%"
      wrap-class-name="full-modal"
      @ok="handleOk"
    >
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { showAutocreateModal } from "./index.ts";

const handleOk = (e: MouseEvent) => {
  showAutocreateModal.value = false;
};
</script>
<style lang="less">
.full-modal {
  .ant-modal {
    max-width: 100%;
    top: 0;
    padding-bottom: 0;
    margin: 0;
  }
  .ant-modal-content {
    display: flex;
    flex-direction: column;
    height: calc(100vh);
  }
  .ant-modal-body {
    flex: 1;
  }
}
</style>
