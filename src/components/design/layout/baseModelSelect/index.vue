<template>
  <div ref="container" class="base-model-select-container">
    <div class="item" v-for="item in models">
      <div class="img">
        <s1-image :src="item.thumbnail"></s1-image>
      </div>

      <h1 style="max-width: 300px; word-wrap: break-word">{{ item.name }}</h1>

      <div>{{ item.description }}</div>
      <div>最近更新时间： {{ item.updateTime }}</div>

      <a-row>
        <a-col :span="24">
          <a-image-preview-group v-if="item?.meta?.details">
            <div
              style="
                width: 100%;
                display: flex;
                overflow: auto;
                width: 300px;
                column-gap: 4px;
                row-gap: 4px;
              "
            >
              <a-image
                v-for="img in item?.meta?.details"
                :width="36"
                :height="36"
                :src="img.url"
              />
            </div>
          </a-image-preview-group>
        </a-col>
      </a-row>

      <div style="flex: 1"></div>

      <el-button @click="selectModel(item)" type="primary" plain> 使用该模型 </el-button>
    </div>
  </div>
</template>
<script setup>
import { getProductModelList } from "@/api";
import { onMounted, ref } from "vue";
import { PayCircleOutlined, FormOutlined } from "@ant-design/icons-vue";
import {
  showBaseModelSelect,
  currentOperatingBaseModelInfo,
  showModelInfo,
} from "../../store.ts";
import desimage from "@/components/image.vue";

const models = ref([]);

const container = ref();

onMounted(async () => {
  const res = await getProductModelList({
    currentPage: 1,
    pageSize: 100,
  });

  models.value = res.list;

  // 适配鼠标滑轮横向滚动
  container.value.addEventListener(
    "wheel",
    (event) => {
      container.value.scrollLeft += event.deltaY;
      // event.preventDefault();
    },
    { passive: false }
  );
});
import { isRef, isReactive, toRaw, unref } from "vue";

function selectModel(productModel) {
  // 选择基础模型
  showBaseModelSelect.value = false;
  currentOperatingBaseModelInfo.value = productModel;
  showModelInfo.value = true;
}
</script>
<style lang="less" scoped>
.base-model-select-container {
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  column-gap: 10px;
}

.item {
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
  padding:2em;
  flex-shrink: 0;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px;
}

.img {
  width: 300px;
  height: 240px;
  background-color: #f6f6f6;
}
</style>
