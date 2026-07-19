export interface PreparedAIImage {
  preview: string;
  width?: number;
  height?: number;
  compressed: boolean;
}

const DEFAULT_MAX_DIMENSION = 1600;
const PASSTHROUGH_SIZE = 2 * 1024 * 1024;

function readFileAsDataUrl(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error || new Error("读取图片失败"));
    reader.readAsDataURL(file);
  });
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality?: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("图片压缩失败"))),
      type,
      quality,
    );
  });
}

async function decodeImage(file: File): Promise<{
  source: CanvasImageSource;
  width: number;
  height: number;
  dispose: () => void;
}> {
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file);
      return {
        source: bitmap,
        width: bitmap.width,
        height: bitmap.height,
        dispose: () => bitmap.close(),
      };
    } catch {
      // 某些图片格式由浏览器 Image 解码更稳定，继续使用兼容路径。
    }
  }

  const url = URL.createObjectURL(file);
  const image = new Image();
  image.decoding = "async";
  try {
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("图片解码失败"));
      image.src = url;
    });
  } catch (error) {
    URL.revokeObjectURL(url);
    throw error;
  }
  return {
    source: image,
    width: image.naturalWidth,
    height: image.naturalHeight,
    dispose: () => URL.revokeObjectURL(url),
  };
}

export async function prepareImageForAI(
  file: File,
  maxDimension = DEFAULT_MAX_DIMENSION,
): Promise<PreparedAIImage> {
  if (file.type === "image/svg+xml") {
    return {
      preview: await readFileAsDataUrl(file),
      compressed: false,
    };
  }

  const decoded = await decodeImage(file);
  try {
    const longestSide = Math.max(decoded.width, decoded.height);
    if (longestSide <= maxDimension && file.size <= PASSTHROUGH_SIZE) {
      return {
        preview: await readFileAsDataUrl(file),
        width: decoded.width,
        height: decoded.height,
        compressed: false,
      };
    }

    const scale = Math.min(1, maxDimension / longestSide);
    const width = Math.max(1, Math.round(decoded.width * scale));
    const height = Math.max(1, Math.round(decoded.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) throw new Error("无法创建图片压缩画布");
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.drawImage(decoded.source, 0, 0, width, height);

    const outputType = file.type === "image/png" ? "image/png" : "image/jpeg";
    const blob = await canvasToBlob(
      canvas,
      outputType,
      outputType === "image/jpeg" ? 0.84 : undefined,
    );
    return {
      preview: await readFileAsDataUrl(blob),
      width,
      height,
      compressed: true,
    };
  } finally {
    decoded.dispose();
  }
}
