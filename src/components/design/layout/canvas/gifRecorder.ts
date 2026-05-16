import { ref } from "vue";
// @ts-ignore
import GIF from "gif.js";
// @ts-ignore
import html2canvas from "html2canvas";

export interface GifRecorderConfig {
  interval: number;
  quality: number;
  loop: boolean;
  width: number;
  height: number;
}

export const gifRecorderConfig = ref<GifRecorderConfig>({
  interval: 200,
  quality: 10,
  loop: true,
  width: 0,
  height: 0,
});

export const isRecording = ref(false);
export const isProcessing = ref(false);
export const frameCount = ref(0);
export const recordingDuration = ref(0);

let frames: HTMLCanvasElement[] = [];
let recordTimer: ReturnType<typeof setInterval> | null = null;
let startTime = 0;
let targetElement: HTMLElement | null = null;

export function startRecording(element: HTMLElement) {
  if (isRecording.value) return;

  targetElement = element;
  frames = [];
  frameCount.value = 0;
  recordingDuration.value = 0;
  isRecording.value = true;
  startTime = Date.now();

  const config = gifRecorderConfig.value;

  recordTimer = setInterval(async () => {
    if (!isRecording.value || !targetElement) return;

    try {
      const canvas = await html2canvas(targetElement, {
        backgroundColor: null,
        scale: 1,
        useCORS: true,
        logging: false,
      });
      frames.push(canvas);
      frameCount.value = frames.length;
      recordingDuration.value = Math.round((Date.now() - startTime) / 1000);
    } catch (err) {
      console.warn("html2canvas capture failed:", err);
    }
  }, config.interval);
}

export function stopRecording() {
  if (!isRecording.value) return;

  isRecording.value = false;
  if (recordTimer) {
    clearInterval(recordTimer);
    recordTimer = null;
  }
}

export async function exportGif(): Promise<void> {
  if (frames.length === 0) {
    throw new Error("没有录制的帧");
  }

  isProcessing.value = true;

  try {
    const config = gifRecorderConfig.value;
    const firstFrame = frames[0];

    const gif = new GIF({
      workers: 2,
      quality: config.quality,
      width: config.width || firstFrame.width,
      height: config.height || firstFrame.height,
      workerScript: "/gif.worker.js",
    });

    frames.forEach((canvas) => {
      gif.addFrame(canvas, { delay: config.interval, copy: true });
    });

    return new Promise<void>((resolve, reject) => {
      gif.on("finished", (blob: Blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `recording-${Date.now()}.gif`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        isProcessing.value = false;
        resolve();
      });

      gif.on("abort", () => {
        isProcessing.value = false;
        reject(new Error("GIF 生成被中止"));
      });

      gif.render();
    });
  } catch (error) {
    isProcessing.value = false;
    throw error;
  }
}

export function clearFrames() {
  frames = [];
  frameCount.value = 0;
  recordingDuration.value = 0;
}

export const gifRecorder = {
  config: gifRecorderConfig,
  isRecording,
  isProcessing,
  frameCount,
  recordingDuration,
  startRecording,
  stopRecording,
  exportGif,
  clearFrames,
};
