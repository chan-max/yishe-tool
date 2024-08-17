<template>
    <operateItemFilterBlur v-model="model.filterBlur">
    </operateItemFilterBlur>

    <operateItemFilterBrightness v-model="model.filterBrightness">
    </operateItemFilterBrightness>


    <operateItemFilterContrast v-model="model.filterContrast">
    </operateItemFilterContrast>


    <operateItemFilterGrayscale v-model="model.filterGrayscale">
    </operateItemFilterGrayscale>


    <operateItemFilterInvert v-model="model.filterInvert">
    </operateItemFilterInvert>


    <operateItemFilterOpacity v-model="model.filterOpacity">
    </operateItemFilterOpacity>


    <operateItemFilterSaturate v-model="model.filterSaturate">
    </operateItemFilterSaturate>


    <operateItemFilterSepia v-model="model.filterSepia">
    </operateItemFilterSepia>


    <operateItemFilterHueRotate v-model="model.filterHueRotate">
    </operateItemFilterHueRotate>


    <operateItemFilterUrl v-model="model.filterUrl">
    </operateItemFilterUrl>
</template>
    
<script setup lang='ts'>
import operateItemFilterBlur from "@/components/design/layout/canvas/operate/filter/blur.vue";
import operateItemFilterBrightness from "@/components/design/layout/canvas/operate/filter/brightness.vue";
import operateItemFilterContrast from "@/components/design/layout/canvas/operate/filter/contrast.vue";
import operateItemFilterGrayscale from "@/components/design/layout/canvas/operate/filter/grayscale.vue";
import operateItemFilterInvert from "@/components/design/layout/canvas/operate/filter/invert.vue";
import operateItemFilterOpacity from "@/components/design/layout/canvas/operate/filter/opacity.vue";
import operateItemFilterSaturate from "@/components/design/layout/canvas/operate/filter/saturate.vue";
import operateItemFilterSepia from "@/components/design/layout/canvas/operate/filter/sepia.vue";
import operateItemFilterHueRotate from "@/components/design/layout/canvas/operate/filter/hueRotate.vue";
import operateItemFilterUrl from "@/components/design/layout/canvas/operate/filter/url/index.vue";

const model = defineModel({
    default: {} as any
})

</script>
    
<style></style>