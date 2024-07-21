<template>
  <div class="color-picker">
    <color-picker v-bind="attrs" :useType="type" v-model:pureColor="model.color" v-model:gradientColor="model.color"
      v-model:activeKey="model.type">
      <template #extra>
        <slot />
      </template>
    </color-picker>
  </div>
</template>
<script setup>
import { ColorPicker } from "vue3-colorpicker";
import "vue3-colorpicker/style.css";
import { ref,watch } from 'vue'
import { useAttrs } from "vue";

const model = defineModel({
  default: {
    color: "#fff",
    type: 'pure'
  }
})

watch(model,() => {
  model

},{
  immediate:true
})

let attrs = useAttrs();

const props = defineProps({
  type: {
    default:'both'
  }
})

</script>
<style lang="less">
.color-picker {
  width: 22px;
  height: 22px;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  box-shadow: rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em;
}

.vc-color-wrap {
  margin-right: 0px !important;
  height: 100% !important;
  width: 100% !important;
}
</style>
