<template>
  <a-modal
    v-bind="$attrs"
    width="980px"
    title="颜色库"
    style="min-width: 980px"
    :footer="null"
    centered
    :destroyOnClose="true"
  >
    <div class="toolbar" style="padding: 12px">
      <div style="flex: 1"></div>
      <el-input v-model="search" style="width: 360px" placeholder="查询"></el-input>
    </div>
    <div style="height: 480px; overflow: auto; padding: 12px">
      <el-row :gutter="8">
        <template v-for="item in builtInColors">
          <el-col :span="6" style="margin: 4px 0">
            <div
              ref="buttonRef"
              @click="select(item)"
              v-click-outside="onClickOutside"
              class="color-item flex items-center justify-center"
              :style="{ background: item.color }"
            >
              {{ item.name }}
            </div>
          </el-col>
        </template>
      </el-row>
    </div>
  </a-modal>

  <el-popover
    ref="popoverRef"
    :virtual-ref="buttonRef"
    trigger="hover"
    title="描述"
    virtual-triggering
  >
    <span> Some content </span>
  </el-popover>
</template>

<script setup lang="ts">
import { builtInColors } from "./index.tsx";
import { ref, unref } from "vue";
import { ClickOutside as vClickOutside } from "element-plus";

let search = ref("");

const emits = defineEmits(["select"]);

function select(item) {
  emits("select", item);
}

const buttonRef = ref();
const popoverRef = ref();
const onClickOutside = () => {
  unref(popoverRef).popperRef?.delayHide?.();
};
</script>

<style scoped lang="less">
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.color-item {
  width: 100%;
  height: 64px;
  color: #fff;
  font-weight: bold;
  font-size: 12px;
  border-radius: 8px;
  cursor: pointer;
  &:hover {
    box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
      rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
  }
}
</style>
