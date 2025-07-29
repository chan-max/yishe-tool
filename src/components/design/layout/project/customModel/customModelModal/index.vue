

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
    width="1200px"
    style="min-width: 1200px"
  >
    <el-row style="height: 500px; margin: 24px 12px; overflow: auto" :gutter="24">
      <!-- 左侧：3D模型预览 -->
      <el-col :span="14" style="height: 100%;">
        <div style="height: 100%; background: #f5f5f5; border-radius: 8px; overflow: hidden;">
          <gltf-viewer
            v-if="show && detailInfo"
            :model="detailInfo.meta.modelInfo"
            style="width: 100%; height: 100%;"
          />
        </div>
      </el-col>
      
      <!-- 右侧：模型信息 -->
      <el-col :span="10" style="height: 100%;">
        <div style="height: 100%; display: flex; flex-direction: column; justify-content: space-between;">
          <!-- 模型基本信息 -->
          <div>
            <h1 style="margin-bottom: 16px; font-size: 24px; font-weight: bold;">
              {{ detailInfo.name || "--" }}
            </h1>
            <p style="margin-bottom: 24px; color: #666; line-height: 1.6;">
              {{ detailInfo.description || "暂无描述" }}
            </p>
            
            <!-- 缩略图 -->
            <div v-if="detailInfo.thumbnail" style="margin-bottom: 24px;">
              <el-image 
                :src="detailInfo.thumbnail" 
                style="width: 100%; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" 
                fit="cover"
                :preview-src-list="[detailInfo.thumbnail]" 
                :preview-teleported="true" 
              />
            </div>
          </div>
          
          <!-- 上传者信息 -->
          <div class="flex items-center" style="column-gap: 1rem; padding-top: 16px; border-top: 1px solid #eee;">
            <a-avatar size="large" :src="detailInfo?.uploader?.avatar" alt="?">
              <template #icon>
                <UserOutlined />
              </template>
            </a-avatar>
            <div>
              <div style="font-weight: bold;">{{ detailInfo.uploader?.name || "--" }}</div>
              <div style="font-size: 12px; color: #999;">上传者</div>
            </div>
          </div>
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
