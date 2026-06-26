import { registerOperation } from '../registry'
import { getStickerList } from '@/api'

registerOperation({
  id: 'resource.searchSticker',
  name: '搜索素材库贴纸',
  description: `从素材库搜索贴纸，返回贴纸列表（含 id、name、url、isCustom、isCutout、width、height 等）。

搜索到贴纸后，用 canvas.loadSticker(stickerId) 加载到画布：
- isCustom=true 的贴纸会加载完整元素树，可二次编辑（改文字、颜色、布局等）
- isCustom=false 的贴纸作为图片加载

典型工作流：
1. resource.searchSticker({ keyword: "励志" }) → 拿到 id
2. canvas.loadSticker(id) → 加载到画布
3. element.setTextContent / setTextColor 等修改
4. canvas.updateAndSaveSticker → 保存为新贴纸`,
  group: '资源',
  params: [
    {
      name: 'keyword',
      label: '搜索关键词',
      type: 'string',
      placeholder: '输入关键词搜索贴纸',
      description: '搜索关键词，匹配贴纸名称、描述、关键字',
    },
    {
      name: 'isCustom',
      label: '仅自定义贴纸',
      type: 'boolean',
      description: 'true = 仅返回自定义贴纸（可二次编辑），false = 仅返回系统贴纸，不填 = 全部',
    },
    {
      name: 'isCutout',
      label: '仅抠图素材',
      type: 'boolean',
      description: 'true = 仅返回已抠图的素材（无背景，适合叠加使用）',
    },
    {
      name: 'aspectRatio',
      label: '宽高比',
      type: 'select',
      options: [
        { label: '不限', value: 'any' },
        { label: '正方形 (1:1)', value: '1:1' },
        { label: '横向 (16:9)', value: '16:9' },
        { label: '横向 (4:3)', value: '4:3' },
        { label: '横向 (3:2)', value: '3:2' },
        { label: '竖向 (9:16)', value: '9:16' },
        { label: '竖向 (3:4)', value: '3:4' },
        { label: '竖向 (2:3)', value: '2:3' },
      ],
      default: 'any',
      description: '按宽高比筛选。适合需要特定比例素材的场景（如头像用1:1，手机壁纸用9:16）',
    },
    {
      name: 'aspectRatioTolerance',
      label: '宽高比容差',
      type: 'number',
      default: 0.15,
      min: 0.01,
      max: 0.5,
      description: '宽高比匹配的容差范围，0.15 表示 ±15%。值越大匹配越宽松',
    },
    {
      name: 'minWidth',
      label: '最小宽度',
      type: 'number',
      min: 0,
      placeholder: '不限',
      description: '筛选宽度 >= 此值的贴纸（px）。用于排除过小的素材',
    },
    {
      name: 'maxWidth',
      label: '最大宽度',
      type: 'number',
      min: 0,
      placeholder: '不限',
      description: '筛选宽度 <= 此值的贴纸（px）',
    },
    {
      name: 'minHeight',
      label: '最小高度',
      type: 'number',
      min: 0,
      placeholder: '不限',
      description: '筛选高度 >= 此值的贴纸（px）',
    },
    {
      name: 'maxHeight',
      label: '最大高度',
      type: 'number',
      min: 0,
      placeholder: '不限',
      description: '筛选高度 <= 此值的贴纸（px）',
    },
    {
      name: 'folderId',
      label: '文件夹ID',
      type: 'string',
      placeholder: '不限',
      description: '指定搜索某个文件夹下的贴纸',
    },
    {
      name: 'limit',
      label: '返回数量',
      type: 'number',
      default: 10,
      min: 1,
      max: 50,
      description: '返回的贴纸数量，默认 10',
    },
  ],
  async execute(params) {
    const {
      keyword,
      isCustom,
      isCutout,
      aspectRatio,
      aspectRatioTolerance = 0.15,
      minWidth,
      maxWidth,
      minHeight,
      maxHeight,
      folderId,
      limit = 10,
    } = params

    // 构建后端 API 请求参数
    const apiParams: Record<string, any> = {
      currentPage: 1,
      pageSize: Math.min(limit * 3, 100), // 多取一些，本地再过滤
    }

    if (keyword) {
      apiParams.searchText = keyword
    }
    if (isCustom !== undefined) {
      apiParams.isCustom = isCustom
    }
    if (isCutout !== undefined) {
      apiParams.isCutout = isCutout
    }
    if (folderId) {
      apiParams.folderId = folderId
    }

    try {
      const res = await getStickerList(apiParams)
      let list = res.list || []

      // 本地过滤：宽高范围
      if (minWidth !== undefined) {
        list = list.filter((item: any) => (item.width || 0) >= minWidth)
      }
      if (maxWidth !== undefined) {
        list = list.filter((item: any) => (item.width || 0) <= maxWidth)
      }
      if (minHeight !== undefined) {
        list = list.filter((item: any) => (item.height || 0) >= minHeight)
      }
      if (maxHeight !== undefined) {
        list = list.filter((item: any) => (item.height || 0) <= maxHeight)
      }

      // 本地过滤：宽高比
      if (aspectRatio && aspectRatio !== 'any') {
        const [rw, rh] = aspectRatio.split(':').map(Number)
        const targetRatio = rw / rh
        list = list.filter((item: any) => {
          if (!item.width || !item.height) return false
          const itemRatio = item.width / item.height
          return Math.abs(itemRatio - targetRatio) / targetRatio <= aspectRatioTolerance
        })
      }

      // 截取到 limit
      list = list.slice(0, limit)

      if (list.length === 0) {
        const hints: string[] = []
        if (keyword) hints.push(`关键词"${keyword}"`)
        if (isCustom !== undefined) hints.push(isCustom ? '自定义贴纸' : '系统贴纸')
        if (isCutout) hints.push('抠图素材')
        if (aspectRatio && aspectRatio !== 'any') hints.push(`宽高比 ${aspectRatio}`)
        const filterDesc = hints.length > 0 ? `（${hints.join('、')}）` : ''

        return {
          success: true,
          message: `未找到${filterDesc}相关贴纸。建议：\n1. 尝试更简洁的关键词\n2. 放宽筛选条件\n3. 使用 canvas.createFromDescription 从零创建`,
          data: { items: [], total: 0 },
        }
      }

      const items = list.map((item: any) => ({
        id: item.id,
        name: item.name || '未命名贴纸',
        description: item.description || '',
        url: item.url,
        keywords: item.keywords || '',
        isCustom: Boolean(item.isCustom),
        isCutout: Boolean(item.isCutout),
        width: item.width || 0,
        height: item.height || 0,
      }))

      const summary = items
        .map((i: any, idx: number) => {
          const tags: string[] = []
          if (i.isCustom) tags.push('可编辑')
          if (i.isCutout) tags.push('已抠图')
          if (i.width && i.height) tags.push(`${i.width}×${i.height}`)
          const tagStr = tags.length > 0 ? ` [${tags.join(', ')}]` : ''
          return `  ${idx + 1}. ${i.name}${tagStr} (id: ${i.id})`
        })
        .join('\n')

      return {
        success: true,
        message: `找到 ${items.length} 个贴纸：\n${summary}\n\n使用 canvas.loadSticker(id) 加载到画布进行编辑`,
        data: {
          items,
          total: res.total || items.length,
          hint: '加载自定义贴纸后可用 element.* 系列工具修改文字、颜色、布局，再用 canvas.updateAndSaveSticker 保存为新贴纸',
        },
      }
    } catch (err: any) {
      return {
        success: false,
        message: `搜索失败: ${err?.message || '未知错误'}`,
      }
    }
  },
})
