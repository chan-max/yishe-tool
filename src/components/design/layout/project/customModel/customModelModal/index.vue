

<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2025-07-17 18:51:54
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2025-07-23 05:35:48
 * @FilePath: /design-server/Users/jackie/workspace/1s/src/components/design/layout/project/customModel/customModelModal/index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <a-modal
    v-bind="$attrs"
    v-model:open="show"
    :footer="null"
    :centered="true"
    :destroyOnClose="true"
    width="880px"
    style="min-width: 1080px"
  >
    <el-row style="height: 640px; margin: 24px 12px; overflow: auto" :gutter="24">
      <el-col :span="24">
        <el-row style="row-gap: 2rem">
          <el-col>
            <h1>{{ detailInfo.name || "--" }}</h1>
            <div>{{ detailInfo.description || "......" }}</div>
            <div v-if="detailInfo.thumbnail" style="margin: 16px 0;">
              <el-image :src="detailInfo.thumbnail" style=" border-radius: 8px; box-shadow: 0 2px 8px #0001;" fit="contain" :preview-src-list="[detailInfo.thumbnail]" :preview-teleported="true" />
            </div>
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
