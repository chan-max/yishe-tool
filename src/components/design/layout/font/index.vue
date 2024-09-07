<template>
  <a-modal v-model:open="showFontModal" title="字体库" width="auto" class="font-a-modal" @ok="handleOk" :footer="null" :centered="true" >
    <page></page>
  </a-modal>
</template>
<script setup>
import { ref, onBeforeMount } from "vue";
import { getFontListApi } from "@/api";
import { operatingTextStickerOptions, showFontModal } from "../../store.ts";
import { usePaging } from "@/hooks/data/paging.ts";
import Utils from '@/common/utils'
import page from './page.vue'
 
</script>
<style lang="less">
.font-a-modal {
  overflow:hidden;
}
</style>
