<template>
  <div class="tags-input">
    <vue3-tags-input :tags="tags" :validate="customValidate" placeholder="自定义标签，2～10个文字" @on-tags-changed="handleChangeTag"/>
  </div>
</template>

<script setup>
import { defineComponent, ref } from "vue";
import Vue3TagsInput from "vue3-tags-input";

const tags = ref([]);

const emits = defineEmits(['update:modelValue'])

function handleChangeTag(tags){
    emits('update:modelValue',tags)
}

function customValidate(value) {
  const legal = value.length >= 2 && value.length <= 10;
  return legal;
}
</script>

<style scoped lang="less">
.tags-input {
  font-size: 1em;
  width: 100%;
}
</style>
<style>
.v3ti {
  min-height: 0!important;
  background-color: transparent !important;
  border: 1px solid #eee!important;
}
.v3ti-new-tag {
  font-size: 1rem;
  height: 20px !important;
  min-width:160px!important;
}
.v3ti-tag {
  font-size: 1rem;
  background: var(--el-color-primary) !important;
  height: 20px!important;
}
.v3ti--focus {
  border:1px solid var(--el-color-primary) !important;
  box-shadow: none;
}
</style>
