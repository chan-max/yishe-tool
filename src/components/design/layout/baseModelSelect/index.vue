<template>
  <div ref="container" class="container">
    <div class="item" v-for="item in models">
      <div class="img">
        <desimage :src="item.thumbnail"></desimage>
      </div>
      <h2>{{ item.name }}</h2>
      <div>{{ item.description }}</div>
      <div style="flex:1;"></div>
      <a-row>
        <a-col :span="24" align="right">
          <a-statistic title="单件售价" :value="item.price" :precision="2">
            <template #prefix>
              <PayCircleOutlined />
            </template>
          </a-statistic>
        </a-col>
      </a-row>
      <a-button @click="selectModel(item)" type="primary" ghost> 使用该模型 </a-button>
    </div>
  </div>
</template>
<script setup>
import { getProductModelListApi } from "@/api";
import { onMounted, ref } from "vue";
import { PayCircleOutlined } from "@ant-design/icons-vue";
import {
  showBaseModelSelect,
  currentOperatingBaseModelInfo,
  showModelInfo,
} from "../../store.ts";
import desimage from "@/components/design/components/image.vue";

const models = ref([]);

const container = ref();

onMounted(async () => {
  const res = await getProductModelListApi({
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
  margin: 16px;
  padding: 16px;
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
