import { io, type Socket } from "socket.io-client";
import { reactive } from "vue";

type WsStatus = "idle" | "connecting" | "connected" | "reconnecting" | "disconnected" | "error";

const CLIENT_SOURCE = "设计工具";
const HEARTBEAT_INTERVAL = 15_000;
const HEARTBEAT_TIMEOUT = 30_000;

function generateClientId() {
  return `designtool-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function getAccessToken(): string | undefined {
  try {
    const raw = localStorage.getItem("token");
    if (!raw) return undefined;
    const cleaned = raw.replace(/^"|"$/g, "").replace(/^Bearer\s+/i, "").trim();
    return cleaned || undefined;
  } catch {
    return undefined;
  }
}

function getDefaultWsUrl() {
  const explicitUrl = import.meta.env.VITE_WS_URL as string | undefined;
  if (explicitUrl) return explicitUrl;

  if (typeof window === "undefined") return "";

  const { protocol, host } = window.location;
  const wsProtocol = protocol === "https:" ? "wss:" : "ws:";
  return `${wsProtocol}//${host}/ws`;
}

function parseBrowserInfo(ua: string) {
  if (ua.includes("Edg/")) return { name: "Edge", version: ua.match(/Edg\/([\d.]+)/)?.[1] };
  if (ua.includes("Chrome/")) return { name: "Chrome", version: ua.match(/Chrome\/([\d.]+)/)?.[1] };
  if (ua.includes("Firefox/")) return { name: "Firefox", version: ua.match(/Firefox\/([\d.]+)/)?.[1] };
  if (ua.includes("Safari/") && ua.includes("Version/")) return { name: "Safari", version: ua.match(/Version\/([\d.]+)/)?.[1] };
  return { name: "Unknown" };
}

function parseOsInfo(ua: string) {
  if (ua.includes("Windows NT 10")) return { name: "Windows", version: "10" };
  if (ua.includes("Windows NT 6.3")) return { name: "Windows", version: "8.1" };
  if (ua.includes("Mac OS X")) return { name: "macOS", version: ua.match(/Mac OS X ([\d_]+)/)?.[1]?.replace(/_/g, ".") };
  if (ua.includes("Linux")) return { name: "Linux" };
  return { name: "Unknown" };
}

function buildScreenInfo() {
  if (typeof window === "undefined") return undefined;
  return {
    width: window.screen?.width,
    height: window.screen?.height,
    availWidth: window.screen?.availWidth,
    availHeight: window.screen?.availHeight,
    pixelRatio: window.devicePixelRatio,
    colorDepth: window.screen?.colorDepth,
  };
}

export type WebsocketEvents = {
  log: { level: "info" | "warn" | "error"; message: string };
  statusChanged: WsStatus;
};

type EventHandler<T = any> = (event: T) => void;

function createEmitter<T extends Record<string, any>>() {
  const listeners = new Map<keyof T, Set<EventHandler<any>>>();
  return {
    on<K extends keyof T>(type: K, handler: EventHandler<T[K]>) {
      if (!listeners.has(type)) listeners.set(type, new Set());
      listeners.get(type)!.add(handler);
    },
    off<K extends keyof T>(type: K, handler: EventHandler<T[K]>) {
      listeners.get(type)?.delete(handler);
    },
    emit<K extends keyof T>(type: K, event: T[K]) {
      listeners.get(type)?.forEach((handler) => handler(event));
    },
  };
}

const clientId = generateClientId();

const clientInfo = reactive({
  clientId,
  source: CLIENT_SOURCE,
  timestamp: new Date().toISOString(),
  app: {
    name: "yishe-tool",
    version: (import.meta.env.VITE_APP_VERSION as string | undefined) || undefined,
    mode: import.meta.env.MODE,
  },
  language: typeof navigator !== "undefined" ? navigator.language : "unknown",
  uiLanguage: typeof navigator !== "undefined" ? navigator.language : "unknown",
  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
  browser: typeof navigator !== "undefined" ? parseBrowserInfo(navigator.userAgent) : { name: "Unknown" },
  os: typeof navigator !== "undefined" ? parseOsInfo(navigator.userAgent) : { name: "Unknown" },
  device: {
    memory: typeof navigator !== "undefined" ? (navigator as any).deviceMemory : undefined,
    hardwareConcurrency: typeof navigator !== "undefined" ? navigator.hardwareConcurrency : undefined,
    touchPoints: typeof navigator !== "undefined" ? navigator.maxTouchPoints : undefined,
  },
  machine: {
    code: `DESIGN-TOOL-${clientId.slice(-12).toUpperCase()}`,
    platform: typeof navigator !== "undefined" ? navigator.platform : undefined,
  },
  screen: buildScreenInfo(),
  designTool: {
    type: "sticker-design",
    canvasEnabled: true,
    operationsVersion: "1.0",
  },
});

const emitter = createEmitter<WebsocketEvents>();

let socket: Socket | null = null;
let heartbeatTimer: ReturnType<typeof setInterval> | null = null;
let heartbeatTimeoutTimer: ReturnType<typeof setTimeout> | null = null;
let lastPingTimestamp: number | null = null;
let intentionalDisconnect = false;
let lastAuthToken: string | undefined;

