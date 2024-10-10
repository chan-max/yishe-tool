<template>
  <div>
    <template v-for="(item, index) in data">
      <template v-if="item.children?.length > 0">
        <el-sub-menu :key="index" :index="item.path">
          <template #title>
            <div class="sub-menu-item">
              <el-icon><component :is="item.meta.icon"></component></el-icon>
              <span>{{ item.meta.title }}</span>
            </div>
          </template>
          <sidebarItem :data="item.children"></sidebarItem>
        </el-sub-menu>
      </template>

      <template v-else>
        <el-menu-item :key="index" :index="item.path" @click="itemClick(item)">
          <i :class="item.icon"></i>
          <template #title>
            <div class="menu-item">
              <el-icon><component :is="item.meta.icon"></component></el-icon>
              <span>{{ item.meta.title }}</span>
            </div>
          </template>
        </el-menu-item>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const props = defineProps({
  data: {
    default: [],
  },
});

const router = useRouter();

function itemClick(item) {
  router.push({
    name: item.name,
  });
}
</script>

<style lang="less">
.sub-menu-item,
.menu-item {
  display: flex;
  align-items: center;
  svg {
    width: 14px;
    height: 14px;
  }
}
</style>
