<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2025-05-20 06:50:38
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2025-06-03 08:07:27
 * @FilePath: /1s/src/components/design/layout/material/modal.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <a-modal
    v-bind="$attrs"
    v-model:open="viewDisplayController.showMaterialModal"
    width="980px"
    title="服装材料"
    style="min-width: 980px"
    :footer="null"
    centered
    :destroyOnClose="true"
  >
    <div
      style="padding: 0 12px; height: 64px; width: 100%"
      class="flex justify-between items-center"
    >
      <el-input style="width: 360px"></el-input>
      <div style="flex: 1"></div>
      <div
        v-if="currentModelController.state.material.textureInfo"
        class="flex items-center"
        style="column-gap: 12px"
      >
        正在使用:
        <s1-img
          :src="currentModelController.state?.material.textureInfo?.url"
          style="width: 32px; height: 32px"
          fit="cover"
        ></s1-img>

        <el-button @click="removeMaterial"> 移除当前材质 </el-button>
      </div>
    </div>
    <div style="height: 480px; overflow: auto; padding: 12px" v-infinite-scroll="getList">
      <el-row :gutter="8">
        <template v-for="item in list">
          <el-col :span="6" style="margin: 8px 0">
            <div @click="itemClick(item)" :draggable="false">
              <s1-img
                :src="item.url"
                style="background: #f7f7f7; height: 160px"
              ></s1-img>
            </div>
          </el-col>
        </template>
      </el-row>
      <s1-paging-bottom
        :loading="loading"
        :isEmpty="isEmpty"
        :isLastPage="isLastPage"
      ></s1-paging-bottom>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, unref } from "vue";
import { ClickOutside as vClickOutside } from "element-plus";
import { viewDisplayController, currentModelController } from "@/components/design/store";
import { usePaging } from "@/hooks/data/paging.ts";
import { currentMaterialInfo, showMaterialDetailModal } from "./index.ts";
import Api from "@/api";
import Utils from "@/common/utils";

let search = ref("");

const { list, getList, isLastPage, isEmpty, loading } = usePaging((params) => {
  return Api.getStickerList({
    ...params,
    type: "texture",
    pageSize: 12,
  });
});

// 使用该材质
function itemClick(item) {
  showMaterialDetailModal.value = true;
  currentMaterialInfo.value = item;
}

function removeMaterial() {
  // 移除当前材质
  currentModelController.value.state.material.textureInfo = null;
}
</script>

<style scoped lang="less"></style>
