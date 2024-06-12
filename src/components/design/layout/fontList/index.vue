<template>
  <div class="designiy-font-list">
    <el-row>
      <el-col v-for="item in list" :span="8">
        <el-image
          @click="selectFont(item)"
          :src="'https://' + item.thumbnail"
          class="w-full h-full"
          fit="contain"
        >
        </el-image>
      </el-col>
    </el-row>
  </div>
</template>
<script setup>
import { ref, onBeforeMount } from "vue";
import { getFontListApi } from "@/api";
import { operatingTextStickerOptions, showFontList } from "../../store.ts";
import { usePaging } from "@/hooks/data/paging.ts";

const { list, getList } = usePaging((params) => {
  return getFontListApi({
    ...params,
  });
});

function selectFont(info) {
  operatingTextStickerOptions.fontFamilyInfo = info;
  operatingTextStickerOptions.fontFamilyId = info.id;
  showFontList.value = false;
}
</script>
<style lang="less" scoped>
.designiy-font-list {
  width: 800px;
  height: 400px;
  overflow: auto;
  padding: 2em 4em;
}
</style>
