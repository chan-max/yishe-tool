<template>
  <van-popup
    round
    v-model:show="showCustomModelModal"
    closeable
    position="bottom"
    :style="{ height: '96%', width: '100%' }"
    :safe-area-inset-top="true"
    :safe-area-inset-bottom="true"
  >
    <div v-if="showCustomModelModal" class="flex flex-col h-full">
      <div style="flex: 1; background: linear-gradient(to right, #eee, #fff)">
        <s1GltfViewer :model="currentCustomModel.meta.modelInfo"></s1GltfViewer>
      </div>

      <div
        v-if="currentCustomModel.thumbnails?.length"
        class="flex items-center overflow-auto"
        style="width: 100%; padding: 12px; box-sizing: border-box; column-gap: 12px"
      >
        <van-image
          v-for="(item, index) in currentCustomModel.thumbnails"
          round
          style="width: 48px; height: 48px; flex-shrink: 0; background: #eee"
          :src="item.url"
          @click="imagePreview(item, index)"
        />
      </div>

      <van-card
        num="999"
        price="0.00"
        tag=""
        :desc="currentCustomModel.description || '暂无相关描述'"
        :title="currentCustomModel.name || '暂无名称'"
        :thumb="currentCustomModel.thumbnail.url"
      >
        <template #tags>
          <template v-if="currentCustomModel.keywords">
            <van-tag
              v-for="item in currentCustomModel.keywords.split(',')"
              plain
              style="margin-right: 5px"
              color="#444"
              >{{ item }}</van-tag
            >
          </template>
          <template v-else> 无标签 </template>
        </template>
        <template #footer>
          <div style="margin-top: 12px" class="flex items-center">
            <van-action-bar-icon icon="chat-o" text="客服" @click="onClickIcon" />
            <van-action-bar-icon icon="shop-o" text="店铺" @click="onClickIcon" />
            <van-action-bar-icon
              icon="idcard"
              text="分享卡片"
              @click="showShareCard(currentCustomModel)"
            />

            <div style="flex: 1"></div>
            <van-button
              round
              type="primary"
              @click="showShare = true"
              class="gradient-button"
              color="linear-gradient(to right, #eb3941, #e14e53)"
            >
              立即购买
            </van-button>
          </div>
        </template>
      </van-card>
    </div>
  </van-popup>

  <van-share-sheet
    v-model:show="showShare"
    :options="shareOptions"
    @select="shareSelect"
    @open="shareOpen"
    title="分享该设计"
    description="内容信息以复制，进入 app 后直接粘贴发送即可"
  />

  <van-image-preview v-model:show="showPreview" :images="previewImages">
    <template #index="{ index }">第{{ index + 1 }}页</template>
  </van-image-preview>
</template>

<script setup lang="ts">
import { functionsIn } from "lodash";
import { showCustomModelModal, currentCustomModel } from "./index.ts";
import { ref, computed } from "vue";
import { showToast } from "vant";
import { useConfigStore } from "@/store/stores/config";
import { showImagePreview } from "vant";
import { showShareCard } from "../shareCard";

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
    模型名称 : ${currentCustomModel.value.name},
    模型描述 : ${currentCustomModel.value.description},
    模型标签 : ${currentCustomModel.value.keywords},
    模型ID : ${currentCustomModel.value.id},
    模型创建时间 : ${currentCustomModel.value.createTime},
    模型更新时间 : ${currentCustomModel.value.updateTime},
  `);

  showToast({
    message: "信息已复制，打开应用联系客服即可",
    duration: 1000,
  });
}

const showPreview = ref(false);

const previewImages = computed(() => {
  return currentCustomModel.value.thumbnails?.map((item) => {
    return item.url;
  });
});

function imagePreview(item, index) {
  showPreview.value = true;
}
</script>

<style scoped lang="less">
.gradient-button {
  box-shadow: 0 5px 15px rgba(242, 97, 103, 0.4);
  font-size: 12px;
  font-weight: bold;
}
</style>
