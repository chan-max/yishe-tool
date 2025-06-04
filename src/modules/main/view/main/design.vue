<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2025-05-20 06:50:38
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2025-06-02 21:22:58
 * @FilePath: /1s/src/modules/main/view/main/design.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>

  <div class="design-view-container">
    <div class="design-view">
    <designiy></designiy>
  </div>
  </div>
</template>
<script setup>
import designiy from "@/components/design/index.vue";
</script>
<style lang="less">

.design-view-container{
  width: 100%;
  height: 100%;
  background-color: #bbb;
}

@padding: .5em;

.design-view {
  height: calc(100% - 2 * @padding);
  width: calc(100% - 2 * @padding);
  border-radius:.4em;
  overflow: hidden;
  background: #fff;
  box-shadow: rgba(17, 17, 26, 0.1) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 48px;
  border: 2px solid #fafafa;
  display: flex;
  margin: @padding;
  justify-content: center;
  align-items: center;
  user-select: none;
}
</style>
