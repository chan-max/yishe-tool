<template>
  <div class="content">
    <div class="list" v-infinite-scroll="getList" :infinite-scroll-distance="150">
      <el-row :gutter="8" style="row-gap: 1em">
        <el-col :span="24 / column" v-for="item in list" align="center">
          <div class="item">
            <div class="preview">
                <gltf-viewer :model="item.meta.modelInfo"></gltf-viewer>
                <!-- <desimage :src="'http://' + item.thumbnail" :draggable="false"></desimage> -->
            </div>
            <el-popover placement="auto" trigger="click" width="auto">
              <template #reference>
                <div class="bar">
                  <div class="title text-ellipsis">{{ item.name || "......" }}</div>
                  <el-icon><ArrowRightBold /></el-icon>
                </div>
              </template>
              <popover></popover>
            </el-popover>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script setup lang="tsx">
import { ref, onBeforeMount } from "vue";
import { Search, ArrowRightBold } from "@element-plus/icons-vue";
import { getCustomModelListApi } from "@/api";
import { usePaging } from "@/hooks/data/paging.ts";
import desimage from "@/components/design/components/image.vue";
import popover from "./popover.vue";
import gltfViewer from '@/components/model/gltfViewer/index.vue';


const { list, getList } = usePaging((params) => {
  return getCustomModelListApi({
    ...params,
    pageSize: 10,
  });
});

// 列表展示几列
const column = ref(2);
</script>
<style lang="less" scoped>
@item-width: 40px;
.content {
  width: 260px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}



.list {
  width: 100%;
  flex: 1;
  overflow: auto;
  padding: 1em;
}

.item {
  width: auto;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 0.5em;
}

.preview{
  width: 100%;
  height: 10em;
  background:#eee;
}

.title {
  width: 100%;
  text-align: left;
}

.bar {
  width: 100%;
  font-size: 1em;
  color: #555;
  display: flex;
  justify-content: space-between;
  align-items: center;
  column-gap: 1em;
  &:hover {
    color: #000;
    cursor: pointer;
  }

  .el-icon {
    height: 1em;
    line-height: 1em;
  }
}
</style>
