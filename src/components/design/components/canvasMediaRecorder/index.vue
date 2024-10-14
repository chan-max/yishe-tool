<template>
  <div class="flex items-center">
    <el-tooltip content="录制画布模型内容">
      <el-button @click="handleRecord" link>
        <icon
          style="width: 20px; height: 20px; margin: 4px"
          :class="{
            red: isRecording,
            pulse: isRecording,
          }"
        ></icon>
        <div v-if="!isRecording && !(countdown > 0)">点击录制</div>
        <div v-if="isRecording" :class="{ red: isRecording }">
          录制中 {{ timeCount }} s 点击结束
        </div>
        <div v-if="countdown > 0">倒计时: {{ countdown }} 点击取消</div>
      </el-button>
    </el-tooltip>
  </div>
</template>

<script setup>
import { ref } from "vue";
import icon from "./record.svg?component";
import { currentModelController } from "@/components/design/store";

// 是否正在录制
const isRecording = ref(false);
const countdown = ref(0);

let interval = ref();

function clearState() {
  isRecording.value = false;
  countdown.value = 0;
  clearInterval(interval.value);
  timeCount.value = 1;
  clearInterval(timeCountInterval.value);
}

const handleRecord = async () => {
  if (isRecording.value) {
    // 停止录制
    stopRecording();
  } else if (countdown.value > 0) {
    // 取消录制
    clearState();
  } else {
    countdown.value = 3; // 设置倒计时为3秒
    interval.value = setInterval(() => {
      if (countdown.value > 1) {
        countdown.value--;
      } else {
        clearState();
        startRecording();
      }
    }, 1000);
  }
};

// 从第一秒开始
let timeCount = ref(1);
let timeCountInterval = ref();

const startRecording = async () => {
  isRecording.value = true;

  currentModelController.value.startMediaRecord();

  timeCountInterval.value = setInterval(() => {
    // 慕目前最多限制60秒
    if (timeCount.value == 60) {
      stopRecording();
      return;
    }

    timeCount.value++;
  }, 1000);
};

const stopRecording = () => {
  currentModelController.value.stopMediaRecord();
  clearState();
};
</script>

<style scoped lang="less">
.red {
  color: rgb(255, 81, 80);
}

.pulse {
  animation-name: pulse;
  animation-duration: 1s;
  animation-fill-mode: both;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
}

@keyframes pulse {
  0% {
    transform: scale3d(1, 1, 1);
  }
  50% {
    transform: scale3d(1.1, 1.1, 1.1);
  }
  100% {
    transform: scale3d(1, 1, 1);
  }
}
</style>
