<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2025-05-20 06:50:38
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2025-06-10 06:35:13
 * @FilePath: /1s/src/components/design/layout/font/index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <a-modal v-model:open="showFontModal" title="字体库" width="auto" class="font-a-modal" @ok="handleOk" :footer="null" :centered="true" >
    <page></page>
  </a-modal>
</template>
<script setup>
import { ref, onBeforeMount } from "vue";
import { getFontListApi } from "@/api";
import { showFontModal } from "../../store.ts";
import { usePaging } from "@/hooks/data/paging.ts";
import Utils from '@/common/utils'
import page from './page.vue'
 
function handleOk(){
  
}

</script>
<style lang="less">
.font-a-modal {
  overflow:hidden;
}
</style>
