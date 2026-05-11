import { registerOperation } from '../registry'
import { sizePresetMap, searchPresets, SIZE_PRESET_CATEGORIES, sizePresets } from './size-presets'

registerOperation({
  id: 'canvas.setSizeByPreset',
  name: '按预设设置画布尺寸',
  description: '使用产品预设尺寸来设置画布大小。支持通过预设 ID 或关键词匹配。',
  group: '画布',
  params: [
    {
      name: 'presetId',
      label: '预设 ID',
      type: 'string',
      description: '预设 ID，如 tee-front-large、mug-11oz、sticker-3x3 等',
      placeholder: '输入预设 ID 或关键词，如 tshirt、mug',
    },
    {
      name: 'presetName',
      label: '预设名称',
      type: 'string',
      description: '按名称模糊匹配预设，如 "T恤" "马克杯" "海报"',
      placeholder: '输入产品名称，如 T恤、马克杯、手机壳',
    },
  ],
  execute(params, ctx) {
    const { presetId, presetName } = params

    if (!presetId && !presetName) {
      const categories = SIZE_PRESET_CATEGORIES.join('、')
      return {
        success: false,
        message: `请指定预设 ID 或名称。可用分类：${categories}。可用预设：${sizePresets.map((p) => p.id).join(', ')}`,
      }
    }

    let preset = presetId ? sizePresetMap.get(presetId) : undefined

    if (!preset && presetName) {
      const results = searchPresets(presetName)
      if (results.length > 0) {
        preset = results[0]
      }
    }

    if (!preset) {
      const suggestions = searchPresets(presetId || presetName || '')
      if (suggestions.length > 0) {
        return {
          success: false,
          message: `未找到匹配的预设。您是否想用：${suggestions.slice(0, 5).map((p) => `${p.id}(${p.name})`).join('、')}？`,
        }
      }
      return { success: false, message: `未找到匹配的预设，请检查 ID 或名称` }
    }

    ctx.setCanvasSize(preset.width, preset.height, preset.unit)

    return {
      success: true,
      message: `已将画布设置为「${preset.name}」尺寸：${preset.width}×${preset.height} ${preset.unit}` +
        (preset.printArea ? `（印刷区 ${preset.printArea.width}×${preset.printArea.height} ${preset.printArea.unit}）` : ''),
      data: {
        presetId: preset.id,
        presetName: preset.name,
        width: preset.width,
        height: preset.height,
        unit: preset.unit,
        printArea: preset.printArea,
        dpi: preset.dpi,
      },
    }
  },
})
