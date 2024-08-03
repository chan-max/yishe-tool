<template>
    <operateItemPosition v-model="model.position"></operateItemPosition>
    <operateItemZindex v-model="model.zIndex"></operateItemZindex>
    <operateItemScale v-model:x="model.transform.scaleX" v-model:y="model.transform.scaleY"
        v-model:z="model.transform.scaleZ">
    </operateItemScale>
    <operateItemRotate v-model:x="model.transform.rotateX" v-model:y="model.transform.rotateY"
            v-model:z="model.transform.rotateZ">
        </operateItemRotate>
    <operateItemSkew v-model:x="model.transform.skewX" v-model:y="model.transform.skewY">
    </operateItemSkew>
</template>
    
<script setup lang='ts'>
import operateItemPosition from "@/components/design/layout/canvas/operate/position/position.vue";
import operateItemZindex from "@/components/design/layout/canvas/operate/zIndex.vue";
import operateItemScale from "@/components/design/layout/canvas/operate/scale.vue";
import operateItemRotate from "@/components/design/layout/canvas/operate/rotate.vue";
import operateItemSkew from "@/components/design/layout/canvas/operate/skew.vue";

const model = defineModel({
    default: {} as any
})

</script>
    
<style></style>