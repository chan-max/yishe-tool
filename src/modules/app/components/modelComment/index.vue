<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-14 11:33:51
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-01-20 00:18:16
 * @FilePath: /1s/src/modules/app/components/modelComment/index.vue
 * @Description:
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
-->
<template>
  <ion-modal
    :is-open="isOpen"
    :initial-breakpoint="1"
    :breakpoints="[0, 1]"
    @ionModalDidDismiss="ionModalDidDismiss"
  >
  <comment></comment>
  </ion-modal>
</template>
<script setup>
import { reactive, ref, computed } from "vue";
import { modelInfo } from "./index";
import { addModelComment } from "@/api/api/comment";
import { useLoginStatusStore } from "@/store/stores/login";
import { usePaging } from "@/modules/app/helper/paging";
import { getModelComment } from "@/api/api/comment";
import { isOpen } from "./index.ts";
import comment from './comment.vue'

function ionModalDidDismiss(){
  isOpen.value = false
}
</script>

<style lang="less" scoped>
ion-modal {
  --height: auto;
}

</style>
