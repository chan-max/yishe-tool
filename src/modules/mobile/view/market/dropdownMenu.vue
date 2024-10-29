<template>
  <div class="mobile-market-dropdown">
    <van-dropdown-menu ref="menuRef">
      <van-dropdown-item>
        <template #title>
          <div>综合排序 <van-icon name="arrow-down" size="10" /></div
        ></template>
        <template #default> 分类 </template>
      </van-dropdown-item>
      <van-dropdown-item>
        <template #title> 价格排序 <van-icon name="arrow-down" size="10" /></template>
        <template #default> 分类 </template>
      </van-dropdown-item>
      <van-dropdown-item>
        <template #title> 发布时间 <van-icon name="arrow-down" size="10" /></template>
        <template #default> 分类 </template>
      </van-dropdown-item>
      <van-dropdown-item>
        <template #title>风格<van-icon name="arrow-down" size="10" /></template>
        <template #default> 分类 </template>
      </van-dropdown-item>
      <van-dropdown-item>
        <template #title> 品牌 <van-icon name="arrow-down" size="10" /></template>
        <template #default> 分类 </template>
      </van-dropdown-item>
      <van-dropdown-item>
        <template #title> 颜色 <van-icon name="arrow-down" size="10" /></template>
        <template #default> 分类 </template>
      </van-dropdown-item>
      <van-dropdown-item>
        <template #title> 适用人群 <van-icon name="arrow-down" size="10" /></template>
        <template #default> 分类 </template>
      </van-dropdown-item>
      <van-dropdown-item>
        <template #title> 服装种类 <van-icon name="arrow-down" size="10" /></template>
        <template #default> 分类 </template>
      </van-dropdown-item>
      <van-dropdown-item>
        <template #title> <van-icon name="arrow-down" size="10" /></template>
        <template #default> 分类 </template>
      </van-dropdown-item>
      <van-dropdown-item>
        <template #title>分类<van-icon name="arrow-down" size="10" /></template>
        <template #default> 分类 </template>
      </van-dropdown-item>
      <van-dropdown-item>
        <template #title>分类<van-icon name="arrow-down" size="10" /></template>
        <template #default> 分类 </template>
      </van-dropdown-item>
      <van-dropdown-item>
        <template #title>分类<van-icon name="arrow-down" size="10" /></template>
        <template #default> 分类 </template>
      </van-dropdown-item>
    </van-dropdown-menu>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const menuRef = ref(null);
const itemRef = ref(null);
const value = ref(0);
const switch1 = ref(false);
const switch2 = ref(false);
const options = [
  { text: "全部商品", value: 0 },
  { text: "新款商品", value: 1 },
  { text: "活动商品", value: 2 },
];
const onConfirm = () => {
  itemRef.value.toggle();
  // 或者
  // menuRef.value.close();
};
</script>

<style lang="less">
.mobile-market-dropdown {
  flex-shrink: 0;
  --van-dropdown-menu-height: auto;

  .van-dropdown-menu__item {
    flex: auto;
  }

  .van-dropdown-menu__bar {
    box-shadow: none;
    column-gap: 12px;
  }

  .van-dropdown-menu__title {
    background: #f3f3f6;
    color: rgba(0, 0, 0, 0.9);

    font-size: 11px;
    line-height: 11px;
    border-radius: 999px;
    padding: 6px 8px;
  }

  .van-dropdown-menu__title:after {
    display: none;
  }
}
</style>
