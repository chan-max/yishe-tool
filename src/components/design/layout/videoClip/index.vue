<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2025-05-20 06:50:38
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2025-06-12 22:58:34
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
        <div class="text-xs text-gray-500 mt-1">开启后执行动画时会自动录制视频</div>
      </el-form-item>

      <el-form-item label="录制视频">
        <div class="flex items-center gap-2">
          <el-button 
            type="primary" 
            round 
            :class="{ 'recording': isRecording }"
            @click="handleRecord"
          >
            {{ isRecording ? `录制中 ${timeCount}s` : '开始录制' }}
          </el-button>
        </div>
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
import { message } from "ant-design-vue";
import { uploadToCOS, createDraft } from "@/api";
import {
  isRecordingEnabled,
  animations,
  modelControllerViewSetterOptions,
} from "./index.ts";

// 录制相关状态
const isRecording = ref(false);
const timeCount = ref(0);
let timeCountInterval: any = null;

// 处理录制
const handleRecord = async () => {
  if (isRecording.value) {
    // 停止录制
    currentModelController.value.stopMediaRecord();
    clearInterval(timeCountInterval);
    isRecording.value = false;
    timeCount.value = 0;
  } else {
    // 开始录制
    isRecording.value = true;
    currentModelController.value.startMediaRecord({
      onStop: handleRecordedVideo
    });
    
    // 开始计时
    timeCountInterval = setInterval(() => {
      if (timeCount.value >= 60) { // 最多录制60秒
        handleRecord();
        return;
      }
      timeCount.value++;
    }, 1000);
  }
};

// 处理录制结束后的视频保存
const handleRecordedVideo = async (blob: Blob) => {
  try {
    // 创建文件对象
    const file = new File([blob], `录制视频_${new Date().getTime()}.webm`, { type: 'video/webm' });
    
    // 上传到 COS
    const cos = await uploadToCOS({ file });
    
    // 保存到草稿箱
    await createDraft({
      url: cos.url,
      name: '模型录制视频',
      updateTime: new Date()
    });
    
    message.success('视频已保存到草稿箱');
  } catch (err) {
    message.error('保存视频失败');
    console.error(err);
  }
};
</script>

<style scoped>
.recording {
  animation: pulse 1s infinite;
  background-color: #ff5150;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style>
