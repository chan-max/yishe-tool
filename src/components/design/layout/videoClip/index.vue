<template>
  <div style="width: 320px; padding: 12px">
    <el-form>
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
