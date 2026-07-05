/**
 * Crop Guide System - State Management
 *
 * Uses useLocalStorage for persistence across page refreshes.
 */

import { ref, computed, watch } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import type { CropPreset, CropGuide, CropRegion, SafeZone } from './types'
import { calculateCropRegion, calculateSafeZone } from './engine'
import { canvasStickerOptionsOnlyChild } from '../index'
import { DEFAULT_CROP_PRESETS } from './presets'

// -- Available presets catalog --
export const availablePresets = ref<CropPreset[]>([...DEFAULT_CROP_PRESETS])

// -- Persisted state via localStorage --
export const cropPresets = useLocalStorage<CropPreset[]>('crop-guide-presets', [], { deep: true })
export const cropGuides = useLocalStorage<CropGuide[]>('crop-guide-guides', [], { deep: true })
export const showCropGuides = useLocalStorage<boolean>('crop-guide-show', false)
export const showSafeZone = useLocalStorage<boolean>('crop-guide-safezone', true)
export const showCropLabels = useLocalStorage<boolean>('crop-guide-labels', true)

// -- Non-persisted UI state --
export const highlightedPresetId = ref<string | null>(null)
export const showCropGuideModal = ref(false)

// -- Actions --

export function addCropGuide(preset: CropPreset) {
  if (cropPresets.value.find(p => p.id === preset.id)) return

  cropPresets.value.push({ ...preset })
  cropGuides.value.push({
    presetId: preset.id,
    color: getNextColor(),
    visible: true,
    locked: false,
    highlighted: false,
  })
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
