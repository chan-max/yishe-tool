<template>
  <div
    class="s1-empty flex items-center justify-center"
    :class="{ full: full }"
    :style="{ minHeight: minHeight, minWidth: minWidth }"
  >
    <el-empty :image="image" :image-size="82" v-bind="$attrs">
      <slot></slot>
      <template #description>
        <slot name="description"></slot>
      </template>
    </el-empty>
  </div>
</template>

<script setup lang="ts">
const image = "/components/empty.svg";

const props = defineProps({
  full: {
    default: true,
  },
  minHeight: {
    default: null,
  },
  minWidth: {
    default: null,
  },
});
</script>

<style lang="less">
.s1-empty {
  font-size: 10px;
  color: #ccc;
  .el-empty {
    --el-empty-padding: 12px 24px !important;
    --el-empty-bottom-margin-top: 8px;
  }

  .el-empty__description {
    --el-empty-description-margin-top: 6px !important;
  }

  .el-empty__description {
    color: #ccc;
  }
}

.s1-empty.full {
  width: 100%;
  height: 100%;
}
</style>
