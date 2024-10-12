<template>
  <div ref="container" class="container">
    <div class="item" v-for="item in models">
      <div class="img">
        <s1-image :src="item.thumbnail?.url"></s1-image>
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

      <a-row>
        <a-col :span="24">
          <a-statistic :value="item.link_count" :precision="0">
            <template #prefix>
              <FormOutlined />
            </template>
            <template #suffix> 个作品使用了该模型 </template>
          </a-statistic>
        </a-col>
      </a-row>

      <div style="flex: 1"></div>
      <a-row>
        <a-col :span="24" align="right">
          <a-statistic title="单件售价" :value="item.price || 0" :precision="2">
            <template #prefix>
              <PayCircleOutlined />
            </template>
          </a-statistic>
        </a-col>
      </a-row>
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
.container {
  width: 1000px;
  height: 600px;
  overflow: auto;
  display: flex;
  column-gap: 10px;
  margin: 12px;
  padding: 12px;
}

.item {
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
  padding: 12px;
  flex-shrink: 0;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px;
}

.img {
  width: 300px;
  height: 240px;
  background-color: #f6f6f6;
}
</style>
