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

registerOperation({
  id: 'canvas.updateAndSaveSticker',
  name: '更新并保存贴纸到素材库',
  description: '一键将当前画布内容渲染为贴纸图片，上传到 COS 并保存到素材库',
  group: '贴纸',
  params: [
    {
      name: 'name',
      label: '贴纸名称',
      type: 'string',
      required: true,
      placeholder: '输入贴纸名称',
      description: '保存到素材库时的名称',
    },
    {
      name: 'description',
      label: '贴纸描述',
      type: 'string',
      placeholder: '输入贴纸描述',
      description: '贴纸的描述信息',
    },
    {
      name: 'keywords',
      label: '关键字',
      type: 'string',
      placeholder: '多个关键字用逗号分隔',
      description: '贴纸的搜索关键字',
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
    const { name, description, keywords, autoTrim = true } = params

    const controller = currentCanvasControllerInstance.value
    if (!controller) {
      return { success: false, message: '画布控制器未初始化，请确保画布已加载' }
    }

    const loginStore = useLoginStatusStore()
    if (!loginStore.isLogin) {
      return { success: false, message: '请先登录后再保存贴纸到素材库' }
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
        data: { name, url: cos.url, cosKey: cos.key },
      }
    } catch (err: any) {
      return {
        success: false,
        message: `保存失败: ${err?.message || '未知错误'}`,
      }
    }
  },
})
