<template>
  <van-popup
    round
    closeable
    style="padding-top: 36px"
    v-model:show="showDecalPopup"
    position="bottom"
    :style="{ height: '90%', width: '100%' }"
    :safe-area-inset-top="true"
    :safe-area-inset-bottom="true"
  >
    <div
      class="flex flex-col"
      style="
        height: 100%;
        overflow: auto;
        row-gap: 12px;
        padding-bottom: 64px;
        box-sizing: border-box;
      "
    >
      <van-empty
        image="error"
        v-if="!currentModelController?.decalControllers?.length"
        description="暂未使用贴纸"
      >
        <van-button round type="primary" class="bottom-button" @click="goAdd"
          >去添加一个</van-button
        >
      </van-empty>

      <template v-else>
        <van-card
          style="border-bottom: 1px solid #eee"
          v-for="item in currentModelController.decalControllers"
          tag="贴纸"
          :desc="item.state.info.description || '暂无相关描述'"
          :title="item.state.info.name || '暂无名称'"
          :thumb="item.state.info.thumbnail"
        >
          <template #tags>
            <template v-if="item.state.info.keywords">
              <van-tag
                v-for="i in item.state.info.keywords.split(',')"
                type="primary"
                style="margin: 3px; font-size: 10px; padding: 2px 6px"
                color="#ddd"
                round
                >{{ i }}</van-tag
              >
            </template>
            <template v-else> 无标签 </template>
          </template>
          <template #footer>
            <van-button
              round
              type="default"
              icon="cross"
              icon-position="right"
              size="small"
              @click="remove(item)"
            >
              移除当前贴纸
            </van-button>
          </template>
        </van-card>
        <van-action-bar>
          <van-action-bar-icon
            :text="`共 ${currentModelController?.decalControllers.length} 个`"
          />
          <van-action-bar-button @click="removeAll" type="danger">
            移除所有
          </van-action-bar-button>
        </van-action-bar>
      </template>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  showMaterialPopup,
  showMaterialDetailPopup,
  currentMaterialDetail,
  showStickerPopup,
  showDecalPopup,
} from "./index.ts";
import Api from "@/api";
import { currentOperatingBaseModelInfo } from "@/components/design/store";
import { usePaging } from "@/hooks/data/paging.ts";
import {
  currentModelController,
  currentOperatingDecalController,
} from "@/components/design/store";
import { showConfirmDialog } from "vant";

async function remove(item) {
  await showConfirmDialog({
    title: "提示",
    message: "确认删除该贴纸吗",
  });
  item.remove();
}

function goAdd() {
  showDecalPopup.value = false;
  showStickerPopup.value = true;
}

async function removeAll() {
  await showConfirmDialog({
    title: "提示",
    message: "确认删除所有贴纸吗",
  });
}
</script>

<style></style>
