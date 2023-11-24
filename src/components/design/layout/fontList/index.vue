<template>
  <div class="designiy-font-list">
    <div class="designiy-font-list-content">
      <div class="designiy-font-list-item" v-for="item in data" >
        <el-image draggable="false" :src="item.fullimgpath" class="w-full h-full" style="padding:20px;" fit="contain">
        </el-image>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onBeforeMount } from "vue";
import { getFonts } from "@/api";
const data = ref();

onBeforeMount(async () => {
  data.value = await getFonts();
});

</script>
<style lang="less">
.designiy-font-list {
  width: 300px;
  overflow:auto;
  height:100%;
}

.designiy-font-list-content{
  width:100%;
  height:100%;
  overflow: auto;
  display:flex;
  flex-direction: column;
  align-items: center;
  row-gap:10px;
  padding:10px;
}

.designiy-font-list-item{
  width:100%;
  height:140px;
  background-color:#f6f6f6;
  border-radius:12px;
  flex-shrink:0;
}
</style>
