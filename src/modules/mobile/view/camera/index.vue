<template>
  <div class="camera">
    <canvas ref="canvas" width="320" height="150"></canvas>
    <video ref="video" width="320" height="150" playsinline></video>
    <button @click="switchCamera">Switch Camera</button>
    <button @click="play">play</button>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const canvas = ref();

let constraints = { video: { facingMode: "user" } }; // 默认启用前摄像头
const video = ref(null);
let currentStream = null;

function stopMediaTracks(stream) {
  stream.getTracks().forEach((track) => {
    track.stop();
  });
}

// 切换摄像头
const switchCamera = () => {
  if (constraints.video.facingMode === "user") {
    constraints.video.facingMode = { exact: "environment" };
  } else {
    constraints.video.facingMode = "user";
  }

  if (currentStream) {
    stopMediaTracks(currentStream);
  }

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function (stream) {
      currentStream = stream; // 记住流供后面stop。
      video.value.srcObject = stream;
      return navigator.mediaDevices.enumerateDevices();
    })
    .catch(function (err) {
      console.log(err.name + ": " + err.message);
    });
};

function start() {
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function (mediaStream) {
      video.value.srcObject = mediaStream;
      video.value.onloadedmetadata = function (e) {
        function raf() {
          fn();
          requestAnimationFrame(raf);
        }

        function fn(){
          canvas.value.getContext('2d').drawImage(video.value, 0, 0,video.value.width, video.value.height)
        }

        raf();
      };
    })
    .catch(function (err) {
      console.log(err.name + ": " + err.message);
    });
}

onMounted(() => {
    start()
})

function play() {
  video.value.play();
}

onBeforeUnmount(() => {
  stopMediaTracks(video.value.srcObject);
});

</script>
<style lang="less">
button {
  background: red;
}
.camera {
    display:flex;
    flex-direction: column;
  width: 100%;
  height: 100%;
  *{
    flex-shrink:0;
  }
}
canvas {
  border: 1px solid green;
}

video::-webkit-media-controls{
    display:none!important;
}
</style>
