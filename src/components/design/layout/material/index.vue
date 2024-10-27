<template>
  <div class="content flex flex-col">
    <a-alert
      message="该模块用于控制服装的材质，颜色等属性"
      type="success"
      style="margin: 24px 12px 24px 12px"
    />

    <el-form label-width="84px" label-position="left" style="margin: 0 24px">
      <el-form-item label="服装颜色">
        <div class="flex flex-wrap" style="gap: 12px">
          <div
            v-for="item in normalClothingColors"
            :style="{ background: item.value }"
            class="color-item"
            :title="item.label"
            @click="currentModelController.state.material.color = item.value"
          ></div>
        </div>
      </el-form-item>

      <el-form-item label="自定义颜色">
        <el-color-picker v-model="currentModelController.state.material.color" />
      </el-form-item>

      <el-form-item label="材质纹理">
        <template v-if="currentModelController.state.material.textureInfo">
          <div>
            <s1-img
              style="background: #f7f7f7; width: 200px; height: 200px"
              :src="currentModelController.state.material?.textureInfo?.thumbnail?.url"
            ></s1-img>
            <el-button
              style="margin-top: 12px"
              @click="currentModelController.state.material.textureInfo = null"
              type="danger"
              plain
              round
              >移除当前纹理</el-button
            >
          </div>
        </template>
        <template v-else>
          <el-button
            @click="viewDisplayController.showMaterialModal = true"
            type="primary"
            round
            >选择一个纹理</el-button
          >
        </template>
      </el-form-item>

      <el-form-item label="粗糙度">
        <el-slider
          :min="0"
          :max="1"
          :step="0.01"
          v-model="currentModelController.state.material.roughness"
          size="small"
        />
      </el-form-item>

      <el-form-item label="金属感">
        <el-slider
          :min="0"
          :max="1"
          :step="0.01"
          v-model="currentModelController.state.material.metailness"
          size="small"
        />
      </el-form-item>

      <el-form-item label="纹理密度">
        <el-slider
          :min="1"
          :max="20"
          :step="1"
          v-model="currentModelController.state.material.textureRepeat"
          size="small"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { viewDisplayController, currentModelController } from "@/components/design/store";
import { normalClothingColors } from "./index.ts";
</script>

<style scoped lang="less">
.content {
  width: 340px;
  height: 100%;
}

.color-item {
  width: 24px;
  height: 24px;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
      rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
    transform: scale(1.1);
  }
}
</style>
