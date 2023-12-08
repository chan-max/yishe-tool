<template>
  <div class="designiy-font-list">
    <div class="designiy-font-list-content">
      <div class="designiy-font-list-item" v-for="item in data" @click="selectFont(item)">
        <el-image
          :src="item.fullimgpath"
          class="w-full h-full"
          style="padding: 20px"
          fit="contain"
        >
        </el-image>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onBeforeMount } from "vue";
import { getFonts } from "@/api";
import {operatingTextStickerOptions,showFontList} from '../../store.ts'
const data = ref();

onBeforeMount(async () => {
  data.value = await getFonts();
});

function selectFont(font) {
  operatingTextStickerOptions.fontFamilyInfo = font;
  showFontList.value = false
}

</script>
<style lang="less">
.designiy-font-list {
  width: 800px;
  overflow: auto;
  height: 400px;
}

.designiy-font-list-content {
  width: 100%;
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 10px;
  padding: 10px;
}

.designiy-font-list-item {
  width: 100%;
  height: 140px;
  background-color: #fafafa;
  border-radius: 12px;
  flex-shrink: 0;
}
</style>
