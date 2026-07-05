/**
 * 裁剪参考线系统 - 默认预设
 * 使用共享比例数据源
 */

import type { CropPreset } from './types'
import { ratioCategories } from './ratioData'

/** 从共享比例数据生成裁剪预设（去重，只保留独立比例） */
function buildCropPresets(): CropPreset[] {
  const seen = new Set<string>()
  const presets: CropPreset[] = []

  for (const cat of ratioCategories) {
    for (const r of cat.ratios) {
      const key = r.display
      if (seen.has(key)) continue
      seen.add(key)
      presets.push({
        id: `ratio-${key}`,
        name: `${r.display} ${r.name}`,
        width: r.width,
        height: r.height,
        ratio: r.width / r.height,
      })
    }
  }

  return presets
}

export const DEFAULT_CROP_PRESETS: CropPreset[] = buildCropPresets()
