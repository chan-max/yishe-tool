import { registerOperation } from '../../registry'

registerOperation({
  id: 'canvas.addImage',
  name: '添加图片',
  description: '向画布添加一个图片元素，可设置图片 URL、适配方式、宽高等',
  group: '添加元素',
  params: [
    {
      name: 'imageUrl',
      label: '图片地址',
      type: 'string',
      required: true,
      placeholder: 'https://example.com/image.png',
      description: '图片的 URL 地址',
    },
    {
      name: 'objectFit',
      label: '适配方式',
      type: 'select',
      default: 'contain',
      options: [
        { label: '保持比例（contain）', value: 'contain' },
        { label: '裁剪填充（cover）', value: 'cover' },
        { label: '拉伸（fill）', value: 'fill' },
        { label: '原始大小（none）', value: 'none' },
      ],
      description: '图片在容器中的适配方式',
    },
    {
      name: 'width',
      label: '宽度',
      type: 'number',
      default: 100,
      min: 1,
      max: 10000,
      description: '宽度（vw 百分比，100=满画布宽度）',
    },
    {
      name: 'height',
      label: '高度',
      type: 'number',
      default: 100,
      min: 1,
      max: 10000,
      description: '高度（vh 百分比，100=满画布高度）',
    },
    {
      name: 'rotateZ',
      label: '旋转角度',
      type: 'number',
      default: 0,
      min: -360,
      max: 360,
      description: '旋转角度（度）',
    },
    {
      name: 'center',
      label: '居中',
      type: 'boolean',
      default: true,
      description: '是否在画布中居中',
    },
  ],
  execute(params, ctx) {
    const { imageUrl, objectFit, width, height, rotateZ, center } = params

    const extraOptions: Record<string, any> = {}

    extraOptions.imageInfo = { url: imageUrl }

    if (objectFit !== undefined) extraOptions.objectFit = objectFit
    if (width !== undefined) extraOptions.width = { value: width, unit: 'vw' }
    if (height !== undefined) extraOptions.height = { value: height, unit: 'vh' }

    if (rotateZ !== undefined) {
      extraOptions.transform = { rotateZ }
    }

    if (center !== undefined) {
      extraOptions.position = {
        center,
        verticalCenter: center,
        horizontalCenter: center,
        top: { value: 0, unit: 'px' },
        left: { value: 0, unit: 'px' },
        bottom: { value: 0, unit: 'px' },
        right: { value: 0, unit: 'px' },
      }
    }

    const id = ctx.addCanvasChild('image', extraOptions)
    return {
      success: true,
      message: '已添加图片元素',
      data: { id, type: 'image' },
    }
  },
})
