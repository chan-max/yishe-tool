<template>
  <div class="menu flex justify-center">
    <Transition v-bind="animation">
      <div class="menu-mask" :class="{ show: showMask }" v-if="showMask">
        <div class="menu-mask-content" @mouseenter="menuEnter" @mouseleave="menuLeave">
          <template v-if="currentKey == 'group'"> 分类 </template>
          <template v-if="currentKey == 'start'">
            <menu-start></menu-start>
          </template>
        </div>
      </div>
    </Transition>
    <template v-for="item in menuOptions">
      <router-link
        v-slot="{ navigate, isActive, isExactActive }"
        :to="{ name: item.RouteName }"
        custom
      >
        <div
          class="menu-item-container"
          @mouseenter="itemEnter(item.key)"
          @mouseleave="itemLeave"
        >
          <div
            class="menu-item"
            :class="{
              'menu-item-route-active': item.RouteName && isActive,
              'menu-active': item.key && currentKey == item.key,
            }"
            @click="navigate"
          >
            {{ item.label }}
          </div>
        </div>
      </router-link>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue";
import menuStart from "./start.vue";
const showMask = ref(false);

const currentKey = ref();

function menuEnter() {}

function menuLeave() {
  showMask.value = false;
  currentKey.value = null;
}

function itemLeave() {}

function itemEnter(key) {
  currentKey.value = key;
  showMask.value = true;
}

const animation = ref({
  duration: {
    enter: 200,
    leave: 0,
  },
});

const menuOptions = ref([
  {
    label: "首页",
    RouteName: "Home",
    key: "home",
  },
  {
    label: "商场",
    RouteName: "Market",
    key: "market",
  },
  {
    label: "商家",
    RouteName: "Seller",
    key: "seller",
  },
  {
    label: "工作台",
    RouteName: "Workspace",
    key: "workspace",
  },
  {
    label: "商品模型分类",
    key: "group",
  },
  {
    label: "快速开始",
    key: "start",
  },
]);
</script>

<style lang="less" scoped>
.menu {
  font-weight: bold;
  align-items: center;
  position: relative;
  display: flex;
  align-items: center;
  column-gap: 2em;
  height: 100%;
}

.menu-mask {
  overflow: hidden;
  position: fixed;
  left: 0;
  height: 100vh;
  width: 100vw;
  top: calc(var(--1s-header-menu-height) - 4px);
  transition: all 0.2s;
  background-color: rgba(232, 232, 232, 0.4);
  backdrop-filter: blur(16px);
  opacity: 1;
}

/* 下面我们会解释这些 class 是做什么的 */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.menu-mask-content {
  width: 100vw;
  padding: 4vh 6vw;
  box-sizing: border-box;
  background-color: #fff;
  box-shadow: rgba(17, 17, 26, 0.1) 0px 0px 16px;
  border-bottom-left-radius: 4%;
  border-bottom-right-radius: 4%;
  display: flex;
}

.menu-item-container {
  height: 100%;
  display: flex;
  align-items: center;
}
.menu-item {
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  column-gap: 5px;
  text-wrap: nowrap;
  cursor: pointer;
  color: #666;
  font-weight: 400;
  border-bottom: 2px solid transparent;
  border-bottom: 1px solid transparent;
  transition: all 0.2s;
}

.menu-active {
  color: #000;
  border-bottom: 1px solid #333;
}

.menu-item-route-active {
  color: #000;
  border-bottom: 1px solid #333;
}
</style>
