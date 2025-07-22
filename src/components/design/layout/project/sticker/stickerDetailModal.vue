<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2025-05-20 06:50:38
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2025-07-22 19:51:34
 * @FilePath: /1s/src/components/design/layout/project/sticker/stickerDetailModal.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <a-modal
    v-model:open="show"
    :footer="null"
    :centered="true"
    :destroyOnClose="true"
    @close="close"
    width="980px"
  >
    <div class="flex">
      <s1-img
        :src="detailInfo.url"
        style="width: 480px; height: 480px; flex-shrink: 0"
        @load="imgLoad"
      >
      </s1-img>
      <div style="padding: 24px; row-gap: 12px" class="flex flex-col">
        <h1>{{ detailInfo.name  }}</h1>
        <h6>{{ detailInfo.description }}</h6>
        <h6>{{ detailInfo.keywords }}</h6>
        <h6>{{ detailInfo.updateTime }}</h6>
        <div class="color-palette flex" style="column-gap: 12px">
          <div
            v-for="color in colors"
            :key="color"
            style="width: 24px; height: 24px; border-radius: 12px; cursor: pointer; border: 1px solid #eee;"
            :style="{ background: color }"
            @click="copyColor(color)"
            :title="'点击复制 ' + color"
          ></div>
        </div>
      </div>
    </div>
  </a-modal>
</template>
<script setup lang="ts">
import { useStickerDetailModal } from "./stickerModal.ts";
import { ref } from "vue";
import Utils from "@/common/utils";
import { message } from "ant-design-vue";

const { show, detailInfo } = useStickerDetailModal();

const palette = ref();

const colors = ref([]);

function close() {
  colors.value = [];
}

// 复制颜色到剪贴板并提示
function copyColor(color: string) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(color).then(() => {
      message.success("已复制: " + color);
    });
  } else {
    // fallback
    const input = document.createElement('input');
    input.value = color;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    message.success("已复制: " + color);
  }
}

// 图片加载完成
async function imgLoad(img) {
  img.crossOrigin = "Anonymous";
  let _palette = (await Utils.color.getPalette(img)) as Array<[number, number, number]>;

  colors.value = _palette.map((rgb) => {
    return `rgba(${rgb.join(",")})`;
  });

  palette.value = _palette;
}
</script>

<style lang="less" scoped></style>
