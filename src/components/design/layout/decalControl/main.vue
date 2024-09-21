<template>
  <div class="container" v-if="currentOperatingDecalController">
    <s1-img :src="currentOperatingDecalController.state.src" style="width: 320px;height:320px;"
      class="png-background"></s1-img>

    <div style="padding:1rem;">
      <h6>旋转角度</h6>
      <el-slider :min="0" :max="360" :step="1" v-model="currentOperatingDecalController.state.modelValueRotate"
        size="small"/>
      <h6>贴纸尺寸</h6>
      <el-slider :min="0" :max="100" :step="1" v-model="currentOperatingDecalController.state.modelValueSize" size="small"
     />
      <h6>固定位置</h6>
    </div>
    <el-button @click="remove" type="danger" plain round>移除该贴纸</el-button>

    <div> </div>
    <el-button v-if="currentOperatingDecalController.state.isLocalResource" @click="upload" type="primary" plain
      round>该贴纸还未上传 ,
      点击上传 </el-button>

    <div style="flex:1"> </div>

    <el-button @click="showDecalList = true" type="primary" round>
      显示贴纸列表 </el-button>
  </div>


  <s1-empty v-else>
    <template #description>
      未选择贴纸
    </template>
  </s1-empty>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from "vue";
import { currentOperatingDecalController, showWorkspace, showDecalControl, showDecalList } from "../../store";

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
