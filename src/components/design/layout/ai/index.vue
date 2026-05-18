<template>
  <AiPanel :open="isAiPanelOpen" @close="isAiPanelOpen = false" />
</template>

<script setup lang="ts">
import { isAiPanelOpen } from "@/ai/store";
import AiPanel from "./AiPanel.vue";
</script>
