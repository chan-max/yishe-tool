<template>
  <div class="admin-image-index">
    <el-card class="admin-image-index-card" v-for="i in images" shadow="never">
      <img
        style="width: 100%; height: 100%"
        :src="i.path"
      />
    </el-card>
    <el-card
      @click="$router.push({ name: 'ModelUpload' })"
      class="admin-image-index-card"
      shadow="never"
    >
      <el-icon style="color: var(--el-color-primary); font-size: 20px"
        ><UploadFilled
      /></el-icon>
      <span style="font-size: 12px; font-weight: bold; padding: 5px; color: #888"
        >上传图片</span
      >
    </el-card>
  </div>
</template>

<script setup>
import { UploadFilled } from "@element-plus/icons-vue";
import { getImageList} from "@/api";
import { onMounted, ref } from "vue";

const images = ref([]);

onMounted(async () => {
  images.value = await getImageList();
});

</script>
<style lang="less">
.admin-image-index {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  grid-auto-rows: 160px;
  justify-items: center;
}

.admin-image-index-card {
  width: 260px;
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
