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
        style="width: 100%; padding: 12px 12px; box-sizing: border-box; column-gap: 12px"
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

      <van-card :thumb="currentCustomModel.thumbnail">
        <!-- <template #thumb></template> -->
        <template #title>
          <div style="font-size: 16px; font-weight: bold">
            {{ currentCustomModel.name || "暂无名称" }}
          </div>
        </template>

        <template #desc>
          <div style="color: #555">
            {{ currentCustomModel.description || "暂无相关介绍" }}
          </div>
        </template>
        <template #num>库存 : 999 </template>

        <template #origin-price> </template>
        <template #price-top>
          <div style="color: #999; font-size: 10px">
            创建时间 : {{ currentCustomModel.createTime }}
          </div>
        </template>
        <template #price>
          <div class="font-bold" style="color: red; font-size: 16px; margin: 12px 0">
            ¥
            {{
              currentCustomModel.price
                ? Utils.format.formatCurrency(currentCustomModel.price)
                : "暂未定价"
            }}
          </div>
        </template>
        <template #bottom> </template>
        <template #tag v-if="currentCustomModel.customizable">
          <van-tag @click="showToast('该作品内容可以定制，具体可以联系客服')" color="red">
            可定制<van-icon name="hot-o" size="24" />
          </van-tag>
        </template>

        <template #tags>
          <div style="padding: 10px 0; gap: 4px" class="flex flex-wrap">
            <van-tag
              v-if="currentCustomModel.uploader?.isAdmin"
              style="font-size: 10px; padding: 2px 6px; color: gold"
              round
              color="#000"
              @click="showToast('该作品由官方团队设计')"
            >
              官方
            </van-tag>
            <van-tag
              round
              color="red"
              v-if="Utils.time.isRecentDays(currentCustomModel.createTime, 3)"
              style="font-size: 10px; padding: 2px 6px"
              @click="showToast('该作品在三天内创建')"
            >
              新
            </van-tag>

            <template v-if="currentCustomModel.keywords">
              <van-tag
                v-for="item in currentCustomModel.keywords.split(',')"
                type="primary"
                @click="tagClick(item)"
                style="font-size: 10px; padding: 2px 6px"
                color="#ddd"
                round
                >{{ item }}</van-tag
              >
            </template>
          </div>
        </template>
        <template #footer>
          <div class="flex items-center">
            <van-action-bar-icon
              icon="smile-comment-o"
              text="联系我们"
              @click="showContactUs = true"
            />

            <van-action-bar-icon icon="records-o" text="自定义" @click="goCustom" />
            <van-action-bar-icon
              icon="share-o"
              text="分享"
              @click="showShareCard(currentCustomModel)"
            />
            <van-action-bar-icon icon="ellipsis" text="了解更多" />
            <!-- <div style="flex: 1"></div> -->
            <van-button
              round
              type="primary"
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
    v-model:show="showContactUs"
    :options="contactUsOptions"
    @select="contactUsSelect"
    @open="contactUsOpen"
    title="联系我们"
    description="可以通过以下方式联系到我们，服装信息已复制，进入 app 后直接粘贴发送即可"
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
import Utils from "@/common/utils";
import {
  mobileMarketSearchQueryParams,
  searchBus,
} from "@/modules/mobile/view/market/index.tsx";
import { useEventBus } from "@vueuse/core";

const router = useRouter();
const route = useRoute();

// 组件增加v-if 是因为需要每次重新渲染

const showContactUs = ref(false);

const configStore = useConfigStore();

const contactUsOptions = computed(() => {
  return Object.values(configStore.json?.homepageContratUsLinks || {}).map(
    (item: any) => {
      return {
        ...item,
      };
    }
  );
});

// 选择分享应用 ， 直接跳转到app
function contactUsSelect(item) {
  if (!item.appHref) {
    return;
  }
  window.location.href = item.appHref;
}

// 分享面板打开
async function contactUsOpen() {
  let write = await navigator.clipboard.writeText(`
    模型名称 : ${currentCustomModel.value.name},
    模型描述 : ${currentCustomModel.value.description},
    模型标签 : ${currentCustomModel.value.keywords},
    模型ID : ${currentCustomModel.value.id},
    模型创建时间 : ${currentCustomModel.value.createTime},
    模型更新时间 : ${currentCustomModel.value.updateTime},
  `);

  showToast({
    message: "服装信息已复制，打开应用联系客服即可",
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
    closeOnClickOverlay: true,
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

/**
 * @methid 点击服装标签，用于搜索
 */

async function tagClick(tag) {
  await showConfirmDialog({
    title: "搜索",
    message: `是否去商城查看更多关于 <span style="color:var(--van-primary-color);font-weight:bold"> ${tag} </span>   的服装设计`,
    closeOnClickOverlay: true,
    theme: "round-button",
    allowHtml: true,
    confirmButtonText: "确定",
    showCancelButton: false,
  });

  // 从非商城的地址跳转到商城
  if (route.name !== "market") {
    await router.push({ name: "market" });
  }

  showCustomModelModal.value = false;
  mobileMarketSearchQueryParams.value.searchText = tag;
  searchBus.emit();
}
</script>

<style scoped lang="less">
.gradient-button {
  box-shadow: 0 5px 15px rgba(242, 97, 103, 0.4);
  font-size: 12px;
  font-weight: bold;
}
</style>
