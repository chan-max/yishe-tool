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
      <div
        style="
          flex: 1;
          background: #eee;
          box-shadow: rgba(0, 0, 0, 0.1) 0 30px 60px inset;
        "
      >
        <s1GltfViewer :model="currentCustomModel.meta.modelInfo"></s1GltfViewer>
      </div>

      <div
        v-if="currentCustomModel.thumbnails?.length"
        class="flex items-center overflow-auto"
        style="width: 100%; padding: 12px; box-sizing: border-box; column-gap: 12px"
      >
        <div
          style="
            width: 48px;
            height: 48px;
            flex-shrink: 0;
            background: #f7f7f7;
            border-radius: 4px;
          "
          v-for="(item, index) in currentCustomModel.thumbnails"
          @click="imagePreview(item, index)"
        >
          <s1-image :src="item.url" />
        </div>
      </div>

      <van-card
        :desc="currentCustomModel.description || '暂无相关描述'"
        :title="currentCustomModel.name || '暂无名称'"
        :thumb="currentCustomModel.thumbnail.url"
      >
        <!-- <template #title> </template> -->
        <!-- <template #thumb></template> -->
        <!-- <template #desc> </template> -->
        <template #num> </template>
        <template #price> {{ currentCustomModel.price || "暂未定价" }} </template>
        <template #origin-price> </template>
        <!-- <template #price-top> </template>
        <template #bottom> </template> -->
        <!-- <template #tag>  </template> -->

        <template #tags>
          <div style="padding: 10px 0">
            <template v-if="currentCustomModel.keywords">
              <van-tag
                v-for="item in currentCustomModel.keywords.split(',')"
                type="primary"
                style="margin: 3px; font-size: 10px; padding: 2px 6px"
                color="#ddd"
                round
                >{{ item }}</van-tag
              >
            </template>
            <template v-else> 无标签 </template>
          </div>
        </template>
        <template #footer>
          <div style="margin-top: 12px" class="flex items-center">
            <van-action-bar-icon icon="chat-o" text="联系客服" />
            <van-action-bar-icon icon="shop-o" text="店铺" />
            <van-action-bar-icon
              icon="share-o"
              text="分享"
              @click="showShareCard(currentCustomModel)"
            />

            <van-action-bar-icon icon="records-o" text="自定义" @click="goCustom" />

            <!-- <div style="flex: 1"></div> -->
            <van-button
              round
              type="primary"
              @click="showShare = true"
              class="gradient-button"
              color="linear-gradient(to right, #eb3941, #e14e53)"
              style="flex: 1"
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

  <van-image-preview
    v-model:show="showPreview"
    :images="previewImages"
    :start-position="imagePreviewStartPosition"
  >
    <template #index="{ index }">第{{ index + 1 }}页</template>
  </van-image-preview>
</template>

<script setup lang="ts">
import { functionsIn } from "lodash";
import { showCustomModelModal, currentCustomModel } from "./index.ts";
import { ref, computed } from "vue";
import { showConfirmDialog, showToast } from "vant";
import { useConfigStore } from "@/store/stores/config";
import { showImagePreview } from "vant";
import { showShareCard } from "../shareCard/index.ts";
import { useRouter } from "vue-router";
import { currentModelController } from "@/components/design/store";
import { toRaw } from "vue";

const router = useRouter();

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

const imagePreviewStartPosition = ref(0);

function imagePreview(item, index) {
  showPreview.value = true;
  imagePreviewStartPosition.value = index;
}

async function goCustom() {
  await showConfirmDialog({
    title: "是否进入工作台，可享受如下功能",
    message: `
      自选服装款式
      自定义服装材质和颜色
      丰富可自定义的服装印花
      发布个人的创作模型
    `,
    theme: "round-button",
    messageAlign: "left",
  });

  let modelInfo = currentCustomModel.value.meta.modelInfo;

  showCustomModelModal.value = false;
  router.push({
    name: "design",
    state: {
      modelInfo: toRaw(modelInfo),
    },
  });
}
</script>

<style scoped lang="less">
.gradient-button {
  box-shadow: 0 5px 15px rgba(242, 97, 103, 0.4);
  font-size: 12px;
  font-weight: bold;
}
</style>
