<template>
  <div id="designiy" >
    <main-view></main-view>
  </div>
</template>

<script setup>
import mainView from "./layout/main.vue";
import { useDraggable } from "@vueuse/core";
import { ref } from "vue";



</script>

<style lang="less">
#designiy {
  width: 100%;
  height: 100%;
}
</style>
