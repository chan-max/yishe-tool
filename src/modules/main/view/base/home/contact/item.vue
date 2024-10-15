<template>
  <div @click="redirect(item)">
    <el-popover :disabled="!item.card" width="auto">
      <template #reference>
        <s1-image class="logo" :src="item.icon"></s1-image>
      </template>
      <div>
        <div>
          <s1-img :src="item.card" style="width: 180px"></s1-img>
        </div>
        <div style="text-align: center"></div>
      </div>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import Utils from "@/common/utils";
import QRCodeStyling from "qr-code-styling";
import { onMounted, ref } from "vue";

const props = defineProps({
  item: {
    default: {} as any,
  },
});

function redirect(item) {
  if (Utils.isMobile) {
    if (!item.appHref) {
      return;
    }
    window.location.href = item.appHref;
  } else {
    if (!item.webHref) {
      return;
    }
    window.open(item.webHref, "_blank");
  }
}
</script>

<style lang="less" scoped>
.logo {
  cursor: pointer;
  width: 64px;
  height: 64px;

  transition: all 0.2s;
  &:hover {
    transform: scale(1.2);
  }
}
</style>
