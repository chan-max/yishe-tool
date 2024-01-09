<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-08 21:58:06
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-01-09 21:40:44
 * @FilePath: /1s/src/components/layout/waterfall/index.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
-->
<template>
  <div class="container" ref="container" :style="{ columnGap: columnGap + 'px' }">
    <div
      v-for="colIndex in columns"
      :ref="'column' + colIndex"
      class="column"
      :style="{ rowGap: rowGap + 'px' }"
    >
      <template v-for="rowIndex in rowMax">
        <div v-if="getItemByColAndRow(colIndex,rowIndex)" class="column-item">
          <slot :item="getItemByColAndRow(colIndex,rowIndex)"></slot>
   
        </div>
      </template>
    </div>
  </div>
</template>

<script setup >
import { ref, computed } from "vue";
const props = defineProps({
  list: {
    default: [],
  },
  columns: {
    default: 2,
  },
  columnGap: {
    // px
    default: "4",
  },
  rowGap: {
    // px
    default: "4",
  },
});





function getItemByColAndRow(col,row){
    col = col -1 
    row = row -1
    return props.list[props.columns * row + col]
}

const rowMax = computed(() => {
  return Math.ceil(props.list.length / props.columns);
});
</script>

<style scoped>
.container {
  display: flex;
  justify-content: space-around;
}

.column {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.column-item{
    flex-shrink: 0;
}
</style>
