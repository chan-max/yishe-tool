<template>
  <div class="color-picker">
    <color-picker
      v-bind="attrs"
      :useType="type"
      v-model:pureColor="model.color"
      v-model:gradientColor="model.color"
      v-model:activeKey="model.type"
      :z-index="99"
    >
      <template #extra>
        <el-button
          plain
          class="w-full"
          size="small"
          style="margin-top: 12px"
          :icon="Picture"
          @click="open"
        >
          颜色库
        </el-button>
        <slot />
      </template>
    </color-picker>
    <modal></modal>
  </div>
</template>
<script setup>
import { ColorPicker } from "vue3-colorpicker";
import "vue3-colorpicker/style.css";
import { ref, watch } from "vue";
import { useAttrs } from "vue";
import { Picture } from "@element-plus/icons-vue";
import { showColorPickerModal } from "./index.tsx";
import modal from "./modal.vue";

const model = defineModel({
  default: {
    color: "#fff",
    type: "pure", // pure or gradient
  },
});

watch(
  model,
  () => {
    model;
  },
  {
    immediate: true,
  }
);

let attrs = useAttrs();

const props = defineProps({
  type: {
    default: "both",
  },
});

function open() {
  showColorPickerModal.value = true;
}
</script>
<style lang="less">
.color-picker {
  width: 22px;
  height: 22px;
  flex-shrink: 0;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  box-shadow: rgba(67, 71, 85, 0.27) 0px 0px 0.25em,
    rgba(90, 125, 188, 0.05) 0px 0.25em 1em;
}

.vc-color-wrap {
  margin-right: 0px !important;
  height: 100% !important;
  width: 100% !important;
}
</style>
