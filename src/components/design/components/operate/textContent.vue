<template>
  <operate-form-item style="align-items: start;">
    <template #icon>
        <icon></icon>
    </template>
    <template #name> 文字内容 </template>
    <template #content>
      <el-input
        placeholder="请输入文字内容"
        type="textarea"
        v-model="model"
        size="small"
      ></el-input>
    </template>
  </operate-form-item>
</template>

<script setup lang="ts">
import icon from "@/components/design/assets/icon/text-content.svg?component";
import {ref} from 'vue'

const model = defineModel({ default: '' })


</script>

<style>

</style>
