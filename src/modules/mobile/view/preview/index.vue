<template>
  <div></div>
</template>

<script setup lang="ts">
import { functionsIn } from "lodash";
import { ref, computed, onBeforeMount } from "vue";
import { showConfirmDialog, showToast } from "vant";
import { useConfigStore } from "@/store/stores/config";
import { showImagePreview } from "vant";
import { useRoute } from "vue-router";
import { openCustomModelModal } from "../content/customModel";
import Api from "@/api";
const route = useRoute();

const info = ref();

onBeforeMount(async () => {
  let id = route.query.id;

  if (!id) {
    return showToast("不存在的服装");
  }

  try {
    info.value = await Api.getCustomModelById(id);
    openCustomModelModal(info.value);
  } catch (e) {
    return showToast("服装信息获取失败");
  }
});
</script>

<style scoped lang="less"></style>
