<template>
  <div class="content flex flex-col">
    <el-form label-width="72px" label-position="left">
      <el-form-item label="材质颜色">
        <el-color-picker v-model="currentModelController.state.material.color" />
      </el-form-item>

      <el-form-item label="材质纹理">
        <template v-if="currentModelController.state.material.textureInfo">
          <div>
            <s1-img
              style="background: #f7f7f7"
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
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { viewDisplayController, currentModelController } from "@/components/design/store";
</script>

<style scoped lang="less">
.content {
  width: 340px;
  height: 100%;
  padding: 24px;
}
</style>
