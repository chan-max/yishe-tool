<template>
  <van-popup
    round
    v-model:show="showColorPopup"
    position="bottom"
    closeable
    style="padding-top: 36px"
    :style="{ height: 'auto', width: '100%' }"
    :safe-area-inset-top="true"
    :safe-area-inset-bottom="true"
  >
    <div style="padding: 24px 0">
      <van-form>
        <van-cell-group inset>
          <van-field label="服装颜色">
            <template #input>
              <div class="flex flex-wrap" style="gap: 6px; width: 100%">
                <div
                  v-for="item in builtInClothingColors"
                  :style="{ background: item.value }"
                  class="color-item"
                  :title="item.label"
                  @click="currentModelController.state.material.color = item.value"
                ></div>
              </div>
            </template>
          </van-field>
        </van-cell-group>
        <van-cell-group inset>
          <van-field label="自定义颜色">
            <template #input>
              <el-color-picker v-model="currentModelController.state.material.color" />
            </template>
          </van-field>
        </van-cell-group>

        <van-cell-group inset>
          <van-field label="粗糙度">
            <template #input>
              <div class="w-full">
                <div class="w-full">
                  <van-slider
                    :min="0"
                    :max="1"
                    :step="0.01"
                    v-model="currentModelController.state.material.roughness"
                  >
                  </van-slider>
                </div>
              </div>
            </template>
          </van-field>
        </van-cell-group>
      </van-form>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import { showColorPopup } from "./index.ts";
import { builtInClothingColors } from "@/components/design/layout/material/index.ts";
import { currentModelController } from "@/components/design/store";
</script>

<style lang="less" scoped>
.color-item {
  width: 24px;
  height: 24px;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
  border-radius: 4px;
}
</style>
