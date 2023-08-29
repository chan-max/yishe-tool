<template>
  <div class="admin-model-index">
    <el-card class="admin-model-index-card" v-for="m in models" shadow="never">
      <img
        style="width: 100%; height: 100%"
        :src="__DEV__ ? '/api' + m.imgPath : m.imgPath"
      />
    </el-card>
    <el-card
      @click="$router.push({ name: 'ModelUpload' })"
      class="admin-model-index-card"
      shadow="never"
    >
      <el-icon style="color: var(--el-color-primary); font-size: 20px"
        ><UploadFilled
      /></el-icon>
      <span style="font-size: 12px; font-weight: bold; padding: 5px; color: #888"
        >上传模型</span
      >
    </el-card>
  </div>
</template>

<script setup>
import { UploadFilled } from "@element-plus/icons-vue";
import { getBaseModelList } from "@/api";
import { onMounted, ref } from "vue";

const models = ref([]);

onMounted(async () => {
  const res = await getBaseModelList();
  models.value = res.data;
});
</script>
<style lang="less">
.admin-model-index {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  grid-auto-rows: 160px;
  justify-items: center;
}

.admin-model-index-card {
  width: 220px;
  height: 140px;
  background: #f5f5f5 !important;
  &:hover {
    border: 1px solid #aaa;
    cursor: pointer;
  }
}

.el-card__body {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 !important;
}
</style>
