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
    <div style="padding: 12px 0; width: 100%">
      <el-input style="width: 360px"></el-input>
    </div>
    <div style="height: 480px; overflow: auto; padding: 12px" v-infinite-scroll="getList">
      <el-row :gutter="8">
        <template v-for="item in list">
          <el-col :span="6" style="margin: 8px 0">
            <a-dropdown>
              <s1-img :src="item.thumbnail.url" style="background: #f7f7f7"></s1-img>
              <template #overlay>
                <a-menu>
                  <a-menu-item @click="use(item)"> 使用该材质 </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </el-col>
        </template>
      </el-row>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, unref } from "vue";
import { ClickOutside as vClickOutside } from "element-plus";
import { viewDisplayController, currentModelController } from "@/components/design/store";
import { usePaging } from "@/hooks/data/paging.ts";
import Api from "@/api";

let search = ref("");

const { list, getList, isLastPage, isEmpty, loading } = usePaging((params) => {
  return Api.getStickerList({
    ...params,
    type: "texture",
    pageSize: 12,
  });
});

// 使用该材质
function use(item) {
  currentModelController.value.state.value.material.textureId = item.id;
  viewDisplayController.value.showMaterialModal = false;
}
</script>

<style scoped lang="less"></style>
