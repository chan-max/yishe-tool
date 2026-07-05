/**
 * CropOverlay - Renders crop guide overlays on the canvas
 *
 * This component is placed as a sibling of #this_is_canvas_id inside
 * #this_is_canvas_container_id. It is visible in the editor but NOT
 * captured by html-to-image (which targets #this_is_canvas_id).
 *
 * Uses pointer-events: none so it does not interfere with canvas interactions.
 */

import { defineComponent, computed } from 'vue'
import {
  activeCropRegions,
  safeZone,
  showCropGuides,
  showSafeZone,
  showCropLabels,
  highlightedPresetId,
} from '../store'

/** 根据画布尺寸自适应计算字体大小和间距 */
function getAdaptiveStyle(canvasWidth: number, canvasHeight: number) {
  const minSide = Math.min(canvasWidth, canvasHeight)
  // 基准：5000px 画布对应 14px 字体，按比例缩放
  const baseFontSize = Math.max(10, Math.round(minSide / 5000 * 14))
  const basePadding = Math.max(2, Math.round(minSide / 5000 * 4))
  const baseRadius = Math.max(2, Math.round(minSide / 5000 * 4))
  const baseLineHeight = Math.max(14, Math.round(baseFontSize * 1.4))
  return { baseFontSize, basePadding, baseRadius, baseLineHeight }
}

/** 格式化像素尺寸 */
function formatPxSize(w: number, h: number): string {
  return `${Math.round(w)}×${Math.round(h)}`
}

export const CropOverlay = defineComponent({
  name: 'CropOverlay',
  props: {
    canvasWidth: { type: Number, required: true },
    canvasHeight: { type: Number, required: true },
  },
  setup(props) {
    const isVisible = computed(() => {
      return showCropGuides.value || showSafeZone.value
    })

    return () => {
      if (!isVisible.value) return null

      return (
        <div
          class="crop-guide-overlay"
          style={{
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 50,
            overflow: 'hidden',
          }}
        >
          {/* Per-preset crop guide regions */}
          {showCropGuides.value &&
            activeCropRegions.value.map(item => {
              const isHighlighted =
                highlightedPresetId.value === item.preset.id
              return renderCropGuideRegion(item, props, isHighlighted)
            })}

          {/* Safe zone overlay */}
          {showSafeZone.value && safeZone.value.valid && renderSafeZone(props)}
        </div>
      )
    }
  },
})

/**
 * Render a single crop guide region on the canvas.
 */
