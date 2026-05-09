import { watch } from "vue";
import { websocketClient } from "./websocketClient";
import { useLoginStatusStore } from "@/store/stores/login";

let started = false;

export function startDesignToolWebSocket() {
  if (started) return;
  started = true;

  const loginStore = useLoginStatusStore();

  watch(
    () => loginStore.isLogin,
    (loggedIn) => {
      if (loggedIn) {
        websocketClient.connect();
      } else {
        websocketClient.disconnect();
      }
    },
    { immediate: true }
  );

  window.addEventListener("online", () => {
    if (loginStore.isLogin && websocketClient.state.status !== "connected") {
      websocketClient.reconnect();
    }
  });

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      if (loginStore.isLogin && websocketClient.state.status === "disconnected") {
        websocketClient.reconnect();
      }
    }
  });
}

export { websocketClient } from "./websocketClient";
