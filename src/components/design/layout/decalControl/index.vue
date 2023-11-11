<template>
  <div class="designiy-decal-control">
    <decal-empty v-if="!operatingDecal"/>
    <decal-main v-else/>
  </div>
</template>
<script setup>
import { onMounted, ref, computed, watch } from "vue";
import { operatingDecal } from "../../store.ts";
import { debounce } from "../../utils/utils.ts";
import decalEmpty from "./empty.vue";
import decalMain from './main.vue';


</script>
<style lang="less">
.designiy-decal-control {
  width: 300px;
  display: flex;
  flex-direction: column;
  height:100%;
}
</style>
