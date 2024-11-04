<template>
  <div
    class="flex items-center justify-center relative"
    :style="{ height: height + 'px', width: '100%' }"
  >
    <div
      @click="openModel(info)"
      style="
        position: absolute;
        top: 0;
        width: 100%;
        height: 60%;
        background: linear-gradient(
          184deg,
          rgba(234, 76, 137, 0.5) 0%,
          rgba(234, 76, 137, 0.3) 100%
        );
      "
    >
      <s1-img :src="info?.thumbnail?.url"></s1-img>
    </div>

    <div
      style="
        position: absolute;
        bottom: 0;
        width: 100%;
        height: calc(40% + 18px);
        border-top-left-radius: 12px;
        border-top-right-radius: 12px;
        z-index: 1;
        background: #fff;
        box-shadow: rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px;
        row-gap: 12px;
      "
      class="flex flex-col items-center justify-start overflow-auto"
    >
      <div
        style="
          width: 92vw;
          padding: 12px;
          box-sizing: border-box;
          overflow: auto;
          column-gap: 6px;
        "
        class="flex items-center hide-scrollbar"
      >
        <div
          v-for="item in relatedList"
          @click="openModel(item)"
          style="width: 64px; height: 64px; background: #fcfcfc"
        >
          <s1-img :src="item.thumbnail.url"></s1-img>
        </div>
      </div>
      <van-button
        round
        type="primary"
        color="rgba(234, 76, 137, 1)"
        style="
          width: 90vw;
          box-shadow: rgba(234, 76, 137, 1) 0px 1px 0px, rgba(234, 76, 137, 1) 0px 0px 8px;
        "
        icon="cart-o"
        @click="$router.push({ name: 'market' })"
      >
        前往商城
      </van-button>

      <van-button
        round
        style="width: 90vw"
        icon="bag-o"
        plain
        color="rgba(234, 76, 137, 1)"
        @click="$router.push({ name: 'design' })"
      >
        免费定制
      </van-button>

      <div style="flex: 1"></div>
      <div style="color: #aaa">
        关注我们 , 寻求更多设计 !
        <span class="link" @click="$router.push('/')"> 返回首页 </span>
      </div>
      <contactUs></contactUs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { functionsIn } from "lodash";
import { ref, computed, onBeforeMount } from "vue";
import { showConfirmDialog, showToast } from "vant";
import { useConfigStore } from "@/store/stores/config";
import { showImagePreview } from "vant";
import { useRoute } from "vue-router";
import { openCustomModelModal } from "../content/customModel";
import Api from "@/api";
import { useWindowSize } from "@vueuse/core";
import contactUs from "./contact.vue";
const route = useRoute();

const { width, height } = useWindowSize();

const info = ref();

const relatedList = ref([]);

async function openModel(_info?) {
  openCustomModelModal(_info);
}

onBeforeMount(async () => {
  let id = route.query.id;

  if (!id) {
    return showToast("不存在的服装");
  }

  try {
    let res = await Api.getCustomModelById(id);

    info.value = res;

    openCustomModelModal(info.value);

    // 寻找相同关联模型的列表
    let related = await Api.getCustomModelList({
      currentPage: 1,
      pageSize: 12,
      baseModelId: info.value.meta.modelInfo.baseModelId,
    });

    relatedList.value = related.list;
  } catch (e) {
    return showToast("服装信息获取失败");
  }
});
</script>

<style scoped lang="less">
.link {
  color: rgba(234, 76, 137, 0.5);
  &:hover {
    color: rgba(234, 76, 137, 0.8);
  }
}

.gradient-bg {
  color: #fff;
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  animation: gradientBG 15s ease infinite;
}

@keyframes gradientBG {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
