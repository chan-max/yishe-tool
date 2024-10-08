<template>
  <div>
    <el-breadcrumb separator="/">
      <template v-for="(item, index) in breadcrumbData" :key="item.path">
        <el-breadcrumb-item>
          <span class="no-redirect">
            {{ item.meta.title }}
          </span>
        </el-breadcrumb-item>
      </template>
    </el-breadcrumb>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const breadcrumbData = ref([]);

const getBreadcrumbData = () => {
  breadcrumbData.value = route.matched.filter((item) => item.meta && item.meta.title);
};

watch(
  route,
  () => {
    getBreadcrumbData();
  },
  { immediate: true }
);
</script>

<style scoped>
.breadcrumb {
  display: flex;
}
.no-redirect {
  color: #333;
  cursor: text;
  font-size: 12px;
}

:deep(.el-breadcrumb__separator){
    color: #aaa;
}
</style>
