<template>
  <div class="operate-form-item">
    <div class="operate-form-item-icon">
      <slot name="icon"></slot>
    </div>
    <div class="operate-form-item-title">
      <slot name="name"></slot>
    </div>
    <div style="flex: 1"></div>
    <div class="operate-form-item-content">
      <slot name="content"> </slot>
    </div>
  </div>
</template>
<script setup>
const props = defineProps(["name"]);
</script>
<style lang="less">
.operate-form-item {
  display: flex;
  align-items: center;
  padding: 10px 15px;
}

.operate-form-item-icon {
  width: 14px;
  height: 14px;
  color:#555;
  svg {
    width: 14px;
    height: 14px;
  }
}

.operate-form-item-title{
    padding:0 10px;
    font-size:12px;
}


</style>
