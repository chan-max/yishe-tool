/**
 * Responsive Crop Guide System - State Management
 * 裁剪参考线系统 - 状态管理
 *
 * Uses module-level ref() exports following the project convention.
 * Crop guides are editor-only visual aids - NOT persisted with canvas data.
 */

import { ref, computed } from 'vue'
import type { CropPreset, CropGuide, CropRegion, SafeZone } from './types'
import { calculateCropRegion, calculateSafeZone } from './engine'
import { canvasStickerOptionsOnlyChild } from '../index'
import { DEFAULT_CROP_PRESETS } from './presets'

// -- Available presets catalog (for the "add" dropdown) --
export const availablePresets = ref<CropPreset[]>([...DEFAULT_CROP_PRESETS])

// -- Active crop presets (those the user has added) --
export const cropPresets = ref<CropPreset[]>([])

// -- Active crop guides (runtime state for each preset) --
export const cropGuides = ref<CropGuide[]>([])

// -- Global toggles --
export const showCropGuides = ref(false)
export const showSafeZone = ref(true)
export const showCropLabels = ref(true)

// -- Highlighted guide (clicked in the modal) --
export const highlightedPresetId = ref<string | null>(null)

// -- Modal visibility --
export const showCropGuideModal = ref(false)

// -- Actions --

export function addCropGuide(preset: CropPreset) {
  // Avoid duplicates
  if (cropPresets.value.find(p => p.id === preset.id)) return

  cropPresets.value.push({ ...preset })
  cropGuides.value.push({
    presetId: preset.id,
    color: getNextColor(),
    visible: true,
    locked: false,
    highlighted: false,
  })
  // Auto-enable crop guides when first one is added
  if (!showCropGuides.value) {
    showCropGuides.value = true
  }
}

export function addCustomCropGuide(width: number, height: number, name?: string) {
  const ratio = width / height
  const id = `custom-${width}x${height}-${Date.now()}`
  const preset: CropPreset = {
    id,
    name: name || `${width}×${height}`,
    width,
    height,
    ratio,
  }
  addCropGuide(preset)
}

export function removeCropGuide(id: string) {
  cropPresets.value = cropPresets.value.filter(p => p.id !== id)
  cropGuides.value = cropGuides.value.filter(g => g.presetId !== id)
  if (highlightedPresetId.value === id) {
    highlightedPresetId.value = null
  }
}

export function toggleGuideVisibility(presetId: string) {
  const guide = cropGuides.value.find(g => g.presetId === presetId)
  if (guide) guide.visible = !guide.visible
}

export function toggleGuideHighlight(presetId: string) {
  highlightedPresetId.value =
    highlightedPresetId.value === presetId ? null : presetId
}

export function setGuideColor(presetId: string, color: string) {
  const guide = cropGuides.value.find(g => g.presetId === presetId)
  if (guide) guide.color = color
}

// -- Computed: all active crop regions for the overlay renderer --
export const activeCropRegions = computed(() => {
  const canvasChild = canvasStickerOptionsOnlyChild.value
  if (!canvasChild || !showCropGuides.value) return []

  const designRatio = canvasChild.width.value / canvasChild.height.value

  return cropGuides.value
    .filter(g => g.visible)
    .map(g => {
      const preset = cropPresets.value.find(p => p.id === g.presetId)
      if (!preset) return null
      return {
        guide: g,
        preset,
        region: calculateCropRegion(designRatio, preset.ratio),
      }
    })
    .filter(Boolean) as Array<{ guide: CropGuide; preset: CropPreset; region: CropRegion }>
})

// -- Computed: safe zone --
export const safeZone = computed<SafeZone>(() => {
  const canvasChild = canvasStickerOptionsOnlyChild.value
  if (!canvasChild || !showSafeZone.value) {
    return { left: 0, top: 0, right: 1, bottom: 1, valid: false }
  }

  const designRatio = canvasChild.width.value / canvasChild.height.value

  const visibleRegions = cropGuides.value
    .filter(g => g.visible)
    .map(g => {
      const preset = cropPresets.value.find(p => p.id === g.presetId)
      if (!preset) return null
      return calculateCropRegion(designRatio, preset.ratio)
    })
    .filter(Boolean) as CropRegion[]

  return calculateSafeZone(visibleRegions)
})

// -- Computed: unadded presets (available to add) --
export const unaddedPresets = computed(() => {
  const activeIds = new Set(cropPresets.value.map(p => p.id))
  return availablePresets.value.filter(p => !activeIds.has(p.id))
})

// -- Color rotation for new guides --
const GUIDE_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
]
let colorIndex = 0
function getNextColor(): string {
  const color = GUIDE_COLORS[colorIndex % GUIDE_COLORS.length]
  colorIndex++
  return color
}
