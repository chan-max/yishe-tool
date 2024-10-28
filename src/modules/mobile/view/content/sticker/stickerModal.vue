<template>
  <van-popup
    round
    v-model:show="showStickerModal"
    closeable
    position="bottom"
    :style="{ width: '100%' }"
    :safe-area-inset-top="true"
    :safe-area-inset-bottom="true"
  >
    <div v-if="showStickerModal" class="flex flex-col h-full">
      <div
        style="
          flex: 1;
          padding: 24px;
          background: linear-gradient(to right, #ece9e6, #ffffff);
        "
      >
        <s1-image :src="currentSticker.thumbnail?.url" style="height: 50vh"></s1-image>
      </div>

      <van-card
        num="999"
        price="0.00"
        tag=""
        :desc="currentSticker.description || '暂无相关描述'"
        :title="currentSticker.name || '暂无名称'"
        :thumb="currentSticker.thumbnail?.url"
        style="margin-top: 12px"
      >
        <template #tags>
          <template v-if="currentSticker.keywords">
            <van-tag
              v-for="item in currentSticker.keywords.split(',')"
              plain
              type="primary"
              style="margin-right: 5px"
              color="#444"
              >{{ item }}</van-tag
            >
          </template>
          <template v-else> 无标签 </template>
        </template>
        <template #footer> </template>
      </van-card>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import { functionsIn } from "lodash";
import { showStickerModal, currentSticker } from "./index.js";
import { ref, computed } from "vue";
import { showToast } from "vant";
import { useConfigStore } from "@/store/stores/config";

// 组件增加v-if 是因为需要每次重新渲染

const showShare = ref(false);

const configStore = useConfigStore();

const shareOptions = computed(() => {
  return Object.values(configStore.json?.homepageContratUsLinks || {}).map(
    (item: any) => {
      return {
        ...item,
      };
    }
  );
});

// 选择分享应用 ， 直接跳转到app
function shareSelect(item) {
  if (!item.appHref) {
    return;
  }
  window.location.href = item.appHref;
}

// 分享面板打开
async function shareOpen() {
  let write = await navigator.clipboard.writeText(`
    模型名称 : ${currentSticker.value.name},
    模型描述 : ${currentSticker.value.description},
    模型标签 : ${currentSticker.value.keywords},
    模型ID : ${currentSticker.value.id},
    模型创建时间 : ${currentSticker.value.createTime},
    模型更新时间 : ${currentSticker.value.updateTime},
  `);

  showToast({
    message: "信息已复制，打开应用联系客服即可",
    duration: 1000,
  });
}
</script>

<style></style>
