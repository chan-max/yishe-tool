<template>
  <div class="designiy-decal-list">
    <div class="designiy-decal-list-title">
    已使用的贴纸 
        <span style="background:#eee;padding:2px 5px;border-radius:3px;">    {{currentController.decalControllers.length}}</span>
    </div>
    <div class="designiy-decal-list-content">
        <template v-for="decal in stickers">
      <div class="designiy-decal-list-item">
        <el-image class="designiy-decal-list-item-image" :src="decal.fullpath" fit="cover">
        </el-image>
        <div class="designiy-decal-list-item-desc">lll</div>
      </div>
    </template>
    </div>
  </div>
</template>
<script setup>
import { currentOperatingModelInfo, currentController } from "../../store";
import { computed } from "vue";

const stickers = computed(() => {
  return currentController.value.decalControllers.map((decal) => {
    return decal.info;
  });
});
</script>
<style lang="less">
.designiy-decal-list {
  width: 300px;
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
}

.designiy-decal-list-title{
    font-size:12px;
    color:#333;
    padding:20px 20px 10px 20px;
    border-bottom: 1px solid #eee;
}

.designiy-decal-list-content{
    width: 100%;
    height: 100%;
    overflow   :auto;
}

.designiy-decal-list-item {
  width: 100%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  column-gap: 20px;
  padding: 20px;
  &:hover {
    background: #f6f6f6;
  }
}

.designiy-decal-list-item-image {
  width: 80px;
  height: 80px;
  border-radius: 10px;
}

.designiy-decal-list-item-desc {
  height: 80px;
}
</style>
