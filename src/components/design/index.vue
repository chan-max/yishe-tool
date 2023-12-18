<template>
  <div class="designiy" :class="isDarkMode ? 'dark' : 'light'">
    <main-view></main-view>
  </div>
</template>
<script setup>
import mainView from "./layout/main.vue";
import { isDarkMode, isEdit, currentEditingModelInfo } from './store';
import { usePreventScreenResize } from './composition/preventScreenResize';
import {useRoute} from 'vue-router'
import { onBeforeMount } from "vue";
import { getModelById } from '@/api';

// 阻止缩放屏幕影响使用体验

const route = useRoute()


onBeforeMount(async () => {
  // 有 id 为编辑模式
  const id = route.query.id
  if(id){
    isEdit.value = true
    let model = await getModelById(id)
    currentEditingModelInfo.value = model
  }
})


usePreventScreenResize()

</script>
<style lang="less">
@import url(./theme.less);
@import url(./style.less);
.designiy {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  *{
    -webkit-user-drag: none;
  }
}
</style>
