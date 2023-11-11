<template>
  <div class="designiy-text-sticker">
    <div class="designiy-text-sticker-tab">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick" :stretch="true">
        <el-tab-pane label="自定义文字">
          <custom/>
        </el-tab-pane>
        <el-tab-pane label="网络文字">Config</el-tab-pane>
      </el-tabs>
    </div>
    <!-- <custom/> -->
  </div>
</template>

<script setup lang="ts">
import custom from "./custom.vue";
import resource from "./resource.vue";
import { ref } from "vue";

const showCustom = ref(true);
</script>

<style lang="less">
.designiy-text-sticker {
  display: flex;
  flex-direction: column;
  width: auto;
  width: 280px;
  height: 100%;
  padding: 10px;
}

.designiy-text-sticker-tab {
  .el-tabs__header{
    border: none !important;
    --el-tabs-header-height:24px;
  }
  .el-tabs__nav{
    background:#fafafa;
    padding:5px;
  }
  .el-tabs__header * {
    border: none !important;
  }
  .el-tabs__item{
    font-size: 10px;
    border-radius:5px;
    color:#666;
  }
  .el-tabs__item.is-active{
    background:#eee;
  }
}
</style>
