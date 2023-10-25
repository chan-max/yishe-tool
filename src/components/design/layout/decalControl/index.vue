<template>
    <div class="designiy-decal-control">
        贴画控制
    </div>
  </template>
<script setup>
import { onMounted, ref,computed,watch } from "vue";

import { operatingDecal } from '../../store.ts'

watch(operatingDecal,( ) => {

})

</script>
<style lang="less">
.designiy-decal-control{
    width:240px;
}
</style>
  