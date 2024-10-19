<template>
  <operate-form-item>
    <template #icon>
      <icon></icon>
    </template>
    <template #name> {{ label }} </template>
    <template #content>
      <template v-if="model">
        <el-popover placement="right" popper-class="el-popover-operation" width="280">
          <template #reference>
            <div class="flex items-center">
              <div class="text-ellipsis" style="font-size: 1rem; max-width: 180px">
                已引用图片 : {{ model.name || "未命名" }}
              </div>
            </div>
          </template>
          <el-row align="middle" justify="center" style="row-gap: 1rem">
            <el-col :span="24">
              <div class="flex justify-center">
                <s1-image
                  @load="imgLoad"
                  ref="imgRef"
                  style="width: 240px; height: 240px"
                  :src="model.url"
                  :lazy="false"
                >
                </s1-image>
              </div>
            </el-col>

            <el-col :span="24">
              <div style="display: flex">
                <div style="flex: 1"></div>
                <el-button @click="remove" size="small" type="danger" :icon="Close">
                  移除
                </el-button>
              </div>
            </el-col>
          </el-row>
        </el-popover>
      </template>
      <template v-else>
        <el-button size="small" link @click="select"> 选择图片 </el-button>
      </template>
    </template>
  </operate-form-item>

  <modal
    v-model:open="showImageSelectModal"
    @close="showImageSelectModal = false"
  ></modal>
</template>

<script setup lang="ts">
import { ref } from "vue";
import icon from "@/components/design/assets/icon/background-image.svg?component";
import { showSticker, viewDisplayController } from "@/components/design/store";
import { Close } from "@element-plus/icons-vue";
import desimage from "@/components/image.vue";
import modal from "./modal.vue";
import { showImageSelectModal } from "./index.tsx";

import { updateCanvasStickerOptionsUnit } from "@/components/design/layout/canvas/helper";

import { canvasStickerOptions } from "@/components/design/layout/canvas/index";

const model = defineModel({});

/*
    将当前画布尺寸同步为当前图片尺寸，
    适用于处理单个图片的形式
*/

const imgRef = ref();

const props = defineProps({
  label: {
    default: "选择图片",
  },
});

/*
    增加按图片尺寸调整画布尺寸功能
*/

function select() {
  showImageSelectModal.value = true;
}

function remove() {
  model.value = null;
}

function imgLoad() {}
</script>

<style></style>
