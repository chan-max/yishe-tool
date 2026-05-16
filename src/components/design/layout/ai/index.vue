<template>
  <AiDrawer v-model:open="isAiPanelOpen" />
</template>

<script setup lang="ts">
import { isAiPanelOpen } from "@/ai/store";
import AiDrawer from "./AiDrawer.vue";
</script>
