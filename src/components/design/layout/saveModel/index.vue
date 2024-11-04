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
        width: 500px;
        height: 500px;
        flex-shrink: 0;
        background: #f5f6f7;
        border-radius: 12px;
      "
      :src="displayThumbnail"
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
            :autosize="{ minRows: 2, maxRows: 5 }"
          ></el-input>
        </el-form-item>

        <el-form-item label="模型标签" prop="keywords">
          <s1-tagsInput
            v-model="form.keywords"
            :string="true"
            :autocompleteTags="customModelAutoplacementTags"
            :autocompleteWidth="500"
          ></s1-tagsInput>
        </el-form-item>
        <el-form-item label="辅助操作">
          <el-button
            type="default"
            size="small"
            title="根据基础模型和贴纸信息自动生成模型信息"
            @click="autofillInfo"
          >
            自动生成信息
          </el-button>
        </el-form-item>

        <el-form-item label="模型截图">
          <div
            class="flex items-center w-full"
            style="padding: 12px; column-gap: 12px; overflow: auto"
          >
            <template v-if="screenshots.length">
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
            </template>
            <template v-else>
              <div style="font-size: 10px; color: #aaa" class="w-full text-center">
                无截图
              </div>
            </template>
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
import {
  currentModelController,
  currentOperatingBaseModelInfo,
  lastestScreenshot,
  screenshots,
} from "../../store";
import { base64ToFile, base64ToPngFile } from "@/common/transform/base64ToFile";
import { useLoginStatusStore } from "@/store/stores/login";
import { message } from "ant-design-vue";
import desimage from "@/components/image.vue";
import { CircleCloseFilled } from "@element-plus/icons-vue";
import Utils from "@/common/utils";
import { saveCustomModel } from "./index.ts";
import { customModelAutoplacementTags } from "../../components/tagsInput";

const loginStore = useLoginStatusStore();

const displayThumbnail = ref();

const form = ref({
  name: null,
  description: null,
  keywords: null,
});

// 获取模型缩略图
onBeforeMount(() => {
  displayThumbnail.value = currentModelController.value.getScreenshotBase64();
});

const loading = ref(false);
const loadingMessage = ref("");

async function save() {
  try {
    loading.value = true;
    await saveCustomModel(form.value);
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

/**
 * @method 自动从基础模型和贴纸中填充信息
 */
function autofillInfo() {
  let name = currentOperatingBaseModelInfo.value.name || "";
  let description = currentOperatingBaseModelInfo.value.description || "";
  let keywords = currentOperatingBaseModelInfo.value.keywords || "";

  currentModelController.value.decalControllers.map((item) => {
    if (item.info.name) {
      name += "," + item.info.name;
    }

    if (item.info.description) {
      description += "," + item.info.description || "";
    }

    if (item.info.keywords) {
      keywords += "," + item.info.keywords;
    }
  });

  form.value = {
    name,
    description,
    keywords,
  };
}
</script>
<style lang="less" scoped></style>
