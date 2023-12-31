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
import { onBeforeMount,onMounted } from "vue";
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

// onMounted(() => {
//   const element = document.querySelector('.designiy');
//   element.addEventListener('mousewheel', function(event) {
//   // 滚动到右边的最大宽度
//   var maxX = this.scrollWidth - this.offsetWidth;

//   // 如果这个事件看起来要滚动到元素的边界之外，要阻止它
//   // 其中一个是滚动到最左边，一个是滚动到最右边
//   if (this.scrollLeft + event.deltaX < 0 || 
//     this.scrollLeft + event.deltaX > maxX) {
//     // 阻止事件
//     event.preventDefault();
//   }
// }, {passive:false});
// })



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
