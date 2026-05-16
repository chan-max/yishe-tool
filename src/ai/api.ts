import { apiInstance } from "@/api/apiInstance";
import { Url } from "@/api/url";
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

export async function aiChat(options: AiChatOptions): Promise<AiChatResponse> {
  const {
    featureCode,
    messages,
    model,
    keyId,
    stream,
    temperature,
    maxTokens,
    ...rest
  } = options;
  const payload: Record<string, any> = {
    featureCode,
    messages,
    stream: stream ?? false,
    ...rest,
  };
  if (model) payload.model = model;
  if (keyId != null) payload.keyId = keyId;
  if (temperature != null) payload.temperature = temperature;
  if (maxTokens != null) payload.maxTokens = maxTokens;

  const res = await apiInstance.post(Url.AI_CHAT, payload);
  return res.data;
}

export async function aiText(options: AiTextOptions): Promise<AiChatResponse> {
  const {
    featureCode,
    prompt,
    systemPrompt,
    model,
    keyId,
    stream,
    temperature,
    maxTokens,
    responseFormat,
  } = options;
  const payload: Record<string, any> = {
    featureCode,
    prompt,
    stream: stream ?? false,
  };
  if (systemPrompt) payload.systemPrompt = systemPrompt;
  if (model) payload.model = model;
  if (keyId != null) payload.keyId = keyId;
  if (temperature != null) payload.temperature = temperature;
  if (maxTokens != null) payload.maxTokens = maxTokens;
  if (responseFormat) payload.responseFormat = responseFormat;

  const res = await apiInstance.post(Url.AI_TEXT, payload);
  return res.data;
}

export async function aiVision(
  options: AiVisionOptions,
): Promise<AiChatResponse> {
  const { featureCode, prompt, imageUrls, systemPrompt, model, keyId } =
    options;
  const payload: Record<string, any> = {
    featureCode,
    prompt,
    imageUrls,
  };
  if (systemPrompt) payload.systemPrompt = systemPrompt;
  if (model) payload.model = model;
  if (keyId != null) payload.keyId = keyId;

  const res = await apiInstance.post(Url.AI_VISION, payload);
  return res.data;
}

export async function aiGenerateImage(
  options: AiTtiOptions,
): Promise<AiTtiResult> {
  const { featureCode, prompt, negativePrompt, size, n, style, model, keyId } =
    options;
  const payload: Record<string, any> = {
    featureCode,
    prompt,
  };
  if (negativePrompt) payload.negativePrompt = negativePrompt;
  if (size) payload.size = size;
  if (n != null) payload.n = n;
  if (style) payload.style = style;
  if (model) payload.model = model;
  if (keyId != null) payload.keyId = keyId;

  const res = await apiInstance.post(Url.AI_TTI, payload);
  return res.data;
}

export async function aiGetTaskStatus(
  taskId: string,
  featureCode?: string,
  keyId?: number | null,
): Promise<any> {
  const payload: Record<string, any> = { taskId };
  if (featureCode) payload.featureCode = featureCode;
  if (keyId != null) payload.keyId = keyId;

  const res = await apiInstance.post(Url.AI_TTI_TASK_STATUS, payload);
  return res.data;
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
