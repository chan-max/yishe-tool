import { Peer } from "peerjs";
import { reactive } from "vue";
import { websocketClient } from "./websocketClient";

export interface CanvasStreamConfig {
  allowedAdminPeerId?: string;
}

export interface StreamStatus {
  isStreaming: boolean;
  viewerCount: number;
  currentViewers: string[];
  error: null;
  mode: "page";
}

class CanvasStreamService {
  private peer: Peer | null = null;
  private pageStream: MediaStream | null = null;
  private currentCalls: Map<string, any> = new Map();
  private idleStopTimer: ReturnType<typeof setTimeout> | null = null;
  private activeConfig: CanvasStreamConfig = {};

  public status = reactive<StreamStatus>({
    isStreaming: false,
    viewerCount: 0,
    currentViewers: [],
    error: null,
    mode: "page",
  });

  initPeer(peerId?: string): Promise<string> {
    if (this.peer && !this.peer.destroyed && this.peer.open && this.peer.id) {
      return Promise.resolve(this.peer.id);
    }

    return new Promise((resolve, reject) => {
      if (this.peer && !this.peer.destroyed) {
        this.peer.once("open", (id) => resolve(id));
        this.peer.once("error", reject);
        return;
      }

      const finalPeerId =
        peerId ||
        websocketClient.state.connectionId ||
        `design-tool-${Date.now()}`;

      const peerConfig = resolvePeerjsConfig();
      this.peer = new Peer(finalPeerId, {
        debug: 1,
        host: peerConfig.host,
        port: peerConfig.port,
        path: peerConfig.path,
        secure: peerConfig.secure,
        config: {
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:stun1.l.google.com:19302" },
            { urls: "stun:stun2.l.google.com:19302" },
          ],
        },
      });

      this.peer.on("open", (id) => {
        console.log("[PageStream] Peer initialized with ID:", id);
        resolve(id);
      });

      this.peer.on("error", (err) => {
        console.error("[PageStream] Peer error:", err);
        this.status.error = err.message;
        reject(err);
      });

      this.peer.on("call", (call) => {
        console.log("[PageStream] Incoming call from:", call.peer);
        this.handleIncomingCall(call);
      });

      this.peer.on("disconnected", () => {
        console.log("[PageStream] Peer disconnected");
        this.status.isStreaming = false;
      });
    });
  }

  async startMonitoring(config: CanvasStreamConfig = {}): Promise<string> {
    try {
      if (this.isActive()) {
        this.cancelIdleStop();
        const peerId = this.getPeerId();
        if (peerId) return peerId;
      }

      this.stopLocalStream();
      this.activeConfig = config;

      // getDisplayMedia: 浏览器原生屏幕/标签页捕获，低延迟，实时画面
      this.pageStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          preferCurrentTab: true,
        } as any,
        audio: false,
      });

      // 用户关闭了浏览器共享按钮时自动停止
      this.pageStream.getVideoTracks()[0]?.addEventListener("ended", () => {
        console.log("[PageStream] User stopped sharing");
        this.stopMonitoring();
      });

      const peerId = await this.initPeer();

      this.status.isStreaming = true;
      this.status.error = null;
      this.scheduleIdleStop(60_000);

      console.log("[PageStream] Monitoring started with peer ID:", peerId);
      return peerId;
    } catch (error: any) {
      console.error("[PageStream] Failed to start monitoring:", error);
      this.status.error = error?.message || "Failed to start page stream";
      this.stopLocalStream();
      throw error;
    }
  }

  stopMonitoring(): void {
    this.cancelIdleStop();

    this.currentCalls.forEach((call, peerId) => {
      call.close();
      console.log("[PageStream] Closed call to:", peerId);
    });
    this.currentCalls.clear();

    this.stopLocalStream();

    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }

    this.status.isStreaming = false;
    this.status.viewerCount = 0;
    this.status.currentViewers = [];
    this.status.error = null;

    console.log("[PageStream] Monitoring stopped");
  }

  private handleIncomingCall(call: any): void {
    const allowedAdminPeerId = String(
      this.activeConfig.allowedAdminPeerId || "",
    ).trim();
    if (allowedAdminPeerId && call.peer !== allowedAdminPeerId) {
      console.warn(
        "[PageStream] Rejected unauthorized page monitor call from:",
        call.peer,
      );
      call.close();
      return;
    }

    if (!this.pageStream) {
      console.warn("[PageStream] No page stream available, rejecting call");
      call.close();
      return;
    }

    this.cancelIdleStop();
    call.answer(this.pageStream);

    call.on("close", () => {
      console.log("[PageStream] Call closed by:", call.peer);
      this.currentCalls.delete(call.peer);
      this.updateViewerStatus();
      if (!this.currentCalls.size) {
        this.scheduleIdleStop(30_000);
      }
    });

    call.on("error", (err: any) => {
      console.error("[PageStream] Call error:", err);
      this.currentCalls.delete(call.peer);
      this.updateViewerStatus();
      if (!this.currentCalls.size) {
        this.scheduleIdleStop(30_000);
      }
    });

    this.currentCalls.set(call.peer, call);
    this.updateViewerStatus();

    console.log("[PageStream] Call answered for:", call.peer);
  }

  private stopLocalStream(): void {
    if (this.pageStream) {
      this.pageStream.getTracks().forEach((track) => track.stop());
      this.pageStream = null;
    }
  }

  private updateViewerStatus(): void {
    this.status.viewerCount = this.currentCalls.size;
    this.status.currentViewers = Array.from(this.currentCalls.keys());
  }

  private scheduleIdleStop(delayMs: number): void {
    this.cancelIdleStop();
    this.idleStopTimer = setTimeout(() => {
      if (!this.currentCalls.size) {
        this.stopMonitoring();
      }
    }, delayMs);
  }

  private cancelIdleStop(): void {
    if (this.idleStopTimer) {
      clearTimeout(this.idleStopTimer);
      this.idleStopTimer = null;
    }
  }

  getPeerId(): string | null {
    return this.peer?.id || null;
  }

  isActive(): boolean {
    return (
      this.status.isStreaming && this.peer !== null && this.pageStream !== null
    );
  }
}

function resolvePeerjsConfig() {
  const { protocol, hostname } = window.location;
  const peerPort = Number(import.meta.env.VITE_PEERJS_PORT) || 15203;
  return {
    host: hostname,
    port: peerPort,
    path: "/",
    secure: protocol === "https:",
  };
}

export const canvasStreamService = new CanvasStreamService();
