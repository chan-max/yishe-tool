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
  <div class="designiy-save-model">
    显示基础模型，创建后的模型缩略图 用了哪些贴纸，什么类型，是否上传了
    <el-button @click="save" type="primary"> 上传模型 </el-button>
  </div>
</template>
<script setup>
import { onShortcutTrigger } from "../../shortcut/index";
import { createCustomModelApi, uploadTextSticker } from "@/api";
import { ElMessageBox } from "element-plus";
import { currentController } from "../../store";
import { base64ToFile } from "@/common/transform/base64ToFile";
import { useLoginStatusStore } from "@/store/stores/login";

const loginStore = useLoginStatusStore();

async function save() {
  // 上传本地贴纸 , 过滤出本地的贴纸
  let localDecals = currentController.value.decalControllers.filter(
    (decal) => decal.isLocal
  );

  // 只负责把贴纸上传即可
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
          localDecal.info.id = data.id;
          resolve();
        });
      })
    );
  }

  await createCustomModelApi({
    img: currentController.value.getScreenShotFile(),
    modelInfo: JSON.stringify(currentController.value.exportTo1stf()),
    user_id: loginStore.userInfo.id,
  });
}
</script>
<style lang="less">
.designiy-save-model {
  width: 800px;
  height: 400px;
}
</style>
