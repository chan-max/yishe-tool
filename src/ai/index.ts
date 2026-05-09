export { AI_FEATURE_REGISTRY, DESIGN_TOOL_FEATURE_CODES, getFeatureByCode, getFeaturesByGroup, getFeaturesByScene } from './feature-codes'
export type { AiFeatureItem, DesignToolFeatureCode } from './feature-codes'

export type {
  AiChatMessage,
  AiChatContentPart,
  AiChatOptions,
  AiTextOptions,
  AiVisionOptions,
  AiTtiOptions,
  AiTtiResult,
  AiChatResponse,
  AiChatChoice,
  AiStreamChunk,
  AiStreamChoice,
  AiRuntimeConfig,
  AiMessage,
  AiConversation,
} from './types'

export {
  aiChat,
  aiText,
  aiVision,
  aiGenerateImage,
  aiGetTaskStatus,
  aiGetUsageOptions,
  aiGetFeatureRegistry,
} from './api'

export {
  aiConversations,
  aiCurrentConversationId,
  currentConversation,
  isAiPanelOpen,
  aiIsProcessing,
  createConversation,
  setCurrentConversation,
  deleteConversation,
  clearConversations,
  addMessage,
  updateMessage,
  appendToMessage,
} from './store'
