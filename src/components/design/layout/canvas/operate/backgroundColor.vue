<template>
  <operate-form-item>
    <template #icon> <icon></icon></template>
    <template #name> 背景色 </template>
    <template #content>
      <color-picker v-model="model"></color-picker>
    </template>
  </operate-form-item>
</template>

<script setup lang="ts">
import icon from "@/components/design/assets/icon/background-color.svg?component";
const model = defineModel({});
</script>

<style></style>
