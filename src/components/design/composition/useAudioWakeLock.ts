import { onMounted, onUnmounted } from "vue";

/**
 * 使用 AudioContext 低频振荡器策略防止浏览器后台标签页休眠。
 * Chrome 等浏览器会对后台标签页降低 CPU/定时器优先级，
 * 活跃的 AudioContext 可以阻止这种行为。
 *
 * 原理：创建一个增益极小（几乎无声）的振荡器连接到 destination，
 * 让浏览器认为页面正在播放音频，从而保持活跃。
 */
export const useAudioWakeLock = () => {
  let audioCtx: AudioContext | null = null;
  let oscillator: OscillatorNode | null = null;
  let gainNode: GainNode | null = null;

  function startWakeLock() {
    try {
      if (typeof window.AudioContext === "undefined" && typeof (window as any).webkitAudioContext === "undefined") {
        console.warn("[AudioWakeLock] AudioContext not supported in this browser.");
        return;
      }

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      audioCtx = new AudioCtx();
      oscillator = audioCtx.createOscillator();
      gainNode = audioCtx.createGain();

      // 极低增益，人耳几乎听不到
      gainNode.gain.value = 0.00001;

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.start();

      console.log("[AudioWakeLock] started.");
    } catch (err) {
      console.error("[AudioWakeLock] failed to start:", err);
      cleanup();
    }
  }

  function cleanup() {
    try {
      if (oscillator) {
        oscillator.stop();
        oscillator.disconnect();
        oscillator = null;
      }
      if (gainNode) {
        gainNode.disconnect();
        gainNode = null;
      }
      if (audioCtx) {
        audioCtx.close();
        audioCtx = null;
      }
    } catch {
      // ignore
    }
    console.log("[AudioWakeLock] cleaned up.");
  }

  function handleVisibilityChange() {
    if (document.visibilityState === "hidden") {
      // 页面隐藏时确保 AudioContext 处于运行状态
      if (audioCtx && audioCtx.state === "suspended") {
        audioCtx.resume();
      }
    }
  }

  onMounted(() => {
    startWakeLock();
    document.addEventListener("visibilitychange", handleVisibilityChange);
  });

  onUnmounted(() => {
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    cleanup();
  });
};
