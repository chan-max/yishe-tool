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
  <div class="flex" style="padding: 12px 24px 24px 24px; column-gap: 12px">
    <s1-image
      style="
        width: 480px;
        height: 480px;
        flex-shrink: 0;
        background: #f5f6f7;
        border-radius: 12px;
      "
      :src="thumbnail"
    ></s1-image>

    <div class="flex flex-col" style="width: 480px">
      <el-form label-position="top">
        <el-form-item label="模型名称">
          <el-input v-model="form.name" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="模型描述">
          <el-input
            v-model="form.description"
            placeholder="请输入"
            type="textarea"
          ></el-input>
        </el-form-item>

        <el-form-item label="模型标签" prop="keywords">
          <s1-tagsInput v-model="form.keywords" :string="true"></s1-tagsInput>
        </el-form-item>

        <el-form-item label="模型截图">
          <div
            class="flex items-center"
            style="padding: 12px; column-gap: 12px; overflow: auto"
          >
            <s1-image
              v-for="item in screenshots"
              style="width: 48px; height: 48px; border-radius: 4px; background: #eee"
              :src="item.base64"
            >
              <el-button
                style="top: -8px; right: -8px; position: absolute"
                link
                type="danger"
                @click="removeScreenshot(item)"
              >
                <el-icon size="12"><CircleCloseFilled /></el-icon>
              </el-button>
            </s1-image>
          </div>
        </el-form-item>
      </el-form>

      <div style="flex: 1"></div>
      <el-button @click="save" type="primary" class="w-full" round :loading="loading">
        {{ loadingMessage || "上传模型" }}
      </el-button>
    </div>
  </div>
</template>
<script setup>
import { ref, onBeforeMount, computed } from "vue";
import { createCustomModelApi, uploadToCOS } from "@/api";
import { ElMessageBox } from "element-plus";
import { currentModelController, lastestScreenshot, screenshots } from "../../store";
import { base64ToFile, base64ToPngFile } from "@/common/transform/base64ToFile";
import { useLoginStatusStore } from "@/store/stores/login";
import { message } from "ant-design-vue";
import desimage from "@/components/image.vue";
import { CircleCloseFilled } from "@element-plus/icons-vue";
import Utils from "@/common/utils";

const thumbnail = ref();

const form = ref({
  name: null,
});

// 获取模型缩略图
onBeforeMount(() => {
  thumbnail.value = currentModelController.value.getScreenshotBase64();
});

const loginStore = useLoginStatusStore();

const loading = ref(false);
const loadingMessage = ref("");

async function save() {
  try {
    loading.value = true;
    // 上传本地贴纸 , 过滤出本地的贴纸
    let localDecals = currentModelController.value.decalControllers.filter(
      (decal) => decal.state.isLocalResource
    );

    // 只负责把贴纸上传即可
    if (localDecals.length) {
      // 提示存在未上传的贴纸
    }

    const thumbnail = currentModelController.value.getScreenShotFile();

    const cos = await uploadToCOS({ file: thumbnail });

    const modelInfo = await currentModelController.value.exportTo1stf();

    let thumbnails = await Promise.all(
      screenshots.value.map(async (shot) => {
        const file = Utils.transform.base64ToPngFile(shot.base64);
        return await uploadToCOS({ file: file });
      })
    );

    const params = {
      name: name.value,
      thumbnail: cos,
      thumbnails,
      meta: {
        modelInfo,
      },
      uploaderId: loginStore.userInfo.id,
    };

    await createCustomModelApi(params);
    message.success("上传成功");
  } catch (e) {
  } finally {
    loading.value = false;
  }
}

function removeScreenshot(item) {
  let ind = screenshots.value.indexOf(item);
  screenshots.value.splice(ind, 1);
}
</script>
<style lang="less" scoped></style>
