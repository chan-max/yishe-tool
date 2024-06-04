<template>
  <el-tag
    v-for="(item, index) in tags"
    :key="index"
    :type="item"
    effect="light"
    size="small"
    closable="true"
    round
  >
    {{ item }}
  </el-tag>

  <el-popover
    title="添加标签"
    :width="200"
    trigger="click"
  >
    <template #reference>
        <el-tag @click="add" effect="light" size="small" round></el-tag>
    </template>
    <div>
      tags
    </div>
  </el-popover>
</template>

<script setup lang="ts">
import { defineEmits,ref } from 'vue';

const emit = defineEmits(['update:modelValue'])

const tags = ref()

function add(){

}

</script>

<style></style>
