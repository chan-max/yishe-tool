<template>
  <div class="fold">
    <div @click="isCollapsed = !isCollapsed" class="fold-header">
      <div class="fold-header-title">
        <div class="fold-header-title-main">
            <slot name="header"></slot>
        </div>
      </div>
    </div>
    <div v-if="isCollapsed" class="fold-main">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref,defineProps} from 'vue'

const props = defineProps(['imgs'])

const isCollapsed = ref(true)

</script>

<style lang="less">
.fold {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.fold-header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  padding:5px 0;
}

.fold-header-title {
  font-size: 12px;
  color: #444;
  display:flex;
}


.fold-main{
    width:100%;
    column:3;
}
</style>
