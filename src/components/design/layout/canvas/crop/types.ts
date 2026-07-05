/**
 * Responsive Crop Guide System - Type Definitions
 * 裁剪参考线系统 - 类型定义
 */

/** A crop preset represents a target product size */
export interface CropPreset {
  id: string
  name: string
  width: number
  height: number
  ratio: number // width / height, precomputed
}

/** Runtime state for an active crop guide overlay */
export interface CropGuide {
  presetId: string
  color: string
  visible: boolean
  locked: boolean
  highlighted: boolean
}

/** Result of the crop calculation (all values normalized 0..1 relative to canvas) */
export interface CropRegion {
  left: number
  top: number
  right: number
  bottom: number
  visibleWidth: number
  visibleHeight: number
}

/** The safe zone (intersection of all visible crop guides) */
export interface SafeZone {
  left: number
  top: number
  right: number
  bottom: number
  valid: boolean
}
