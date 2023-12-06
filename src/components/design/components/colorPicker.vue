<template >
    <div class="color-picker">
        <color-picker  v-bind="attrs"/>
    </div>
</template>
<script setup>
import { ColorPicker } from "vue3-colorpicker";
import "vue3-colorpicker/style.css";

import { useAttrs } from 'vue';
 
let attrs = useAttrs()

</script>
<style lang="less">
    .vc-color-wrap{
        margin-right: 0px!important;
        height: 24px!important;
        width: 24px!important;
    }
</style>