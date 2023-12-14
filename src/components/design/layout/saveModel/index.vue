<template>
  <div class="designiy-save-model">
    显示基础模型，创建后的模型缩略图 用了哪些贴纸，什么类型，是否上传了
    <el-button @click="save" type="primary"> 上传模型 </el-button>
  </div>
</template>
<script setup>
import { onShortcutTrigger } from "../../shortcut/index";
import { uploadModel,uploadTextSticker } from "@/api";
import { ElMessageBox } from "element-plus";
import { currentController } from "../../store";


async function save() {
  let localDecals = currentController.value.decalControllers.filter((decal) => decal.isLocal);

  await uploadTextSticker()

  await uploadModel({
    img: currentController.value.getScreenShotFile(),
    modelInfo: JSON.stringify(currentController.value.exportTo1stf()),
  });
}
</script>
<style lang="less">
.designiy-save-model {
  width: 800px;
  height: 400px;
}
</style>
