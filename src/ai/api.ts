import { apiInstance } from '@/api/apiInstance'
import { Url } from '@/api/url'
import type {
  AiChatOptions,
  AiTextOptions,
  AiVisionOptions,
  AiTtiOptions,
  AiTtiResult,
  AiChatResponse,
} from './types'

export async function aiChat(options: AiChatOptions): Promise<AiChatResponse> {
  const { featureCode, messages, model, keyId, stream, temperature, maxTokens, ...rest } = options
  const payload: Record<string, any> = {
    featureCode,
    messages,
    stream: stream ?? false,
    ...rest,
  }
  if (model) payload.model = model
  if (keyId != null) payload.keyId = keyId
  if (temperature != null) payload.temperature = temperature
  if (maxTokens != null) payload.maxTokens = maxTokens

  const res = await apiInstance.post(Url.AI_CHAT, payload)
  return res.data
}

export async function aiText(options: AiTextOptions): Promise<AiChatResponse> {
  const { featureCode, prompt, systemPrompt, model, keyId, stream, temperature, maxTokens, responseFormat } = options
  const payload: Record<string, any> = {
    featureCode,
    prompt,
    stream: stream ?? false,
  }
  if (systemPrompt) payload.systemPrompt = systemPrompt
  if (model) payload.model = model
  if (keyId != null) payload.keyId = keyId
  if (temperature != null) payload.temperature = temperature
  if (maxTokens != null) payload.maxTokens = maxTokens
  if (responseFormat) payload.responseFormat = responseFormat

  const res = await apiInstance.post(Url.AI_TEXT, payload)
  return res.data
}

export async function aiVision(options: AiVisionOptions): Promise<AiChatResponse> {
  const { featureCode, prompt, imageUrls, systemPrompt, model, keyId } = options
  const payload: Record<string, any> = {
    featureCode,
    prompt,
    imageUrls,
  }
  if (systemPrompt) payload.systemPrompt = systemPrompt
  if (model) payload.model = model
  if (keyId != null) payload.keyId = keyId

  const res = await apiInstance.post(Url.AI_VISION, payload)
  return res.data
}

export async function aiGenerateImage(options: AiTtiOptions): Promise<AiTtiResult> {
  const { featureCode, prompt, negativePrompt, size, n, style, model, keyId } = options
  const payload: Record<string, any> = {
    featureCode,
    prompt,
  }
  if (negativePrompt) payload.negativePrompt = negativePrompt
  if (size) payload.size = size
  if (n != null) payload.n = n
  if (style) payload.style = style
  if (model) payload.model = model
  if (keyId != null) payload.keyId = keyId

  const res = await apiInstance.post(Url.AI_TTI, payload)
  return res.data
}

export async function aiGetTaskStatus(taskId: string, featureCode?: string, keyId?: number | null): Promise<any> {
  const payload: Record<string, any> = { taskId }
  if (featureCode) payload.featureCode = featureCode
  if (keyId != null) payload.keyId = keyId

  const res = await apiInstance.post(Url.AI_TTI_TASK_STATUS, payload)
  return res.data
}

export async function aiGetUsageOptions(): Promise<any[]> {
  const res = await apiInstance.get(Url.AI_API_KEY_USAGE_OPTIONS)
  return res.data
}

export async function aiGetFeatureRegistry(): Promise<any[]> {
  const res = await apiInstance.get(Url.AI_FEATURE_REGISTRY)
  return res.data
}
