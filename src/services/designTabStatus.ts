export type DesignTabStatus =
  | "idle"
  | "starting"
  | "working"
  | "uploading"
  | "completed"
  | "failed";

type ActiveDesignTabStatus = Exclude<DesignTabStatus, "idle">;
type StatusSymbol = "play" | "pen" | "upload" | "check" | "cross";

const STATUS_CONFIG: Record<
  ActiveDesignTabStatus,
  { label: string; color: string; symbol: StatusSymbol }
> = {
  starting: { label: "开始制作", color: "#d97706", symbol: "play" },
  working: { label: "制作中", color: "#2563eb", symbol: "pen" },
  uploading: { label: "上传图库", color: "#7c3aed", symbol: "upload" },
  completed: { label: "制作完成", color: "#16a34a", symbol: "check" },
  failed: { label: "制作失败", color: "#dc2626", symbol: "cross" },
};

const originalFavicons = new Map<
  HTMLLinkElement,
  { href: string; type: string }
>();
let baseTitle = typeof document !== "undefined" ? document.title : "";
let taskStatus: DesignTabStatus = "idle";
let effectiveStatus: DesignTabStatus = "idle";
let uploadDepth = 0;
let taskActive = false;
let taskDepth = 0;
let workingTimer: ReturnType<typeof setTimeout> | null = null;
let taskGeneration = 0;
let titleAnimationTimer: ReturnType<typeof setInterval> | null = null;
let titleAnimationStatus: ActiveDesignTabStatus | null = null;
let titleFrameIndex = 0;
let brandFavicon: HTMLImageElement | null = null;
let brandFaviconLoaded = false;

const ANIMATED_TITLE_STATUSES = new Set<DesignTabStatus>([
  "working",
  "uploading",
]);

function clearWorkingTimer() {
  if (!workingTimer) return;
  clearTimeout(workingTimer);
  workingTimer = null;
}

function getFaviconLinks(): HTMLLinkElement[] {
  if (typeof document === "undefined") return [];
  const links = Array.from(
    document.querySelectorAll<HTMLLinkElement>('link[rel~="icon"]'),
  );
  links.forEach((link) => {
    if (!originalFavicons.has(link)) {
      originalFavicons.set(link, {
        href: link.getAttribute("href") || "",
        type: link.getAttribute("type") || "",
      });
    }
  });
  return links;
}

function restoreOriginalFavicons() {
  getFaviconLinks().forEach((link) => {
    const original = originalFavicons.get(link);
    link.setAttribute("href", original?.href || "");
    if (original?.type) link.setAttribute("type", original.type);
    else link.removeAttribute("type");
  });
}

function ensureBrandFavicon() {
  if (typeof Image === "undefined" || brandFavicon) return;
  const image = new Image();
  brandFavicon = image;
  image.onload = () => {
    brandFaviconLoaded = true;
    renderStatusFavicon(effectiveStatus);
  };
  image.onerror = () => {
    brandFaviconLoaded = false;
  };
  image.src = "/favicon.png";
}

