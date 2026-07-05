/**
 * Responsive Crop Guide System - Core Engine
 * 裁剪参考线系统 - 核心计算引擎
 *
 * Pure functions for calculating crop regions and safe zones.
 * No Vue dependencies - pure computation only.
 */

import type { CropRegion, SafeZone } from './types'

/**
 * Calculate the visible crop region (normalized 0..1) given a design ratio
 * and a target (preset) ratio, using "cover" mode.
 *
 * Cover mode: scale to fill the target, overflow is cropped.
 * - If target is wider than design -> crop top/bottom
 * - If target is narrower than design -> crop left/right
 *
 * @param designRatio - canvas width / canvas height
 * @param targetRatio - preset width / preset height
 * @returns CropRegion with left/top/right/bottom as fractions of canvas dimensions
 */
export function calculateCropRegion(
  designRatio: number,
  targetRatio: number
): CropRegion {
  if (targetRatio > designRatio) {
    // Target is wider than design -> crop top/bottom
    const visibleWidth = 1
    const visibleHeight = designRatio / targetRatio
    const left = 0
    const right = 1
    const top = (1 - visibleHeight) / 2
    const bottom = top + visibleHeight
    return { left, top, right, bottom, visibleWidth, visibleHeight }
  } else {
    // Target is narrower than design -> crop left/right
    const visibleHeight = 1
    const visibleWidth = targetRatio / designRatio
    const top = 0
    const bottom = 1
    const left = (1 - visibleWidth) / 2
    const right = left + visibleWidth
    return { left, top, right, bottom, visibleWidth, visibleHeight }
  }
}

/**
 * Calculate the safe zone as the intersection of all provided crop regions.
 * Returns a SafeZone with valid=false when regions list is empty or
 * intersection collapses (no common area).
 */
export function calculateSafeZone(regions: CropRegion[]): SafeZone {
  if (regions.length === 0) {
    return { left: 0, top: 0, right: 1, bottom: 1, valid: false }
  }

  const safeLeft = Math.max(...regions.map(r => r.left))
  const safeTop = Math.max(...regions.map(r => r.top))
  const safeRight = Math.min(...regions.map(r => r.right))
  const safeBottom = Math.min(...regions.map(r => r.bottom))

  const valid = safeLeft < safeRight && safeTop < safeBottom

  return { left: safeLeft, top: safeTop, right: safeRight, bottom: safeBottom, valid }
}
