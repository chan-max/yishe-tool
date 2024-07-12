<template>
  <operate-form-item>
    <template #icon> <icon-font-color></icon-font-color> </template>
    <template #name> 字体颜色</template>
    <template #content>
      <color-picker  v-model="model" ></color-picker>
    </template>
  </operate-form-item>
</template>

<script setup lang="ts">
import iconFontColor from "@/components/design/assets/icon/font-color.svg?component";
const model = defineModel({});

</script>

<style></style>
