<template>
  <div class="designiy-dialog">
    <slot></slot>
  </div>
</template>
<script setup></script>
<style>
.designiy-dialog {
  z-index: 9;
  /* 默认宽高 */
  width: 600px;
  height: 400px;
  background: #353535;
}
</style>
