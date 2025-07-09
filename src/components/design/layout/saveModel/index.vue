<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2023-12-16 12:40:25
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2025-07-08 23:39:13
 * @FilePath: /1s/src/components/design/layout/saveModel/index.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
-->
<template>
  <div class="flex flex-col h-full overflow-y-auto" style="padding: 24px 0; width: 100%;">
    <!-- 主要内容区域 -->
    <div class="flex flex-col gap-8" style="min-height: 0; padding: 0 24px;">
      <!-- 顶部预览区域 -->
      <div class="w-full">
        <div class="mb-4">
          <h3 class="text-lg font-medium mb-2">模型预览</h3>
        </div>
        <s1-image
          style="
            width: 100%;
            height: 400px;
            background: #f5f6f7;
            border-radius: 12px;
            object-fit: contain;
          "
          :src="displayThumbnail"
        ></s1-image>
      </div>

      <!-- 底部表单区域 -->
      <div class="flex flex-col w-full">
        <div class="mb-4">
          <h3 class="text-lg font-medium mb-2">模型信息</h3>
        </div>
        
        <el-form label-position="top" class="w-full">
          <el-form-item label="模型名称">
            <el-input 
              v-model="form.name" 
              placeholder="请输入模型名称"
              size="default"
            ></el-input>
          </el-form-item>
          
          <el-form-item label="模型描述">
            <el-input
              v-model="form.description"
              placeholder="请输入模型描述"
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 8 }"
              size="default"
            ></el-input>
          </el-form-item>

          <el-form-item label="模型标签" prop="keywords">
            <s1-tagsInput
              v-model="form.keywords"
              :string="true"
              :autocompleteTags="customModelAutoplacementTags"
              :autocompleteWidth="400"
            ></s1-tagsInput>
          </el-form-item>
          
          <el-form-item label="辅助操作">
            <el-button
              type="default"
              size="default"
              title="根据基础模型和贴纸信息自动生成模型信息"
              @click="autofillInfo"
            >
              自动生成信息
            </el-button>
          </el-form-item>
        </el-form>

        <!-- 底部操作区域 -->
        <div class="mt-8 pt-6 border-t border-gray-200">
          <el-button 
            @click="save" 
            type="primary" 
            class="w-full" 
            round 
            :loading="loading"
            size="default"
          >
            {{ loadingMessage || "上传模型" }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onBeforeMount, computed, watch } from "vue";
import { createCustomModelApi, uploadToCOS } from "@/api";
import { ElMessageBox } from "element-plus";
import {
  currentModelController,
  currentOperatingBaseModelInfo,
  lastestScreenshot,
  screenshots,
  showSaveModel,
  isEdit,
  currentEditingModelId,
  exitEditMode,
} from "../../store";
import { base64ToFile, base64ToPngFile } from "@/common/transform/base64ToFile";
import { useLoginStatusStore } from "@/store/stores/login";
import { message } from "ant-design-vue";
import desimage from "@/components/image.vue";
import { CircleCloseFilled } from "@element-plus/icons-vue";
import Utils from "@/common/utils";
import { saveCustomModel } from "./index.ts";
import { customModelAutoplacementTags } from "../../components/tagsInput";
import { updateCustomModelWithUpload } from "./index.ts";

const loginStore = useLoginStatusStore();

const displayThumbnail = ref();

const form = ref({
  name: null,
  description: null,
  keywords: null,
});

// 获取模型缩略图
function updateThumbnail() {
  displayThumbnail.value = currentModelController.value.getScreenshotBase64();
}

// 监听弹窗显示状态，每次显示时重新生成截图
watch(showSaveModel, (newVal) => {
  if (newVal) {
    // 弹窗显示时重新生成截图
    updateThumbnail();
  }
});

// 初始化时获取截图
onBeforeMount(() => {
  updateThumbnail();
});

const loading = ref(false);
const loadingMessage = ref("");

async function save() {
  try {
    loading.value = true;
    if (isEdit.value) {
      // 编辑模式，弹窗提示
      await ElMessageBox.confirm(
        "当前为修改模式，将会影响到原模型，是否继续？",
        "提示",
        { confirmButtonText: "确定", cancelButtonText: "取消", type: "warning" }
      );
      await updateCustomModelWithUpload({
        ...form.value,
        id: currentEditingModelId.value,
      });
      message.success("模型修改成功");
      // exitEditMode();
    } else {
      await saveCustomModel(form.value);
      message.success("上传成功");
    }
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
<style lang="less" scoped>
/* 滚动条样式 */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 #f7fafc;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f7fafc;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .w-full s1-image {
    height: 300px !important;
  }
  
  .text-2xl {
    font-size: 1.5rem;
  }
  
  .text-lg {
    font-size: 1.125rem;
  }
}

/* 确保内容区域不会溢出 */
.flex-1 {
  min-height: 0;
}

/* 表单区域样式优化 */
.el-form {
  .el-form-item {
    margin-bottom: 20px;
  }
  
  .el-form-item__label {
    font-weight: 500;
    color: #374151;
    margin-bottom: 8px;
  }
}

/* 按钮样式优化 */
.el-button--default {
  font-weight: 500;
}
</style>
