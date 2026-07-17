import { registerOperation } from "../registry";
import {
  currentCanvasControllerInstance,
  canvasStickerOptions,
} from "@/components/design/layout/canvas";
import { canvasToFile } from "@/common/transform";
import { uploadToCOS } from "@/api/cos";
import { createSticker } from "@/api";
import { useLoginStatusStore } from "@/store/stores/login";
import Utils from "@/common/utils";
import { captureCanvasForAI, renderCurrentCanvasNow } from "@/ai/capture";
import { directChat } from "@/ai/direct-client";
import { AI_TIMEOUTS } from "@/ai/shared/timeout";

// 批量任务状态
let batchTaskState: {
  total: number;
  completed: number;
  description: string;
} | null = null;

const DEFAULT_HTML_TEMPLATE_MARKER = "主 HTML 模板";

function getCanvasDesignChildren() {
  return (canvasStickerOptions.value.children || []).filter(
    (child: any) => child?.type !== "canvas",
  );
}

function validateCanvasBeforeSave(): string {
  const children = getCanvasDesignChildren();
  if (!children.length) {
    return "当前画布没有可保存的设计内容";
  }

  const htmlChild = children.find(
    (child: any) => child?.id === "this_is_html_id" || child?.type === "html",
  );
  const htmlContent = String(htmlChild?.htmlContent || "").trim();
  const hasOnlyDefaultHtml =
    children.length === 1 &&
    htmlChild &&
    (!htmlContent || htmlContent.includes(DEFAULT_HTML_TEMPLATE_MARKER));

  if (hasOnlyDefaultHtml) {
    return "当前画布仍是默认 HTML 空模板，未保存。请等待设计生成完成后再保存";
  }

  return "";
}

function stripHtmlText(html: string): string {
  return String(html || "")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function inferStickerMetaFromCanvas() {
  const htmlChild = getCanvasDesignChildren().find(
    (child: any) => child?.type === "html",
  );
  const plainText = stripHtmlText(htmlChild?.htmlContent || "");
  const title = plainText.slice(0, 18) || "AI生成贴纸";
  const description = plainText
    ? `基于当前画布生成的贴纸设计：${plainText.slice(0, 80)}`
    : "基于当前画布生成的贴纸设计";

  return {
    name: title,
    description,
    keywords: ["贴纸", "AI生成", title].filter(Boolean).join(","),
  };
}

// 批量任务工具
registerOperation({
  id: "canvas.startBatchTask",
  name: "开始批量任务",
  description:
    "开始一个批量创建任务。调用后系统会追踪任务进度，每次保存后会提示还需要完成多少个。在批量创建素材前必须先调用此工具。",
  group: "贴纸",
  params: [
    {
      name: "total",
      label: "总数",
      type: "number",
      required: true,
      description: "需要创建的素材总数",
    },
    {
      name: "description",
      label: "任务描述",
      type: "string",
      description: "任务描述，如：创建3个渐变素材",
    },
  ],
  async execute(params) {
    const { total, description } = params;

    if (!total || total < 1) {
      return { success: false, message: "总数必须大于0" };
    }

    batchTaskState = {
      total: Number(total),
      completed: 0,
      description: description || `创建${total}个素材`,
    };

    return {
      success: true,
      message: `批量任务已开始：${batchTaskState.description}`,
      data: {
        total: batchTaskState.total,
        description: batchTaskState.description,
        hint: `请开始创建第 1/${total} 个素材，完成后调用 canvas.updateAndSaveSticker 保存。`,
      },
    };
  },
});

// 获取批量任务进度
registerOperation({
  id: "canvas.getBatchProgress",
  name: "获取批量任务进度",
  description: "获取当前批量任务的进度信息。",
  group: "贴纸",
  params: [],
  async execute() {
    if (!batchTaskState) {
      return { success: true, message: "当前没有进行中的批量任务", data: null };
    }

    return {
      success: true,
      message: "批量任务进度",
      data: {
        total: batchTaskState.total,
        completed: batchTaskState.completed,
        remaining: batchTaskState.total - batchTaskState.completed,
        description: batchTaskState.description,
      },
    };
  },
});

// AI 分析画布生成贴纸信息
async function generateStickerMeta(): Promise<{
  name: string;
  description: string;
  keywords: string;
}> {
  try {
    const imageBase64 = await captureCanvasForAI();

    const response = await directChat({
      messages: [
        {
          role: "system",
          content: `你是一个设计分析助手。分析图片内容，生成贴纸的元数据信息。

返回 JSON 格式：
{
  "name": "简洁的贴纸名称（5-15字）",
  "description": "描述设计内容和风格（20-50字）",
  "keywords": "关键词1,关键词2,关键词3（3-5个，逗号分隔）"
}

只返回 JSON，不要其他内容。`,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "请分析这个贴纸设计，生成名称、描述和关键词。",
            },
            {
              type: "image_url",
              image_url: { url: imageBase64, detail: "low" },
            },
          ],
        },
      ],
      temperature: 0.3,
      maxTokens: 200,
      timeoutMs: AI_TIMEOUTS.quickEvaluate,
    });

    const res = response as any;
    let content = "";
    if (res?.choices?.[0]?.message?.content) {
      content = res.choices[0].message.content;
    } else if (res?.data?.choices?.[0]?.message?.content) {
      content = res.data.choices[0].message.content;
    } else if (typeof res?.data === "string") {
      content = res.data;
    }

    // 解析 JSON
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        name: parsed.name || "AI生成贴纸",
        description: parsed.description || "",
        keywords: parsed.keywords || "",
      };
    }

    return { name: "AI生成贴纸", description: "", keywords: "" };
  } catch (error) {
    console.error("[SaveSticker] AI 生成元数据失败:", error);
    return { name: "AI生成贴纸", description: "", keywords: "" };
  }
}