function drawStatusFavicon(
  color: string,
  symbol: StatusSymbol,
): string {
  if (
    typeof document === "undefined" ||
    !brandFavicon ||
    !brandFaviconLoaded
  ) {
    return "";
  }
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  ctx.drawImage(brandFavicon, 0, 0, 64, 64);
  ctx.save();
  ctx.shadowColor = "rgba(15, 23, 42, 0.3)";
  ctx.shadowBlur = 4;
  ctx.shadowOffsetY = 1;
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(49, 49, 15, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(49, 49, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#ffffff";
  ctx.fillStyle = "#ffffff";
  ctx.lineWidth = 2.8;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (symbol === "play") {
    ctx.beginPath();
    ctx.moveTo(46, 43);
    ctx.lineTo(56, 49);
    ctx.lineTo(46, 55);
    ctx.closePath();
    ctx.fill();
  } else if (symbol === "pen") {
    ctx.beginPath();
    ctx.moveTo(44, 54);
    ctx.lineTo(46, 49);
    ctx.lineTo(53, 42);
    ctx.lineTo(56, 45);
    ctx.lineTo(49, 52);
    ctx.stroke();
  } else if (symbol === "upload") {
    ctx.beginPath();
    ctx.moveTo(49, 56);
    ctx.lineTo(49, 42);
    ctx.moveTo(44, 47);
    ctx.lineTo(49, 42);
    ctx.lineTo(54, 47);
    ctx.stroke();
  } else if (symbol === "check") {
    ctx.beginPath();
    ctx.moveTo(43, 49);
    ctx.lineTo(47, 53);
    ctx.lineTo(55, 45);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.moveTo(44, 44);
    ctx.lineTo(54, 54);
    ctx.moveTo(54, 44);
    ctx.lineTo(44, 54);
    ctx.stroke();
  }

  return canvas.toDataURL("image/png");
}

function clearTitleAnimation() {
  if (titleAnimationTimer) {
    clearInterval(titleAnimationTimer);
    titleAnimationTimer = null;
  }
  titleAnimationStatus = null;
  titleFrameIndex = 0;
}

function writeAnimatedTitle(status: ActiveDesignTabStatus) {
  if (typeof document === "undefined") return;
  const label = STATUS_CONFIG[status].label;
  const frames = [
    `${label} ···`,
    `· ${label} ··`,
    `·· ${label} ·`,
    `··· ${label}`,
    `·· ${label} ·`,
    `· ${label} ··`,
  ];
  document.title = `【${frames[titleFrameIndex % frames.length]}】${baseTitle}`;
}

function renderDocumentTitle(status: DesignTabStatus) {
  if (typeof document === "undefined") return;
  if (status === "idle") {
    clearTitleAnimation();
    document.title = baseTitle;
    return;
  }

  if (!ANIMATED_TITLE_STATUSES.has(status)) {
    clearTitleAnimation();
    document.title = `[${STATUS_CONFIG[status].label}] ${baseTitle}`;
    return;
  }

  if (titleAnimationStatus !== status || !titleAnimationTimer) {
    clearTitleAnimation();
    titleAnimationStatus = status;
    writeAnimatedTitle(status);
    titleAnimationTimer = setInterval(() => {
      titleFrameIndex += 1;
      if (titleAnimationStatus) writeAnimatedTitle(titleAnimationStatus);
    }, 700);
    return;
  }
  writeAnimatedTitle(status);
}

function renderStatusFavicon(status: DesignTabStatus) {
  if (status === "idle") {
    restoreOriginalFavicons();
    return;
  }
  getFaviconLinks();
  ensureBrandFavicon();
  const config = STATUS_CONFIG[status];
  const favicon = drawStatusFavicon(config.color, config.symbol);
  if (!favicon) return;
  getFaviconLinks().forEach((link) => {
    link.type = "image/png";
    link.href = favicon;
  });
}

function renderDocumentStatus() {
  if (typeof document === "undefined") return;
  const nextStatus = uploadDepth > 0 ? "uploading" : taskStatus;
  effectiveStatus = nextStatus;
  renderDocumentTitle(nextStatus);
  renderStatusFavicon(nextStatus);
}

export function setBaseDocumentTitle(title: string) {
  baseTitle = String(title || "").trim();
  renderDocumentStatus();
}

export function beginDesignTabTask() {
  taskDepth += 1;
  taskActive = true;
  if (taskDepth > 1) {
    taskStatus = "working";
    clearWorkingTimer();
    renderDocumentStatus();
    return;
  }
  taskGeneration += 1;
  const generation = taskGeneration;
  taskStatus = "starting";
  clearWorkingTimer();
  renderDocumentStatus();
  workingTimer = setTimeout(() => {
    if (!taskActive || generation !== taskGeneration) return;
    taskStatus = "working";
    workingTimer = null;
    renderDocumentStatus();
  }, 800);
}

export function markDesignTabWorking() {
  if (!taskActive || taskStatus === "working") return;
  if (taskStatus !== "starting") {
    taskStatus = "working";
    renderDocumentStatus();
  }
}

export function completeDesignTabTask(success = true) {
  taskDepth = Math.max(0, taskDepth - 1);
  if (taskDepth > 0) {
    taskActive = true;
    taskStatus = "working";
    clearWorkingTimer();
    renderDocumentStatus();
    return;
  }
  taskGeneration += 1;
  taskActive = false;
  clearWorkingTimer();
  taskStatus = success ? "completed" : "failed";
  renderDocumentStatus();
}

export function beginLibraryUpload(): (success?: boolean) => void {
  uploadDepth += 1;
  let finished = false;
  renderDocumentStatus();

  return (success = true) => {
    if (finished) return;
    finished = true;
    uploadDepth = Math.max(0, uploadDepth - 1);
    if (!taskActive) {
      taskStatus = success ? "completed" : "failed";
    }
    renderDocumentStatus();
  };
}

export function getDesignTabStatus(): DesignTabStatus {
  return effectiveStatus;
}
