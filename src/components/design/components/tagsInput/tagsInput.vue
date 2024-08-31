<template>
  <div class="tags-input">
    <el-popover :disabled="!autocompleteTags" :width="autocompleteWidth + 'px'" ref="popperRef" trigger="click"
      :placement="autocompletePlacement" :hide-after="0">
      <template #reference>
        <vue3-tags-input :tags="tags" :validate="customValidate" placeholder="自定义标签，2～10个文字"
          @on-tags-changed="handleInput" />
      </template>
      <div class="tags-input-tags">
        <a-tag :bordered="false" v-for="(tag, index) in autocompleteTags" @click="handleSelect(tag)">
          {{ tag.name }}
        </a-tag>
      </div>
    </el-popover>
  </div>
</template>

<script setup>
import { defineComponent, ref } from "vue";
import Vue3TagsInput from "vue3-tags-input";

const props = defineProps({
  autocompleteTags: {
    default: null,
  },
  autocompleteWidth: {
    default: 560
  },
  autocompletePlacement: {
    default: 'bottom'
  },
});

function mergeArrays(arr1, arr2) {
  return [...Object.assign([], arr1, arr2)];
}


// 所有的 tags
const tags = ref([]);

const popperRef = ref();


const handleSelect = (tag) => {

  if (!tags.value.includes(tag.name)) {
    tags.value.push(tag.name)
  }

  emitModel()
};


const emits = defineEmits(["update:modelValue"]);

function handleInput(val) {
  tags.value = val
  emitModel()
}

function emitModel() {
  popperRef.value.popperRef?.popperInstanceRef?.update();
  emits("update:modelValue", tags.value);
}

// 限制长度
function customValidate(value) {
  const legal = value.length >= 2 && value.length <= 10;
  return legal;
}


</script>

<style lang="less">
.v3ti {
  min-height: 0 !important;
  background-color: #fff !important;
  border: 1px solid #dcdfe6 !important;
}

.v3ti {
  input::placeholder {
    color: #a8abb2;
  }
}

.v3ti-new-tag {
  font-size: 1rem;
  height: 24px !important;
  min-width: 160px !important;
}

.v3ti-tag {
  font-size: 1rem;
  background: var(--el-color-primary) !important;
  height: 20px !important;
}

.v3ti--focus {
  border: 1px solid var(--el-color-primary) !important;
  box-shadow: none !important;
}


.tags-input {
  font-size: 1rem;
  width: 100%;
}

.tags-input-tags {
  .ant-tag:not(.ant-tag-checkable-checked) {
    cursor: pointer;
    background: rgba(0, 0, 0, 0.04) !important;
    color: rgba(0, 0, 0, 0.88);
  }
}


.tags-input-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  gap: 1rem;
}
</style>
