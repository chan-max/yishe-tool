<template>
  <div class="container" v-if="currentOperatingDecalController">
    <s1-img :src="currentOperatingDecalController.state.url" style="width: 320px;height:320px;"></s1-img>
    <div style="padding:1rem;">
      <h6>旋转角度</h6>
      <el-slider :min="0" :max="100" :step="1" v-model="rotation" size="small" @input="onRotationInput" />
      <h6>贴纸尺寸</h6>
      <el-slider :min="0" :max="100" :step="1" v-model="size" size="small" @input="onSizeInput" />
      <h6>固定位置</h6>
    </div>
    <el-button @click="remove" type="primary" round>移除该贴纸</el-button>

    <div>
      <el-button v-if="currentOperatingDecalController.state.isLocalResource" @click="upload" type="info" round>该贴纸还未上传 ,
        点击上传 </el-button>
    </div>
  </div>
  <s1-empty v-else >
    <template #description>
      未选择贴纸
    </template>
  </s1-empty>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from "vue";
import { currentOperatingDecalController, showWorkspace, showDecalControl } from "../../store";
import { debounce } from "../../utils/utils";

const rotation = ref(0);

/*
  该尺寸会有一个最大值和最小值，并受宽高比影响
*/


const size = ref(0);

const onRotationInput = debounce((value) => {
  currentOperatingDecalController.value?.rotate((2 * Math.PI * value) / 100);
});

const onSizeInput = debounce((value) => {
  currentOperatingDecalController.value?.scale(value / 100);
});


function remove() {
  currentOperatingDecalController.value.remove();
}

function upload() {

}

</script>

<style scoped lang="less">
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  row-gap: 1rem;
}
</style>