function renderCropGuideRegion(
  item: { guide: any; preset: any; region: any },
  props: any,
  isHighlighted: boolean
) {
  const { guide, preset, region } = item
  const color = guide.color
  const borderPx = isHighlighted ? 3 : 2
  const borderStyle = isHighlighted ? 'solid' : 'dashed'
  const overlayOpacity = isHighlighted ? 0.15 : 0.08
  const { baseFontSize, basePadding, baseRadius, baseLineHeight } = getAdaptiveStyle(props.canvasWidth, props.canvasHeight)

  const toPct = (v: number) => `${(v * 100).toFixed(4)}%`

  const leftPct = toPct(region.left)
  const topPct = toPct(region.top)
  const widthPct = toPct(region.visibleWidth)
  const heightPct = toPct(region.visibleHeight)

  // 计算可见区域的实际像素尺寸
  const visibleW = region.visibleWidth * props.canvasWidth
  const visibleH = region.visibleHeight * props.canvasHeight
  const sizeText = formatPxSize(visibleW, visibleH)

  // Crop boundary rectangle (dashed border)
  const boundaryStyle: Record<string, string> = {
    position: 'absolute',
    left: leftPct,
    top: topPct,
    width: widthPct,
    height: heightPct,
    border: `${borderPx}px ${borderStyle} ${color}`,
    boxSizing: 'border-box',
    pointerEvents: 'none',
  }

  // 4 semi-transparent rectangles for the cropped (hidden) areas
  const croppedStyle: Record<string, string> = {
    position: 'absolute',
    backgroundColor: color,
    opacity: String(overlayOpacity),
    pointerEvents: 'none',
  }

  // Top cropped area
  const topCrop = region.top > 0.001 ? (
    <div
      style={{
        ...croppedStyle,
        top: '0',
        left: '0',
        width: '100%',
        height: topPct,
      }}
    />
  ) : null

  // Bottom cropped area
  const bottomTop = toPct(region.bottom)
  const bottomHeight = toPct(1 - region.bottom)
  const bottomCrop = region.bottom < 0.999 ? (
    <div
      style={{
        ...croppedStyle,
        top: bottomTop,
        left: '0',
        width: '100%',
        height: bottomHeight,
      }}
    />
  ) : null

  // Left cropped area
  const leftCrop = region.left > 0.001 ? (
    <div
      style={{
        ...croppedStyle,
        top: topPct,
        left: '0',
        width: leftPct,
        height: heightPct,
      }}
    />
  ) : null

  // Right cropped area
  const rightLeft = toPct(region.right)
  const rightWidth = toPct(1 - region.right)
  const rightCrop = region.right < 0.999 ? (
    <div
      style={{
        ...croppedStyle,
        top: topPct,
        left: rightLeft,
        width: rightWidth,
        height: heightPct,
      }}
    />
  ) : null

  // Label: preset name + dimensions
  const label = showCropLabels.value ? (
    <div
      style={{
        position: 'absolute',
        left: leftPct,
        top: topPct,
        backgroundColor: color,
        color: '#fff',
        fontSize: `${baseFontSize}px`,
        padding: `${basePadding}px ${basePadding * 2}px`,
        borderRadius: `0 0 ${baseRadius}px 0`,
        whiteSpace: 'nowrap',
        fontWeight: '600',
        lineHeight: `${baseLineHeight}px`,
        letterSpacing: '0.5px',
        maxWidth: widthPct,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}
    >
      {preset.name} {sizeText}
    </div>
  ) : null

  return (
    <div key={preset.id}>
      {topCrop}
      {bottomCrop}
      {leftCrop}
      {rightCrop}
      <div style={boundaryStyle} />
      {label}
    </div>
  )
}

/**
 * Render the safe zone overlay.
 */
function renderSafeZone(props: any) {
  const sz = safeZone.value
  if (!sz || !sz.valid) return null

  const toPct = (v: number) => `${(v * 100).toFixed(4)}%`
  const { baseFontSize, basePadding, baseRadius, baseLineHeight } = getAdaptiveStyle(props.canvasWidth, props.canvasHeight)

  const leftPct = toPct(sz.left)
  const topPct = toPct(sz.top)
  const widthPct = toPct(sz.right - sz.left)
  const heightPct = toPct(sz.bottom - sz.top)

  // 安全区域实际像素尺寸
  const safeW = (sz.right - sz.left) * props.canvasWidth
  const safeH = (sz.bottom - sz.top) * props.canvasHeight
  const sizeText = formatPxSize(safeW, safeH)

  // 占比百分比
  const pct = ((sz.right - sz.left) * (sz.bottom - sz.top) * 100).toFixed(1)

  return (
    <div key="safe-zone">
      {/* Light fill */}
      <div
        style={{
          position: 'absolute',
          left: leftPct,
          top: topPct,
          width: widthPct,
          height: heightPct,
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          pointerEvents: 'none',
        }}
      />
      {/* Border */}
      <div
        style={{
          position: 'absolute',
          left: leftPct,
          top: topPct,
          width: widthPct,
          height: heightPct,
          border: `${Math.max(1, Math.round(props.canvasWidth / 5000 * 2))}px dashed #4CAF50`,
          boxSizing: 'border-box',
          pointerEvents: 'none',
        }}
      />
      {/* Label */}
      {showCropLabels.value && (
        <div
          style={{
            position: 'absolute',
            left: leftPct,
            top: `calc(${topPct} + ${heightPct} - ${baseLineHeight + basePadding * 2}px)`,
            backgroundColor: '#4CAF50',
            color: '#fff',
            fontSize: `${baseFontSize}px`,
            padding: `${basePadding}px ${basePadding * 2}px`,
            borderRadius: `${baseRadius}px 0 0 0`,
            whiteSpace: 'nowrap',
            fontWeight: '600',
            lineHeight: `${baseLineHeight}px`,
          }}
        >
          安全区域 {sizeText} ({pct}%)
        </div>
      )}
    </div>
  )
}
