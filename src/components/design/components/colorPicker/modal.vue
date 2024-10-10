<template>
  <a-modal
    v-model:open="showColorPickerModal"
    width="1080px"
    title="颜色库"
    style="min-width: 1080px"
    :footer="null"
    centered
  >
    <div style="height: 640px"></div>
  </a-modal>
</template>

<script setup lang="ts">
import { showColorPickerModal } from "./index.tsx";
</script>

<style></style>
