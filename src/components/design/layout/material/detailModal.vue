<template>
  <a-modal
    v-bind="$attrs"
    v-model:open="showMaterialDetailModal"
    width="880px"
    title="材质详细信息"
    style="min-width: 980px"
    :footer="null"
    centered
    :destroyOnClose="true"
  >
    <div class="flex">
      <div :draggable="false">
        <s1-mangnifier
          :src="currentMaterialInfo.thumbnail?.url"
          width="480px"
          height="480px"
          style="border-radius: 12px"
          zoomFactor="4"
        ></s1-mangnifier>
      </div>
      <div style="padding: 0 12px; flex: 1" class="flex flex-col">
        <div style="flex: 1"></div>
        <el-button @click="use" class="w-full" type="primary" round>
          使用该材质
        </el-button>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, unref } from "vue";
import { ClickOutside as vClickOutside } from "element-plus";
import { viewDisplayController, currentModelController } from "@/components/design/store";
import { usePaging } from "@/hooks/data/paging.ts";
import Api from "@/api";
import { currentMaterialInfo, showMaterialDetailModal } from "./index.ts";

// 使用该材质
function use() {
  currentModelController.value.state.materialTextureInfo = currentMaterialInfo.value;
  viewDisplayController.value.showMaterialModal = false;
  showMaterialDetailModal.value = false;
}
</script>

<style scoped lang="less"></style>
