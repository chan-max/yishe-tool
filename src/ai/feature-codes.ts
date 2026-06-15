export interface AiFeatureItem {
  code: string
  label: string
  group: string
  scene?: string
  description?: string
}

export const AI_FEATURE_REGISTRY: AiFeatureItem[] = [
  {
    code: 'design.tool.ai.chat',
    label: '设计工具 AI 对话',
    group: '设计端 / 设计工具',
    scene: 'design',
    description: '设计工具的 AI 对话专用 Key，覆盖设计助手对话、文本生成、图文理解等设计端 AI 能力',
  },
  {
    code: 'ai.chat.general',
    label: '外部通用对话',
    group: '开放能力 / 外部调用',
    scene: 'chat',
    description: '通用 LLM 对话接口',
  },
  {
    code: 'ai.chat.text',
    label: '外部文本生成',
    group: '开放能力 / 外部调用',
    scene: 'text',
    description: '简易 prompt 文本生成',
  },
  {
    code: 'ai.chat.vision',
    label: '外部图文理解',
    group: '开放能力 / 外部调用',
    scene: 'vision',
    description: '图片识别/理解',
  },
  {
    code: 'ai.tti.generate',
    label: '文生图生成',
    group: 'AI 创作',
    scene: 'tti',
    description: '文本生成图片',
  },
  {
    code: 'ai.tts.generate',
    label: '语音合成',
    group: 'AI 创作',
    scene: 'tts',
    description: '文字转语音',
  },
  {
    code: 'ai.tts.voice.manage',
    label: '自定义音色管理',
    group: 'AI 创作',
    scene: 'tts',
    description: '创建、查询与删除自定义音色',
  },
]

export const DESIGN_TOOL_FEATURE_CODES = {
  chat: 'design.tool.ai.chat',
} as const

export type DesignToolFeatureCode = typeof DESIGN_TOOL_FEATURE_CODES[keyof typeof DESIGN_TOOL_FEATURE_CODES]

export function getFeatureByCode(code: string): AiFeatureItem | undefined {
  return AI_FEATURE_REGISTRY.find((f) => f.code === code)
}

export function getFeaturesByGroup(group: string): AiFeatureItem[] {
  return AI_FEATURE_REGISTRY.filter((f) => f.group === group)
}

export function getFeaturesByScene(scene: string): AiFeatureItem[] {
  return AI_FEATURE_REGISTRY.filter((f) => f.scene === scene)
}
