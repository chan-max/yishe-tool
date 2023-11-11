<template>
  <div class="designiy-decal-control-content">
    <div class="designiy-decal-control-title"> 旋转角度 </div>
    <el-slider
      :min="0"
      :max="100"
      :step="1"
      v-model="rotation"
      size="small"
      @input="onRotationInput"
    />
    <div class="designiy-decal-control-title"> 贴纸尺寸 </div>
    <el-slider
      :min="0"
      :max="100"
      :step="1"
      v-model="size"
      size="small"
      @input="onSizeInput"
    />
    <div class="designiy-decal-control-title"> 固定位置 </div>

    <el-button @click="remove" size="small">移除该贴纸</el-button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from "vue";
import { operatingDecal } from "../../store.ts";
import { debounce } from "../../utils/utils.ts";

const rotation = ref(0);
const size = ref(0)


const onRotationInput = debounce((value) => {
  operatingDecal.value?.rotate((2 * Math.PI * value) / 100);
});

const onSizeInput = debounce((value) => {
  operatingDecal.value?.scale(value / 100);
});

watch(operatingDecal, () => {});

function remove() {
  operatingDecal.value.destroy()
}

</script>

<style>
.designiy-decal-control-content{
    width:100%;
    height :100%;
    display:flex;
    flex-direction:column;
    padding: 20px;
    row-gap:10px;

    .el-slider{
      
    }
}

.designiy-decal-control-title{
  font-size: 12px;
  font-weight: bold;
  color:#555;
}
</style>
