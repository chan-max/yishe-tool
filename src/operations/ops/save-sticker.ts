import { registerOperation } from '../registry'
import {
  currentCanvasControllerInstance,
  canvasStickerOptions,
  renderingLoading,
} from '@/components/design/layout/canvas'
import { canvasToFile } from '@/common/transform'
import { uploadToCOS } from '@/api/cos'
import { createSticker } from '@/api'
import { useLoginStatusStore } from '@/store/stores/login'
import Utils from '@/common/utils'
import { captureCanvasForAI } from '@/ai/capture'
import { directChat } from '@/ai/direct-client'

// AI 分析画布生成贴纸信息
async function generateStickerMeta(): Promise<{ name: string; description: string; keywords: string }> {
  try {
    const imageBase64 = await captureCanvasForAI()
    
    const response = await directChat({
      messages: [
        {
          role: 'system',
          content: `你是一个设计分析助手。分析图片内容，生成贴纸的元数据信息。

返回 JSON 格式：
{
  "name": "简洁的贴纸名称（5-15字）",
  "description": "描述设计内容和风格（20-50字）",
  "keywords": "关键词1,关键词2,关键词3（3-5个，逗号分隔）"
}

只返回 JSON，不要其他内容。`
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: '请分析这个贴纸设计，生成名称、描述和关键词。' },
            { type: 'image_url', image_url: { url: imageBase64, detail: 'low' } }
          ]
        }
      ],
      temperature: 0.3,
      maxTokens: 200
    })

    const res = response as any
    let content = ''
    if (res?.choices?.[0]?.message?.content) {
      content = res.choices[0].message.content
    } else if (res?.data?.choices?.[0]?.message?.content) {
      content = res.data.choices[0].message.content
    } else if (typeof res?.data === 'string') {
      content = res.data
    }

    // 解析 JSON
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      return {
        name: parsed.name || 'AI生成贴纸',
        description: parsed.description || '',
        keywords: parsed.keywords || ''
      }
    }

    return { name: 'AI生成贴纸', description: '', keywords: '' }
  } catch (error) {
    console.error('[SaveSticker] AI 生成元数据失败:', error)
    return { name: 'AI生成贴纸', description: '', keywords: '' }
  }
}

registerOperation({
  id: 'canvas.updateAndSaveSticker',
  name: '更新并保存贴纸到素材库',
  description: '一键将当前画布内容渲染为贴纸图片，上传到 COS 并保存到素材库。如果不提供名称等信息，会自动分析画布生成。',
  group: '贴纸',
  params: [
    {
      name: 'name',
      label: '贴纸名称',
      type: 'string',
      placeholder: '输入贴纸名称（留空则自动生成）',
      description: '保存到素材库时的名称，留空会自动分析画布生成',
    },
    {
      name: 'description',
      label: '贴纸描述',
      type: 'string',
      placeholder: '输入贴纸描述（留空则自动生成）',
      description: '贴纸的描述信息，留空会自动分析画布生成',
    },
    {
      name: 'keywords',
      label: '关键字',
      type: 'string',
      placeholder: '多个关键字用逗号分隔（留空则自动生成）',
      description: '贴纸的搜索关键字，留空会自动分析画布生成',
    },
    {
      name: 'autoTrim',
      label: '自动裁剪',
      type: 'boolean',
      default: true,
      description: '自动去除白色/透明边框',
    },
  ],
  async execute(params, ctx) {
    let { name, description, keywords, autoTrim = true } = params

    const controller = currentCanvasControllerInstance.value
    if (!controller) {
      return { success: false, message: '画布控制器未初始化，请确保画布已加载' }
    }

    const loginStore = useLoginStatusStore()
    if (!loginStore.isLogin) {
      return { success: false, message: '请先登录后再保存贴纸到素材库' }
    }

    // 如果缺少信息，调用 AI 自动生成
    const needGenerate = !name || !description || !keywords
    if (needGenerate) {
      const meta = await generateStickerMeta()
      name = name || meta.name
      description = description || meta.description
      keywords = keywords || meta.keywords
    }

    try {
      await controller.activeUpdateRenderingCanvas()

      const waitForRender = () =>
        new Promise<void>((resolve, reject) => {
          let attempts = 0
          const check = () => {
            if (!controller.loading.value && !renderingLoading.value) {
              resolve()
              return
            }
            attempts++
            if (attempts > 200) {
              reject(new Error('画布渲染超时'))
              return
            }
            setTimeout(check, 50)
          }
          check()
        })

      await waitForRender()

      const canvasEl = controller.canvasEl
      if (!canvasEl) {
        return { success: false, message: '画布元素未找到' }
      }

      let file: File
      if (autoTrim) {
        const trimmedCanvas = Utils.trimCanvas(canvasEl)
        file = await canvasToFile(trimmedCanvas)
      } else {
        file = await canvasToFile(canvasEl)
      }

      const cos = await uploadToCOS({
        file,
        category: 'sticker',
        account: loginStore.userInfo?.account || loginStore.userInfo?.name || undefined,
        userId: loginStore.userInfo?.id,
      })

      await createSticker({
        url: cos.url,
        suffix: 'png',
        name: name || '未命名贴纸',
        description: description || '',
        keywords: keywords || '',
        isCustom: true,
        meta: {
          data: JSON.parse(JSON.stringify(canvasStickerOptions.value)),
        },
        userId: loginStore.userInfo?.id || null,
      })

      return {
        success: true,
        message: `贴纸「${name}」已保存到素材库`,
        data: { 
          name, 
          description,
          keywords,
          url: cos.url, 
          cosKey: cos.key,
          aiGenerated: needGenerate 
        },
      }
    } catch (err: any) {
      return {
        success: false,
        message: `保存失败: ${err?.message || '未知错误'}`,
      }
    }
  },
})
