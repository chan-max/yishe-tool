import { apiInstance } from "@/api/apiInstance";
import { Url } from "@/api/url";
import { getAIConfig } from "./direct-client";
import { DESIGN_TOOL_FEATURE_CODES } from "./feature-codes";
import type {
  AiChatOptions,
  AiTextOptions,
  AiVisionOptions,
  AiTtiOptions,
  AiTtiResult,
  AiChatResponse,
} from "./types";

function unwrapResponseData<T>(response: any): T {
  return (response?.data?.data ?? response?.data ?? response) as T;
}

/**
 * 构建 OpenAI 风格的响应对象（从 fetch 响应解析）
 */
function buildChatResponse(data: any, model: string): AiChatResponse {
  return {
    id: data.id || `chatcmpl-${Date.now()}`,
    object: data.object || "chat.completion",
    created: data.created || Math.floor(Date.now() / 1000),
    model: data.model || model,
    choices: data.choices || [],
    usage: data.usage,
  };
}

export async function aiChat(options: AiChatOptions): Promise<AiChatResponse> {
  const {
    messages,
    model,
    keyId,
    featureCode,
    temperature,
    maxTokens,
    ...rest
  } = options;

  // 获取 AI 配置（前端直接调用）
  const config = await getAIConfig(keyId, featureCode || DESIGN_TOOL_FEATURE_CODES.chat);

  // 构建请求体
  const body: Record<string, any> = {
    model: model || config.model,
    messages,
    temperature: temperature ?? 0.7,
    ...rest,
  };

  if (maxTokens) body.max_tokens = maxTokens;

  // 直接调用 OpenAI API
  const response = await fetch(`${config.baseURL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AI 请求失败: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return buildChatResponse(data, body.model);
}

export async function aiText(options: AiTextOptions): Promise<AiChatResponse> {
  const {
    prompt,
    systemPrompt,
    model,
    keyId,
    featureCode,
    temperature,
    maxTokens,
    responseFormat,
  } = options;

  // 获取 AI 配置（前端直接调用）
  const config = await getAIConfig(keyId, featureCode || DESIGN_TOOL_FEATURE_CODES.chat);

  // 构建消息
  const messages: Array<{ role: string; content: string }> = [];
  if (systemPrompt) {
    messages.push({ role: "system", content: systemPrompt });
  }
  messages.push({ role: "user", content: prompt });

  // 构建请求体
  const body: Record<string, any> = {
    model: model || config.model,
    messages,
    temperature: temperature ?? 0.7,
  };

  if (maxTokens) body.max_tokens = maxTokens;
  if (responseFormat) body.response_format = responseFormat;

  // 直接调用 OpenAI API
  const response = await fetch(`${config.baseURL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AI 请求失败: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return buildChatResponse(data, body.model);
}

export async function aiVision(
  options: AiVisionOptions,
): Promise<AiChatResponse> {
  const { prompt, imageUrls, systemPrompt, model, keyId, featureCode } = options;

  // 获取 AI 配置（前端直接调用）
  const config = await getAIConfig(keyId, featureCode || DESIGN_TOOL_FEATURE_CODES.chat);

  // 构建消息内容（支持图文）
  const contentParts: Array<{ type: string; text?: string; image_url?: { url: string } }> = [];
  
  // 添加图片
  for (const url of imageUrls) {
    contentParts.push({ type: "image_url", image_url: { url } });
  }
  
  // 添加文本
  contentParts.push({ type: "text", text: prompt });

  const messages: Array<{ role: string; content: any }> = [];
  if (systemPrompt) {
    messages.push({ role: "system", content: systemPrompt });
  }
  messages.push({ role: "user", content: contentParts });

  // 构建请求体
  const body: Record<string, any> = {
    model: model || config.model,
    messages,
    temperature: 0.7,
  };

  // 直接调用 OpenAI API
  const response = await fetch(`${config.baseURL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AI 请求失败: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return buildChatResponse(data, body.model);
}

export async function aiGenerateImage(
  options: AiTtiOptions,
): Promise<AiTtiResult> {
  const { prompt, negativePrompt, size, n, style, model, keyId, featureCode } = options;

  // 获取 AI 配置（前端直接调用）
  const config = await getAIConfig(keyId, featureCode || DESIGN_TOOL_FEATURE_CODES.image);

  // 构建请求体（OpenAI Images API）
  const body: Record<string, any> = {
    model: model || config.model,
    prompt,
    n: n || 1,
  };

  if (size) body.size = size;
  if (style) body.style = style;

  // 直接调用 OpenAI Images API
  const response = await fetch(`${config.baseURL}/images/generations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AI 图片生成失败: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  
  // 解析返回的图片
  const images = (data.data || []).map((item: any) => ({
    url: item.url || item.b64_json ? `data:image/png;base64,${item.b64_json}` : "",
  })).filter((img: any) => img.url);

  return {
    images,
    raw: data,
    usedModel: body.model,
    usedKeyId: keyId,
  };
}

export async function aiGetTaskStatus(
  taskId: string,
  featureCode?: string,
  keyId?: number | null,
): Promise<any> {
  // 获取 AI 配置（前端直接调用）
  const config = await getAIConfig(keyId, featureCode || DESIGN_TOOL_FEATURE_CODES.image);

  // 注：OpenAI API 是同步的，这个函数主要用于兼容旧的异步任务系统
  // 如果使用的是支持异步任务的提供商，需要自行实现状态查询
  console.warn(
    "[aiGetTaskStatus] OpenAI API 为同步调用，此函数仅返回兼容响应"
  );

  return {
    taskId,
    status: "completed",
    result: null,
  };
}

export async function aiGetUsageOptions(): Promise<any[]> {
  const res = await apiInstance.get(Url.AI_API_KEY_USAGE_OPTIONS);
  return unwrapResponseData<any[]>(res);
}

export async function aiGetFeatureRegistry(): Promise<any[]> {
  const res = await apiInstance.get(Url.AI_FEATURE_REGISTRY);
  return unwrapResponseData<any[]>(res);
}

/**
 * 获取用户的 API Key（通用，支持多种功能）
 * @param feature 功能标识，如 'ai_chat', 'ai_image', 'sms', 'email' 等
 * @param keyId 指定 key ID（可选）
 */
export async function getUserApiKey(
  feature: string,
  keyId?: number | null,
): Promise<{
  encryptedKey: string;
  config: Record<string, any>;
  name: string;
}> {
  const payload: Record<string, any> = { feature };
  if (keyId != null) payload.keyId = keyId;

  const res = await apiInstance.post(Url.USER_GET_API_KEY, payload);
  return unwrapResponseData<{
    encryptedKey: string;
    config: Record<string, any>;
    name: string;
  }>(res);
}
