<template>
  <operate-form-item>
    <template #icon>
      <icon></icon>
    </template>
    <template #name> {{ label }} </template>
    <template #content>
      <el-tooltip :disabled="!tooltip" :content="tooltip">
        <color-picker v-model="model" v-bind="$attrs"></color-picker>
      </el-tooltip>
    </template>
  </operate-form-item>
</template>

<script setup lang="ts">
import icon from "@/components/design/assets/icon/color.svg?component";

// 通用的颜色操作

const model = defineModel({});

const props = defineProps({
  label: {
    default: "颜色",
  },
  tooltip: {
    default: "",
  },
});
</script>

<style></style>
