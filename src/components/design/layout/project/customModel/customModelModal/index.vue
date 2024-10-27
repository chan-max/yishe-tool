<template>
  <a-modal
    v-bind="$attrs"
    v-model:open="show"
    :footer="null"
    :centered="true"
    :destroyOnClose="true"
    width="1080px"
    style="min-width: 1080px"
  >
    <el-row style="height: 640px; margin: 24px 12px; overflow: auto" :gutter="24">
      <el-col :span="16">
        <el-row style="row-gap: 2rem">
          <el-col :span="24">
            <div
              style="width: 100%; height: 500px; background: #eee; border-radius: 1rem"
            >
              <gltf-viewer :model="detailInfo.meta.modelInfo"></gltf-viewer>
            </div>
          </el-col>
          <el-col :span="24">
            <div class="flex" style="column-gap: 12px; overflow: auto; padding: 12px">
              <div
                v-for="item in detailInfo.thumbnails"
                @click="downloadThumbnail(item)"
                title="点击导出原图"
              >
                <s1-image
                  style="width: 64px; height: 64px; background: #eee; border-radius: 4px"
                  :src="item.url"
                ></s1-image>
              </div>
            </div>
          </el-col>
          <el-col>
            <h1>{{ detailInfo.name || "--" }}</h1>
            <div>{{ detailInfo.description || "......" }}</div>
          </el-col>
          <el-col>
            <div class="flex items-center" style="column-gap: 2rem">
              <a-avatar size="large" :src="detailInfo?.uploader?.avatar" alt="?">
                <template #icon>
                  <UserOutlined />
                </template>
              </a-avatar>
              {{ detailInfo.uploader.name || "--" }}
            </div>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="8" style="height: 100%; overflow: auto">
        <div v-for="decal in detailInfo.meta.modelInfo.decals">
          <s1-image :src="decal.fetchResult.thumbnail?.url"></s1-image>
        </div>
      </el-col>
    </el-row>
  </a-modal>
</template>

<script setup lang="ts">
import { useCustomModelDetailModal } from "./index.ts";
import gltfViewer from "@/components/model/gltfViewer/index.vue";
import { UserOutlined } from "@ant-design/icons-vue";

import { saveAs } from "file-saver";

const { show, detailInfo } = useCustomModelDetailModal();

function downloadThumbnail(item) {
  return saveAs(item.url, "thumbnail");
}
</script>

<style></style>
