<template>
  <div class="designiy-save-model">
    显示基础模型，创建后的模型缩略图 用了哪些贴纸，什么类型，是否上传了
    <el-button @click="save" type="primary"> 上传模型 </el-button>
  </div>
</template>
<script setup>
import { onShortcutTrigger } from "../../shortcut/index";
import { uploadModel, uploadTextSticker } from "@/api";
import { ElMessageBox } from "element-plus";
import { currentController } from "../../store";
import { base64ToFile } from "@/common/transform/base64ToFile";

async function save() {
  // 上传本地贴纸
  let localDecals = currentController.value.decalControllers.filter(
    (decal) => decal.isLocal
  );

  if (localDecals.length) {

    await Promise.all(
      localDecals.map((localDecal) => {
        return new Promise(async (resolve) => {
          const data = await uploadTextSticker({
            name: "",
            description: "",
            data: "",
            img: base64ToFile(localDecal.info.base64),
          });
          // 保存该贴纸的id
          localDecal.info.id = data.id
          resolve()
        });
      })
    );
  }


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
