<template>
  <van-popup
    v-model:show="showShareCardPopup"
    closeable
    position="bottom"
    :style="{ width: '100%', height: '90%' }"
    :safe-area-inset-top="true"
    :safe-area-inset-bottom="true"
    @open="open"
    round
  >
    <template v-if="showShareCardPopup">
      <div
        class="flex flex-col h-full items-center justify-center"
        style="padding: 64px 0 36px 0; row-gap: 48px; box-sizing: border-box"
      >
        <!-- <shareCard :info="currentShareCardInfo" ref="cardRef" :width="360"></shareCard> -->

        <div
          ref="qrcodeRef"
          style="width: 300px; height: 300px"
          class="flex items-center justify-center"
        >
          <div v-if="loading" class="flex flex-col items-center justify-center">
            <van-loading type="spinner" />
            <div class="text-center" style="margin-top: 24px; color: #aaa">
              正在生成二维码
            </div>
          </div>

          <img v-else :src="previewRef" />
        </div>

        <div>
          <van-button type="primary" round @click="download" icon="down"
            >下载卡片</van-button
          >
          <van-button
            icon="link-o"
            style="margin-left: 12px"
            type="primary"
            round
            @click="copy"
            >复制链接</van-button
          >
          <van-button
            icon="share-o"
            style="margin-left: 12px"
            type="primary"
            round
            @click="share"
            >分享模型</van-button
          >
        </div>

        <!-- <div>如果卡片出现模型图或二维码丢失，请尝试更换设备或截图保存</div> -->
      </div>
    </template>
  </van-popup>
</template>

<script setup lang="ts">
import { showShareCardPopup, currentShareCardInfo } from "./index.ts";
import { ref, computed, onMounted, nextTick, shallowRef } from "vue";
import { showToast } from "vant";
import { useConfigStore } from "@/store/stores/config";
import shareCard from "@/components/design/layout/shareCard/shareCard.vue";
import QRCodeStyling from "qr-code-styling";
import { createCustomModelShareLink } from "@/components/design/layout/shareCard";
import { downloadByFile } from "@/common/transform";
import { base64ToFile, base64ToPngFile } from "@/common/transform/base64ToFile";
import { remoteImageUrlToRemoveTransparentEdgesLocalPreviewUrl } from "@/common/transform/imageData.ts";

function save() {}

const qrcodeRef = ref();

function open() {
  initQrcode();
}

let qrRef = ref();

let loading = ref(false);
let fileRef = shallowRef();
let previewRef = ref("");

async function initQrcode() {
  let data = createCustomModelShareLink(currentShareCardInfo.value.id);

  let img = await remoteImageUrlToRemoveTransparentEdgesLocalPreviewUrl(
    currentShareCardInfo.value.thumbnail.url
  );

  loading.value = true;
  let qr = new QRCodeStyling({
    width: 300,
    height: 300,
    type: "canvas",
    data: data,
    image: img,
    dotsOptions: {
      type: "dots",
      color: "#6a1a4c",
      roundSize: true,
      gradient: {
        type: "linear",
        rotation: 0,
        colorStops: [
          {
            offset: 0,
            color: "#af1273",
          },
          {
            offset: 1,
            color: "#e94701",
          },
        ],
      },
    },
    backgroundOptions: {
      color: "transparent",
    },
    imageOptions: {
      crossOrigin: "anonymous",
      margin: 10,
    },
  });

  await nextTick();
  qrRef.value = qr;
  let blob = await qr.getRawData("png");

  let file = new File([blob], "1s.png");
  fileRef.value = file;
  //   qr.append(qrcodeRef.value);
  previewRef.value = URL.createObjectURL(file);
  loading.value = false;
}

async function copy() {
  await navigator.clipboard.writeText(
    createCustomModelShareLink(currentShareCardInfo.value.id)
  );
  showToast("链接复制成功");
}

async function download() {
  downloadByFile(fileRef.value);
}

async function share() {
  navigator.share({
    files: [fileRef.value],
    text: currentShareCardInfo.value.description,
    title: currentShareCardInfo.value.name,
    url: createCustomModelShareLink(currentShareCardInfo.value.id),
  });
}
</script>

<style></style>
