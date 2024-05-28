<template>
  <div class="grid">
    <el-row>
      <el-col :span="24 / column" v-for="item in list">
        <slot></slot>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  list: {
    default: [],
  },
  column: {
    default: 2,
  },
  padding: {
    default: 0,
  },
});
</script>

<style>
.grid {
  width: 100%;
  height: 100%;
}
</style>
