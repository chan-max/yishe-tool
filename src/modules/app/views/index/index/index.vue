<template>
  <div>
    <div class="search">
      <van-search
        shape="round"
        background="transparent"
        placeholder="请输入搜索关键词"
      >
        <template #label> 筛选 </template>
        <template #action> action </template>
        <template #right-icon>
          <van-button
            class="search-button"
            round
            icon="search"
            color=" linear-gradient(to right, #FF4B2B, #FF416C)"
          >
            搜索
          </van-button>
        </template>
      </van-search>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="less">
@search-button-padding: 2px;

:root:root {
  --van-search-input-height: 36px;
}

.search {
  overflow: hidden;
  .search-button {
    height: 32px;
    margin: @search-button-padding;
  }

  .van-field__right-icon {
    padding: 0;
  }
}
</style>
