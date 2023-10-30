<template>
    <div class="designiy-decal-control">
        
    </div>
</template>
<script setup>
import { onMounted, ref,computed,watch } from "vue";

import { operatingDecal } from '../../store.ts'

watch(operatingDecal,( ) => {
      window.decal = operatingDecal
})

</script>
<style lang="less">
.designiy-decal-control{
    width:240px;
    display:flex;
    justify-content:center;
    align-items:center;
}
</style>
  