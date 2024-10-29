<template>
  <div style="width: 320px; padding: 12px">
    <el-form>
      <el-form-item label="执行动画">
        <div class="flex flex-wrap" style="row-gap: 8px">
          <a-tag
            v-for="item in animations"
            :bordered="false"
            class="cursor-pointer"
            @click="item.handle"
          >
            {{ item.title }}
          </a-tag>
        </div>
      </el-form-item>
      <el-form-item label="同时导出录制视频">
        <el-switch v-model="isRecordingEnabled" size="small" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { currentModelController } from "../../store";
import { ref } from "vue";
import gsap from "gsap";
import { isRecordingEnabled, animations } from "./index.ts";
</script>

<style></style>
