export interface AiChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string | AiChatContentPart[]
}

export interface AiChatContentPart {
  type: 'text' | 'image_url'
  text?: string
  image_url?: { url: string }
}

export interface AiChatOptions {
  featureCode: string
  messages: AiChatMessage[]
  model?: string
  keyId?: number | null
  stream?: boolean
  temperature?: number
  maxTokens?: number
  [key: string]: any
}

export interface AiTextOptions {
  featureCode: string
  prompt: string
  systemPrompt?: string
  model?: string
  keyId?: number | null
  stream?: boolean
  temperature?: number
  maxTokens?: number
  responseFormat?: any
  [key: string]: any
}

export interface AiVisionOptions {
  featureCode: string
  prompt: string
  imageUrls: string[]
  systemPrompt?: string
  model?: string
  keyId?: number | null
  [key: string]: any
}

export interface AiTtiOptions {
  featureCode: string
  prompt: string
  negativePrompt?: string
  size?: string
  n?: number
  style?: string
  model?: string
  keyId?: number | null
}

export interface AiTtiResult {
  images: Array<{ url: string }>
  raw: any
  taskId?: string
  usedModel?: string
  usedKeyId?: number | null
}

export interface AiChatResponse {
  id: string
  object: string
  created: number
  model: string
  choices: AiChatChoice[]
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export interface AiChatChoice {
  index: number
  message: AiChatMessage
  finish_reason: string
}

export interface AiStreamChunk {
  id: string
  object: string
  created: number
  model: string
  choices: AiStreamChoice[]
}

export interface AiStreamChoice {
  index: number
  delta: Partial<AiChatMessage>
  finish_reason: string | null
}

export interface AiRuntimeConfig {
  name: string
  apiKey: string
  baseURL: string
  model: string
  maxTokens?: number
  temperature?: number
  source: 'user' | 'public'
  keyId?: number | null
}

export interface AiMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
  loading?: boolean
  error?: string
  featureCode?: string
  meta?: Record<string, any>
}

export interface AiConversation {
  id: string
  title: string
  featureCode: string
  messages: AiMessage[]
  createdAt: number
  updatedAt: number
}
