<template>
  <div class="designiy-image-upload">
    <el-upload
      class="designiy-image-upload-main"
      :auto-upload="false"
      :show-file-list="false"
      v-model:file-list="files"
      :limit="1"
      :on-exceed="handleExceed"
      ref="upload"
    >
      <img v-if="files[0]" :src="previewUrl"/>
      <template v-else>
        <icon-upload style="width:50px;height:50px;"></icon-upload>
        <div> 点击或拖拽文件上传 </div>
      </template>
    </el-upload>

    <div class="designiy-image-upload-form">
        <el-input></el-input>
      <el-button type="primary"> 上传该图片 </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import iconUpload from "@/icon/upload.svg?vueComponent";
import { ref, reactive, watch, computed , shallowRef} from 'vue';
import { Plus } from "@element-plus/icons-vue";
import  { genFileId } from "element-plus";

const files = ref([])
const upload = ref()

const previewUrl = computed(() => {
    let file = files.value[0]
    if(file){
        return URL.createObjectURL(file.raw)
    }
  return  ''
})

function handleExceed(files){
  upload.value.clearFiles()
  const file = files[0]
  upload.value.handleStart(file)
}


</script>

<style lang="less">
.designiy-image-upload {
  padding: 20px;
  display: flex;
  column-gap: 20px;
}

.designiy-image-upload-main {
  width: 260px;
  height: 260px;
  border:1px dashed #ddd;

  &:hover{
    border:1px dashed #6900ff;
  }
  .el-upload {
    width: 100%;
    height: 100%;
    display:flex;
    flex-direction: column;
    justify-content:center;
    row-gap:10px;
    align-itemsc:center;
  }

}

.designiy-image-upload-form {
  width: 260px;
  height: 260px;
  display:flex;
  flex-direction:column;
  justify-content:space-between;
}
</style>
