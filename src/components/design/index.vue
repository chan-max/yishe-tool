<!--
 * @Author: chan-max 2651308363@qq.com
 * @Date: 2024-02-11 09:10:15
 * @LastEditors: chan-max 2651308363@qq.com
 * @LastEditTime: 2024-02-21 20:20:55
 * @FilePath: /yishe/src/components/design/index.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
-->
<template>
  <div class="designiy" :class="isDarkMode ? 'dark' : 'light'">
    <main-view></main-view>
  </div> 
</template>
<script setup>
import mainView from "./layout/main.vue";
import { isDarkMode, isEdit, currentEditingModelInfo } from "./store";
import { usePreventScreenResize } from "./composition/preventScreenResize";
import { useRoute } from "vue-router";
import { onBeforeMount, onMounted } from "vue";
import { getModelById } from "@/api";

// 阻止缩放屏幕影响使用体验

const route = useRoute();


onBeforeMount(async () => {
  // 有 id 为编辑模式
  const id = route.query.id;
  if (id) {
    isEdit.value = true;
    let model = await getModelById(id);
    currentEditingModelInfo.value = model;
  }
});

usePreventScreenResize();
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

  * {
    -webkit-user-drag: none;
  }
}

.designiy {
    font-size: 14px; /* 默认 size */
}

@media only screen and (max-width: 1960px) {
    .designiy {
        font-size: 14px; /* 若 div 宽度在 800px 以下，调整字体大小 */
    }
}

@media only screen and (max-width: 1280px) {
    .designiy {
        font-size: 13px; /* 若 div 宽度在 600px 以下，调整字体大小 */
    }
}

@media only screen and (max-width: 780px) {
    .designiy {
        font-size: 12px; /* 若 div 宽度在 800px 以下，调整字体大小 */
    }
}

</style>
