<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2023-12-16 12:40:25
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-01-07 18:22:15
 * @FilePath: /1s/src/components/design/layout/saveModel/index.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
-->
<template>
  <div style="  width: 800px;
  height: 400px;
  padding: 1rem;">
    <el-row justify="center" align="center">
      <el-col :span="8">
        <desimage style="width:200px;height:200px;" :src="thumbnail"></desimage>
      </el-col>
      <el-col :span="16">
        <el-input v-model="form.name"></el-input>
        显示基础模型，创建后的模型缩略图 用了哪些贴纸，什么类型，是否上传了
        <el-button @click="save" type="primary"> 上传模型 </el-button>
      </el-col>
    </el-row>


  </div>
</template>
<script setup>
import { ref, onBeforeMount, computed } from "vue";
import { createCustomModelApi, uploadToCOS } from "@/api";
import { ElMessageBox } from "element-plus";
import { currentModelController, lastestScreenshot } from "../../store";
import { base64ToFile, base64ToPngFile } from "@/common/transform/base64ToFile";
import { useLoginStatusStore } from "@/store/stores/login";
import { message } from "ant-design-vue";
import desimage from "@/components/image.vue";

const thumbnail = ref()

const form = ref({
  name: null,
})




onBeforeMount(() => {
  thumbnail.value = currentModelController.value.getScreenshotBase64()
})

const loginStore = useLoginStatusStore();

const previewSrc = computed(() => {
  return lastestScreenshot.value?.base64;
});




async function save() {


  // 上传本地贴纸 , 过滤出本地的贴纸
  let localDecals = currentModelController.value.decalControllers.filter(
    (decal) => decal.state.isLocalResource
  );

  


  // 只负责把贴纸上传即可
  if (localDecals.length) {

    return
  }

  const thumbnail = currentModelController.value.getScreenShotFile()

  const { url } = await uploadToCOS({ file: thumbnail });


  const params = {
    name: name.value,
    thumbnail: url,
    meta: {
      modelInfo: currentModelController.value.exportTo1stf(),
    },
    uploaderId: loginStore.userInfo.id,
  };

  await createCustomModelApi(params);
  message.success("上传成功");
}
</script>
<style lang="less" scoped></style>