registerOperation({
  id: "canvas.updateAndSaveSticker",
  name: "更新并保存贴纸到素材库",
  description:
    "一键将当前画布内容渲染为贴纸图片，上传到 COS 并保存到素材库。名称等信息可直接传入；不传时会从画布文字生成基础元数据，不额外分析画布。",
  group: "贴纸",
  params: [
    {
      name: "name",
      label: "贴纸名称",
      type: "string",
      placeholder: "输入贴纸名称（留空则使用画布内容生成）",
      description: "保存到素材库时的名称，留空会从画布内容生成基础名称",
    },
    {
      name: "description",
      label: "贴纸描述",
      type: "string",
      placeholder: "输入贴纸描述（留空则使用画布内容生成）",
      description: "贴纸的描述信息，留空会从画布内容生成基础描述",
    },
    {
      name: "keywords",
      label: "关键字",
      type: "string",
      placeholder: "多个关键字用逗号分隔（留空则使用画布内容生成）",
      description: "贴纸的搜索关键字，留空会从画布内容生成基础关键词",
    },
    {
      name: "autoTrim",
      label: "自动裁剪",
      type: "boolean",
      default: true,
      description: "自动去除白色/透明边框",
    },
    {
      name: "folderId",
      label: "文件夹ID",
      type: "string",
      placeholder: "输入文件夹ID（留空则保存到根目录）",
      description: "指定保存到哪个文件夹，留空则保存到根目录",
    },
    {
      name: "autoGenerateMeta",
      label: "AI生成元数据",
      type: "boolean",
      default: false,
      description:
        "是否通过视觉分析自动生成名称、描述和关键词。默认关闭，避免保存时额外分析画布。",
    },
  ],
  async execute(params, ctx) {
    let {
      name,
      description,
      keywords,
      autoTrim = true,
      folderId,
      autoGenerateMeta = false,
    } = params;

    const controller = currentCanvasControllerInstance.value;
    if (!controller) {
      return {
        success: false,
        message: "画布控制器未初始化，请确保画布已加载",
      };
    }

    const loginStore = useLoginStatusStore();
    if (!loginStore.isLogin) {
      return { success: false, message: "请先登录后再保存贴纸到素材库" };
    }

    try {
      const validationError = validateCanvasBeforeSave();
      if (validationError) {
        return { success: false, message: validationError };
      }

      await renderCurrentCanvasNow({ timeoutMs: AI_TIMEOUTS.batchSave });

      const postRenderValidationError = validateCanvasBeforeSave();
      if (postRenderValidationError) {
        return { success: false, message: postRenderValidationError };
      }

      const needGenerate =
        !!autoGenerateMeta && (!name || !description || !keywords);
      if (needGenerate) {
        const meta = await generateStickerMeta();
        name = name || meta.name;
        description = description || meta.description;
        keywords = keywords || meta.keywords;
      }

      const fallbackMeta = inferStickerMetaFromCanvas();
      name = name || fallbackMeta.name;
      description = description || fallbackMeta.description;
      keywords = keywords || fallbackMeta.keywords;

      const canvasEl = controller.canvasEl;
      if (!canvasEl) {
        return { success: false, message: "画布元素未找到" };
      }

      let file: File;
      if (autoTrim) {
        const trimmedCanvas = Utils.trimCanvas(canvasEl);
        file = await canvasToFile(trimmedCanvas);
      } else {
        file = await canvasToFile(canvasEl);
      }

      const cos = await uploadToCOS({
        file,
        category: "sticker",
        account:
          loginStore.userInfo?.account ||
          loginStore.userInfo?.name ||
          undefined,
        userId: loginStore.userInfo?.id,
      });

      await createSticker({
        url: cos.url,
        suffix: "png",
        name: name || "未命名贴纸",
        description: description || "",
        keywords: keywords || "",
        isCustom: true,
        folderId: folderId || null,
        meta: {
          data: JSON.parse(JSON.stringify(canvasStickerOptions.value)),
        },
        userId: loginStore.userInfo?.id || null,
      });

      const nextBatchProgress = batchTaskState
        ? {
            total: batchTaskState.total,
            completed: Math.min(
              batchTaskState.completed + 1,
              batchTaskState.total,
            ),
            remaining: Math.max(
              batchTaskState.total - batchTaskState.completed - 1,
              0,
            ),
          }
        : null;

      if (batchTaskState && nextBatchProgress) {
        batchTaskState.completed = nextBatchProgress.completed;
        if (batchTaskState.completed >= batchTaskState.total) {
          batchTaskState = null;
        }
      }

      return {
        success: true,
        message: `贴纸「${name}」已保存到素材库`,
        data: {
          name,
          description,
          keywords,
          url: cos.url,
          cosKey: cos.key,
          aiGenerated: needGenerate,
          // 批量任务进度
          batchProgress: nextBatchProgress,
        },
      };
    } catch (err: any) {
      return {
        success: false,
        message: `保存失败: ${err?.message || "未知错误"}`,
      };
    }
  },
});