const wsState = reactive({
  endpoint: getDefaultWsUrl(),
  status: "idle" as WsStatus,
  connectedAt: null as string | null,
  lastPingAt: null as string | null,
  lastPongAt: null as string | null,
  lastLatencyMs: null as number | null,
  lastError: null as string | null,
  retryCount: 0,
  connectionId: null as string | null,
});

function updateState(patch: Partial<typeof wsState>) {
  Object.assign(wsState, patch);
  emitter.emit("statusChanged", wsState.status);
}

function startHeartbeatLoop() {
  stopHeartbeat();
  heartbeatTimer = setInterval(() => {
    if (!socket?.connected) return;
    lastPingTimestamp = Date.now();
    updateState({ lastPingAt: new Date(lastPingTimestamp).toISOString() });
    socket.emit("ping");

    heartbeatTimeoutTimer = setTimeout(() => {
      if (wsState.status === "connected") {
        emitter.emit("log", { level: "warn", message: "[ws] heartbeat timeout, forcing reconnect" });
        socket?.disconnect();
        socket?.connect();
      }
    }, HEARTBEAT_TIMEOUT);
  }, HEARTBEAT_INTERVAL);
}

function clearHeartbeatTimeout() {
  if (heartbeatTimeoutTimer) {
    clearTimeout(heartbeatTimeoutTimer);
    heartbeatTimeoutTimer = null;
  }
}

function stopHeartbeat() {
  if (heartbeatTimer) {
    clearInterval(heartbeatTimer);
    heartbeatTimer = null;
  }
  clearHeartbeatTimeout();
}

function cleanupSocket() {
  if (socket) {
    socket.removeAllListeners();
    socket.io.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
  stopHeartbeat();
}

function emitClientInfo() {
  if (!socket?.connected) return;
  clientInfo.timestamp = new Date().toISOString();
  clientInfo.screen = buildScreenInfo();
  socket.emit("client-info", clientInfo);
}

function buildQuery() {
  return {
    clientSource: CLIENT_SOURCE,
    clientId,
    machineCode: clientInfo.machine?.code || "",
  };
}

function bindSocketEvents(currentSocket: Socket) {
  currentSocket.on("connect", () => {
    const socketId = currentSocket.id;
    lastAuthToken = getAccessToken();
    updateState({
      status: "connected",
      connectedAt: new Date().toISOString(),
      lastError: null,
      retryCount: 0,
      connectionId: clientId,
    });
    emitter.emit("log", {
      level: "info",
      message: `[ws] connected (socket: ${socketId}, connection: ${clientId})`,
    });
    emitClientInfo();
    startHeartbeatLoop();
  });

  currentSocket.on("disconnect", (reason) => {
    emitter.emit("log", { level: "warn", message: `[ws] disconnected: ${reason}` });
    stopHeartbeat();
    updateState({
      status: intentionalDisconnect ? "disconnected" : "error",
      lastError: reason || null,
      connectedAt: null,
      connectionId: null,
    });
  });

  currentSocket.on("pong", () => {
    clearHeartbeatTimeout();
    const now = Date.now();
    updateState({
      status: "connected",
      lastPongAt: new Date(now).toISOString(),
      lastLatencyMs: lastPingTimestamp ? now - lastPingTimestamp : null,
      lastError: null,
    });
    lastPingTimestamp = null;
  });

  currentSocket.on("connect_error", (error) => {
    emitter.emit("log", {
      level: "error",
      message: `[ws] connect_error: ${error?.message || "Unknown error"}`,
    });
    updateState({
      status: "error",
      lastError: error?.message || "Unknown error",
    });
  });

  currentSocket.on("admin-message", (data: any) => {
    emitter.emit("log", {
      level: "info",
      message: `[ws] admin-message: ${typeof data === "string" ? data : JSON.stringify(data)}`,
    });
  });
}

function connect(endpoint?: string) {
  const targetEndpoint = endpoint || wsState.endpoint || getDefaultWsUrl();
  wsState.endpoint = targetEndpoint;
  const token = getAccessToken();

  if (socket?.connected) {
    if (lastAuthToken !== token) {
      cleanupSocket();
    } else {
      return;
    }
  }

  cleanupSocket();
  intentionalDisconnect = false;

  updateState({
    status: "connecting",
    lastError: null,
    retryCount: 0,
  });

  lastAuthToken = token;

  socket = io(targetEndpoint, {
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 2000,
    reconnectionDelayMax: 12_000,
    timeout: 8000,
    query: buildQuery(),
    auth: token ? { token } : undefined,
  });

  bindSocketEvents(socket);
}

function disconnect() {
  intentionalDisconnect = true;
  cleanupSocket();
  updateState({
    status: "disconnected",
    lastError: null,
    retryCount: 0,
    connectedAt: null,
    connectionId: null,
  });
}

function reconnect() {
  intentionalDisconnect = false;
  cleanupSocket();
  connect();
}

function sendMessage(event: string, data: any) {
  if (!socket?.connected) throw new Error("WebSocket 未连接");
  socket.emit(event, data);
}

export const websocketClient = {
  state: wsState,
  profile: clientInfo,
  connect,
  disconnect,
  reconnect,
  sendMessage,
  events: emitter,
};
