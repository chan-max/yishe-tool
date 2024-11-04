<template>
  <operate-form-item style="align-items: start">
    <template #icon>
      <icon></icon>
    </template>
    <template #name> {{ label }} </template>
    <template #content>
      <el-input
        :placeholder="placeholder"
        :autosize="{ minRows: 10, maxRows: 99 }"
        type="textarea"
        v-model="model"
        size="small"
      ></el-input>
    </template>
  </operate-form-item>
</template>

<script setup lang="ts">
import icon from "@/components/design/assets/icon/text-content.svg?component";
import { ref } from "vue";

const model = defineModel({ default: "" });

const props = defineProps({
  label: {
    default: "html代码",
  },
  placeholder: {
    default: "请输入",
  },
});
</script>

<style></style>
