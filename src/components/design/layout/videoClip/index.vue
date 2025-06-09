<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2025-05-20 06:50:38
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2025-06-08 08:36:01
 * @FilePath: /1s/src/components/design/layout/videoClip/index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div style="width: 320px; padding: 12px">
    <el-form>

      <el-form-item label="导出图片">
        <el-button type="primary" round @click="() => {
          currentModelController.downloadMultiAngleImages();
        }"> 下载多角度图 </el-button>
      </el-form-item>

      <el-form-item label="执行动画">
        <div class="flex flex-wrap" style="gap: 8px">
          <a-button
            size="small"
            v-for="item in animations"
            class="cursor-pointer round"
            @click="item.handle"
          >
            {{ item.title }}
          </a-button>
        </div>
      </el-form-item>
      <el-form-item label="同时导出录制视频">
        <el-switch v-model="isRecordingEnabled" size="small" />
      </el-form-item>

      <!-- <el-form-item label="调整视图">
        <div class="flex flex-wrap" style="gap: 8px">
          <a-button
            size="small"
            v-for="item in modelControllerViewSetterOptions"
            class="cursor-pointer round"
            @click="item.handle"
          >
            {{ item.name }}
          </a-button>
        </div>
      </el-form-item> -->
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { currentModelController } from "../../store";
import { ref } from "vue";
import gsap from "gsap";
import {
  isRecordingEnabled,
  animations,
  modelControllerViewSetterOptions,
} from "./index.ts";
</script>

<style></style>
