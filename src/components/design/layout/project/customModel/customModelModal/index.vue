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
      <el-col :span="24">
        <el-row style="row-gap: 2rem">
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
