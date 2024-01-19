<template>
  <div class="menu-right">
    <div class="menu-item">
      <heart-outlined class="icon"></heart-outlined>
      <div class="text">69</div>
    </div>
    <div class="menu-item" @click="$emit('openComment')">
      <comment-outlined class="icon"></comment-outlined>
      <div class="text">69</div>
    </div>
    <div class="menu-item">
      <star-outlined class="icon"></star-outlined>
      <div class="text">69</div>
    </div>
    <div class="menu-item">
      <share-outlined class="icon"></share-outlined>
      <div class="text">69</div>
    </div>
    <div class="menu-item">
      <shopping-cart-outlined class="icon"></shopping-cart-outlined>
      <div class="text">69</div>
    </div>
  </div>
</template>
<script setup>
import heartOutlined from "@/icon/mobile/heartOutlined.svg?vueComponent";
import commentOutlined from "@/icon/mobile/commentOutlined.svg?vueComponent";
import starOutlined from "@/icon/mobile/starOutlined.svg?vueComponent";
import shareOutlined from "@/icon/mobile/shareOutlined.svg?vueComponent";
import shoppingCartOutlined from "@/icon/mobile/shoppingCartOutlined.svg?vueComponent";
</script>
<style lang="less" scoped>
.menu-right {
  width: 60px;
  position: absolute;
  right: 0;
  bottom: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 20px;
  justify-content: end;
  padding: 20px 0;
  z-index: 2;

}


.menu-item{
  color: #fff;
}
.icon {
  width: 30px;
  height: 30px;
  transition: all .2s;
  &:active{
    transform: scale(.8);
  }
}

.text {
  font-size: 12px;
}
</style>
