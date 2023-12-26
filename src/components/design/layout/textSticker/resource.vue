<template>
  <div
    class="designiy-text-sticker-items"
    v-infinite-scroll="scroll"
    :infinite-scroll-distance="150"
    :infinite-scroll-disabled="disabled"
  >
    <div class="designiy-text-sticker-item" v-for="item in data">
      <el-image
        @load="load($event, item)"
        :src="item.preview_img"
        style="width: 100%; height: 100%; padding: 10px"
        fit="contain"
        lazy
      >
        <template #placeholder> </template>
        <template #error> </template>
      </el-image>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import { currentController, showDecalControl } from "../../store";
import { initDraggableElement } from "../../utils/draggable";
import { getTextSticker } from "@/api";

const disabled = ref(false);

const data: any = ref([]);

// 当前页
const currentPage = ref(1)

function load(e, info) {
  var el = e.target;
  initDraggableElement(el, () => {
    currentController.value.stickToMousePosition({
      type: "text",
      src: info.preview_img,
      ...info,
    });
    showDecalControl.value = true;
  });
}

async function scroll() {
  const res: any = await getTextSticker({ 
    page:currentPage.value++
   });

  if (!res.list || !res.list.length) {
    disabled.value = true;
    return false;
  }
  data.value = data.value.concat(res.list);
}

</script>
<style>
.designiy-text-sticker-items {
  width: 100%;
  height: 100%;
}

.designiy-text-sticker-item {
  height: 120px;
  width:100%;
  flex-shrink: 0;
  margin-bottom: 6px;
  background-color: #fafafa;
  border-radius: 10px;
}
</style>
