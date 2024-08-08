<template>
  <div class="designiy-decal-list">
    <div class="designiy-decal-list-title">
      已使用的贴纸
      <span style="background: #eee; padding: 2px 5px; border-radius: 3px">{{
        currentModelController.decalControllers.length
      }}</span>
    </div>
    <div class="designiy-decal-list-content">
      <template v-for="decal in stickers">
        <div class="designiy-decal-list-item">
          <el-image class="designiy-decal-list-item-image" :src="decal.src || decal.base64" fit="contain">
          </el-image>
          <div class="designiy-decal-list-item-content">
            <div class="designiy-decal-list-item-content-title">这是一张贴纸</div>
            <div class="designiy-decal-list-item-content-desc">
              树正不怕月影斜
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script setup>
import { currentOperatingBaseModelInfo, currentModelController } from "../../store";
import { computed } from "vue";

const stickers = computed(() => {
  return currentModelController.value.decalControllers.map((decal) => {
    return decal.info;
  });
});

</script>
<style lang="less">
.designiy-decal-list {
  width: 320px;
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
}

.designiy-decal-list-title {
  font-size: 12px;
  color: #333;
  padding: 20px 20px 10px 20px;
  border-bottom: 1px solid #eee;
}

.designiy-decal-list-content {
  width: 100%;
  height: 100%;
  overflow: auto;
  padding:20px 0;
}

.designiy-decal-list-item {
  width: 100%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  column-gap: 14px;
  padding: 10px 20px;
  &:hover {
    background: #f6f6f6;
  }
}

.designiy-decal-list-item-image {
  width: 80px;
  height: 80px;
  border-radius: 6px;
  flex-shrink: 0;
}

.designiy-decal-list-item-content {
  height: 80px;
  width:160px;
  display: flex;
  flex-direction:column;
  row-gap:6px;
  justify-content: center;
}

.designiy-decal-list-item-content-title {
  overflow: hidden; //超出的文本隐藏
  text-overflow: ellipsis; //溢出用省略号显示
  white-space: nowrap; //溢出不换行
  font-size:14px;
  font-weight:bold;
  color:#333;
}

.designiy-decal-list-item-content-desc {
  overflow: hidden; //超出的文本隐藏
  text-overflow: ellipsis; //溢出用省略号显示
  font-size:12px;
  color:#999;
}
</style>
