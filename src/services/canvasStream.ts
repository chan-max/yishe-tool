import { Peer } from "peerjs";
import { reactive } from "vue";
import { toCanvas, getFontEmbedCSS } from "html-to-image";
import { websocketClient } from "./websocketClient";

export interface CanvasStreamConfig {
  fps?: number;
  snapshotFps?: number;
  width?: number;
  height?: number;
  maxWidth?: number;
  maxHeight?: number;
  bitrate?: number;
  targetSelector?: string;
  backgroundColor?: string;
  allowedAdminPeerId?: string;
}

export interface StreamStatus {
  isStreaming: boolean;
  viewerCount: number;
  currentViewers: string[];
  error: string | null;
  mode: "page";
}

class CanvasStreamService {
  private peer: Peer | null = null;
  private pageStream: MediaStream | null = null;
  private currentCalls: Map<string, any> = new Map();
  private renderCanvas: HTMLCanvasElement | null = null;
  private renderContext: CanvasRenderingContext2D | null = null;
  private renderTimer: ReturnType<typeof setTimeout> | null = null;
  private idleStopTimer: ReturnType<typeof setTimeout> | null = null;
  private renderingFrame = false;
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
        peerId || websocketClient.state.connectionId || `design-tool-${Date.now()}`;

      this.peer = new Peer(finalPeerId, {
        debug: 1,
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

  capturePageStream(config: CanvasStreamConfig = {}): MediaStream {
    this.activeConfig = {
      fps: 6,
      snapshotFps: 1,
      maxWidth: 1280,
      maxHeight: 720,
      ...config,
    };

    const { width, height } = this.resolveOutputSize(this.activeConfig);
    this.renderCanvas = document.createElement("canvas");
    this.renderCanvas.dataset.pageMonitorIgnore = "true";
    this.renderCanvas.width = width;
    this.renderCanvas.height = height;
    this.renderCanvas.style.cssText =
      "position:fixed;left:-10000px;top:-10000px;width:1px;height:1px;opacity:0;pointer-events:none;";
    document.body.appendChild(this.renderCanvas);

    const ctx = this.renderCanvas.getContext("2d", { alpha: false });
    if (!ctx) {
      throw new Error("Page monitor render context unavailable");
    }

    this.renderContext = ctx;
    this.drawFallbackFrame("Preparing page monitor...");

    this.pageStream = this.renderCanvas.captureStream(this.activeConfig.fps);
    this.startRenderLoop();

    console.log("[PageStream] Page stream captured");
    return this.pageStream;
  }

  async startMonitoring(config: CanvasStreamConfig = {}): Promise<string> {
    try {
      if (this.isActive()) {
        this.cancelIdleStop();
        const peerId = this.getPeerId();
        if (peerId) return peerId;
      }

      this.stopLocalStream();
      this.capturePageStream(config);

      const peerId = await this.initPeer();

      this.status.isStreaming = true;
      this.status.error = null;
      this.scheduleIdleStop(60_000);

      console.log("[PageStream] Monitoring started with peer ID:", peerId);
      return peerId;
    } catch (error) {
      console.error("[PageStream] Failed to start monitoring:", error);
      this.status.error = `Failed to start page stream: ${error}`;
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
    const allowedAdminPeerId = String(this.activeConfig.allowedAdminPeerId || "").trim();
    if (allowedAdminPeerId && call.peer !== allowedAdminPeerId) {
      console.warn("[PageStream] Rejected unauthorized page monitor call from:", call.peer);
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

  private startRenderLoop(): void {
    this.stopRenderLoop();
    void this.renderAndScheduleNext();
  }

  private stopRenderLoop(): void {
    if (this.renderTimer) {
      clearTimeout(this.renderTimer);
      this.renderTimer = null;
    }
  }

  private async renderAndScheduleNext(): Promise<void> {
    if (!this.pageStream || !this.renderCanvas || !this.renderContext) return;

    const snapshotFps = Math.max(0.5, Math.min(this.activeConfig.snapshotFps || 2, 5));
    const intervalMs = Math.round(1000 / snapshotFps);

    try {
      await this.renderPageFrame();
    } finally {
      if (this.pageStream) {
        this.renderTimer = setTimeout(() => {
          void this.renderAndScheduleNext();
        }, intervalMs);
      }
    }
  }

  private async renderPageFrame(): Promise<void> {
    if (this.renderingFrame || !this.renderCanvas || !this.renderContext) return;
    this.renderingFrame = true;

    try {
      const target = this.resolveCaptureElement(this.activeConfig.targetSelector);
      const outputSize = this.resolveOutputSize(this.activeConfig, target);
      if (
        this.renderCanvas.width !== outputSize.width ||
        this.renderCanvas.height !== outputSize.height
      ) {
        this.renderCanvas.width = outputSize.width;
        this.renderCanvas.height = outputSize.height;
      }

      const sourceSize = this.resolveSourceSize(target);
      const scale = outputSize.width / sourceSize.width;
      const fontEmbedCSS = await getFontEmbedCSS(target).catch(() => undefined);

      const snapshot = await toCanvas(target, {
        cacheBust: true,
        pixelRatio: scale,
        backgroundColor:
          this.activeConfig.backgroundColor || this.resolveBackgroundColor(),
        width: sourceSize.width,
        height: sourceSize.height,
        fontEmbedCSS,
        filter: (node) => {
          const element = node as HTMLElement;
          return element?.dataset?.pageMonitorIgnore !== "true";
        },
      } as any);

      this.renderContext.clearRect(0, 0, this.renderCanvas.width, this.renderCanvas.height);
      this.renderContext.drawImage(
        snapshot,
        0,
        0,
        snapshot.width,
        snapshot.height,
        0,
        0,
        this.renderCanvas.width,
        this.renderCanvas.height,
      );
      this.requestCanvasFrame();
    } catch (error: any) {
      console.warn("[PageStream] Page snapshot failed:", error);
      this.status.error = error?.message || "Page snapshot failed";
      this.drawFallbackFrame(this.status.error);
    } finally {
      this.renderingFrame = false;
    }
  }

  private resolveCaptureElement(selector?: string): HTMLElement {
    const candidates = [
      selector ? document.querySelector(selector) : null,
      document.querySelector("#app"),
      document.querySelector(".design-layout"),
      document.body,
      document.documentElement,
    ].filter(Boolean) as HTMLElement[];

    return candidates[0];
  }

  private resolveSourceSize(target?: HTMLElement) {
    const rect = target?.getBoundingClientRect();
    const width =
      Math.round(rect?.width || 0) ||
      window.innerWidth ||
      document.documentElement.clientWidth ||
      1280;
    const height =
      Math.round(rect?.height || 0) ||
      window.innerHeight ||
      document.documentElement.clientHeight ||
      720;

    return {
      width: Math.max(2, width),
      height: Math.max(2, height),
    };
  }

  private resolveOutputSize(config: CanvasStreamConfig, target?: HTMLElement) {
    const source = this.resolveSourceSize(target || this.resolveCaptureElement(config.targetSelector));
    const maxWidth = Math.max(320, config.width || config.maxWidth || 1280);
    const maxHeight = Math.max(240, config.height || config.maxHeight || 720);
    const scale = Math.min(maxWidth / source.width, maxHeight / source.height, 1);

    return {
      width: Math.max(2, Math.round(source.width * scale)),
      height: Math.max(2, Math.round(source.height * scale)),
    };
  }

  private resolveBackgroundColor() {
    const bodyColor = window.getComputedStyle(document.body).backgroundColor;
    const rootColor = window.getComputedStyle(document.documentElement).backgroundColor;
    return bodyColor && bodyColor !== "rgba(0, 0, 0, 0)"
      ? bodyColor
      : rootColor && rootColor !== "rgba(0, 0, 0, 0)"
        ? rootColor
        : "#0f1115";
  }

  private drawFallbackFrame(message: string): void {
    if (!this.renderCanvas || !this.renderContext) return;
    const ctx = this.renderContext;
    const { width, height } = this.renderCanvas;
    ctx.fillStyle = "#111827";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#e5e7eb";
    ctx.font = "16px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(message.slice(0, 120), width / 2, height / 2);
    this.requestCanvasFrame();
  }

  private requestCanvasFrame(): void {
    const track = this.pageStream?.getVideoTracks()[0] as
      | (MediaStreamTrack & { requestFrame?: () => void })
      | undefined;
    track?.requestFrame?.();
  }

  private stopLocalStream(): void {
    this.stopRenderLoop();

    if (this.pageStream) {
      this.pageStream.getTracks().forEach((track) => track.stop());
      this.pageStream = null;
    }

    if (this.renderCanvas?.parentNode) {
      this.renderCanvas.parentNode.removeChild(this.renderCanvas);
    }
    this.renderCanvas = null;
    this.renderContext = null;
    this.renderingFrame = false;
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
    return this.status.isStreaming && this.peer !== null && this.pageStream !== null;
  }

  updateConfig(config: CanvasStreamConfig): void {
    this.activeConfig = {
      ...this.activeConfig,
      ...config,
    };
  }
}

export const canvasStreamService = new CanvasStreamService();
