<template>
    <div v-if="currentHoveringDecalController" class="decal-tooltip" style="position:fixed;z-index:1;"
        :style="{ top: y + 12 + 'px', left: x + 12 + 'px' }">
        <s1-img :src="currentHoveringDecalController.state.src"
            style="width:100px;height:100px;border:1px solid #eee;border-radius:4px;"></s1-img>
    </div>
</template>

<script setup lang='ts'>
import { useMouse } from '@vueuse/core'
import { currentModelController, currentHoveringDecalController } from '../../store';
const { x, y, sourceType } = useMouse()


</script>

<style lang="less" scoped>
.decal-tooltip {
    display: flex;
    align-items: center;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    background-color: #fff;
    border-radius: 8px;
    padding: 12px;
    width: 240px;
}
</style>