<template>
    <div class="designiy-decal-control">
        操作当前贴纸
    </div>
</template>
<script setup>
import { onMounted, ref,computed,watch } from "vue";
import { operatingDecal } from '../../store.ts';

watch(operatingDecal,( ) => {
      window.decal = operatingDecal
})

</script>
<style lang="less">
.designiy-decal-control{
    width:300px;
    padding: 10px;
    display:flex;
    align-items:center;
}
</style>
  