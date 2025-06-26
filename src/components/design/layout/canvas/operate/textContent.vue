<template>
  <operate-form-item style="align-items: start;">
    <template #icon>
      <icon />
    </template>
    <template #name> {{ label }} </template>
    <template #content>
      <div class="w-full flex gap-2">
        <el-input :placeholder="placeholder" :autosize="{minRows:2,maxRows:10}" type="textarea" v-model="model" size="small"></el-input>
        <el-button type="primary" size="small" @click="showSentenceSelector = true">
          句库
        </el-button>
      </div>
    </template>
  </operate-form-item>

  <!-- 句子选择器 -->
  <sentence-selector
    v-model:visible="showSentenceSelector"
    @select="handleSentenceSelect"
  />
</template>

<script setup lang="ts">
import icon from "@/components/design/assets/icon/text-content.svg?component";
import { ref } from 'vue'
import SentenceSelector from './sentenceSelector.vue'

const model = defineModel({ default: '' })

const props = defineProps({
  label: {
    default: '文字内容',
  },
  placeholder: {
    default: '请输入'
  }
})

// 句子选择器状态
const showSentenceSelector = ref(false)

// 处理句子选择
function handleSentenceSelect(sentence: any) {
  model.value = sentence.content
}
</script>

<style></style>
