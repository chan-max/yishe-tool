import { onMounted, onUnmounted } from "vue";

export const usePreventScreenResize = () => {
  function wheelHandler(event) {
    if (event.ctrlKey) {
      event.preventDefault();
    }
  }

  function keyHandler(event) {
    if (event.ctrlKey && (event.key === "+" || event.key === "-")) {
      event.preventDefault();
    }
  }
  onMounted(() => {
    window.addEventListener("wheel", wheelHandler, { passive: false });
    window.addEventListener("keydown", keyHandler, { passive: false });
  });
  onUnmounted(() => {
    window.removeEventListener("wheel", wheelHandler);
    window.removeEventListener("keydown", keyHandler);
  });
};
