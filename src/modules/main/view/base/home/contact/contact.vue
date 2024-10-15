<template>
  <div class="flex flex-col items-center">
    <h1>关注我们</h1>
    <div class="flex" style="gap: 24px; flex-wrap: wrap; padding: 24px">
      <template v-for="item in configStore.json.homepageContratUsLinks">
        <contactItem :item="item"></contactItem>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useConfigStore } from "@/store/stores/config";
import Utils from "@/common/utils";
import contactItem from "./item.vue";

const configStore = useConfigStore();
</script>

<style scoped lang="less"></style>
