<template>
  <a-drawer
    title="模型截图"
    placement="right"
    v-bind="$attrs"
    v-model:open="showScreenshotDrawer"
  >
    <div class="screenshot-drawer" v-if="screenshots.length">
      <div v-for="item in screenshots" class="screenshot-drawer-item">
        <s1-image :src="item.base64" style="width: 100px; height: 100px"></s1-image>
        <div>截取于: {{ Utils.time.timeago(item.createdTime) }}</div>

        <div style="flex: 1"></div>

        <el-button-group>
          <el-button type="primary" size="small" plain @click="download(item)">
            下载当前图片
          </el-button>
          <el-button type="danger" size="small" plain @click="remove(item)">
            移除
          </el-button>
        </el-button-group>
      </div>
    </div>
    <s1-empty v-else>暂无截图</s1-empty>
  </a-drawer>
</template>

<script setup lang="ts">
import { showScreenshotDrawer, screenshots } from "@/components/design/store";
import Utils from "@/common/utils";
import { saveAs } from "file-saver";
function remove(item) {
  let ind = screenshots.value.indexOf(item);
  screenshots.value.splice(ind, 1);
}

async function download(item) {
  let file = Utils.transform.base64ToPngFile(item.base64);
  saveAs(file);
}
</script>

<style lang="less" scoped>
.screenshot-drawer {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  row-gap: 12px;
}

.screenshot-drawer-item {
  display: flex;
  align-items: center;
  column-gap: 12px;
}
</style>
