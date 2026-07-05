<template>
  <a-modal
    v-model:open="showCropGuideModal"
    title="裁剪参考线"
    :footer="null"
    width="860px"
    :destroyOnClose="false"
    centered
  >
    <div class="crop-guide-modal">
      <!-- Global toggles -->
      <div class="crop-guide-modal__toggles">
        <div class="crop-guide-modal__toggle-row">
          <el-switch v-model="showCropGuides" size="small" />
          <span class="crop-guide-modal__toggle-label">显示裁剪参考线</span>
        </div>
        <div class="crop-guide-modal__toggle-row">
          <el-switch v-model="showSafeZone" size="small" />
          <span class="crop-guide-modal__toggle-label">显示安全区域</span>
        </div>
        <div class="crop-guide-modal__toggle-row">
          <el-switch v-model="showCropLabels" size="small" />
          <span class="crop-guide-modal__toggle-label">显示标签</span>
        </div>
      </div>

      <el-divider />

      <!-- Active guides list -->
      <div class="crop-guide-modal__section">
        <div class="crop-guide-modal__section-title">
          当前参考线
          <el-tag v-if="cropGuides.length > 0" size="small" type="info" style="margin-left: 8px">
            {{ cropGuides.length }}
          </el-tag>
        </div>
        <div v-if="cropGuides.length === 0" class="crop-guide-modal__empty">
          暂无参考线，请从下方添加
        </div>
        <div v-else class="crop-guide-modal__list">
          <CropPresetItem
            v-for="guide in cropGuides"
            :key="guide.presetId"
            :guide="guide"
            :preset="getPreset(guide.presetId)"
            @toggle-visibility="toggleGuideVisibility(guide.presetId)"
            @toggle-highlight="toggleGuideHighlight(guide.presetId)"
            @remove="removeCropGuide(guide.presetId)"
            @color-change="(c) => setGuideColor(guide.presetId, c)"
          />
        </div>
      </div>

      <el-divider />

      <!-- Safe zone info -->
      <div v-if="showSafeZone" class="crop-guide-modal__section">
        <div class="crop-guide-modal__section-title">安全区域信息</div>
        <div v-if="safeZone.valid" class="crop-guide-modal__safezone-info">
          <div class="crop-guide-modal__safezone-row">
            <span>安全区域尺寸:</span>
            <span>{{ safeZoneSize }}</span>
          </div>
          <div class="crop-guide-modal__safezone-row">
            <span>安全区域占比:</span>
            <span>{{ safeZonePercent }}</span>
          </div>
        </div>
        <div v-else-if="cropGuides.filter(g => g.visible).length > 1" class="crop-guide-modal__safezone-warn">
          <el-icon><WarningFilled /></el-icon>
          <span>当前参考线无共同安全区域</span>
        </div>
        <div v-else-if="cropGuides.filter(g => g.visible).length <= 1" class="crop-guide-modal__safezone-hint">
          需要至少两个可见的参考线才能计算安全区域
        </div>
      </div>

      <el-divider />

      <!-- Add presets section -->
      <div class="crop-guide-modal__section">
        <div class="crop-guide-modal__section-title">添加参考线</div>

        <div class="crop-guide-modal__add-row">
          <!-- Quick common ratios -->
          <div class="crop-guide-modal__add-grid-wrapper">
            <div v-if="unaddedPresets.length > 0" class="crop-guide-modal__add-grid">
              <el-button
                v-for="preset in unaddedPresets"
                :key="preset.id"
                size="small"
                round
                @click="addCropGuide(preset)"
              >
                {{ preset.name }}
              </el-button>
            </div>
            <div v-else class="crop-guide-modal__all-added">
              所有预设已添加
            </div>
          </div>

          <!-- Custom preset -->
          <div class="crop-guide-modal__custom">
            <div class="crop-guide-modal__custom-title">自定义尺寸</div>
            <div class="crop-guide-modal__custom-row">
              <el-input-number
                v-model="customWidth"
                :min="1"
                :max="9999"
                size="small"
                controls-position="right"
                placeholder="宽度"
              />
              <span class="crop-guide-modal__custom-x">×</span>
              <el-input-number
                v-model="customHeight"
                :min="1"
                :max="9999"
                size="small"
                controls-position="right"
                placeholder="高度"
              />
              <el-button
                size="small"
                type="primary"
                @click="addCustom"
                :disabled="!customWidth || !customHeight"
              >
                添加
              </el-button>
            </div>
            <div class="crop-guide-modal__custom-row">
              <el-input
                v-model="customName"
                size="small"
                placeholder="自定义名称 (可选)"
                clearable
                style="flex: 1"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { WarningFilled } from '@element-plus/icons-vue'
import CropPresetItem from './CropPresetItem.vue'
import {
  cropPresets,
  cropGuides,
  showCropGuides,
  showSafeZone,
  showCropLabels,
  showCropGuideModal,
  highlightedPresetId,
  safeZone,
  unaddedPresets,
  addCropGuide,
  addCustomCropGuide,
  removeCropGuide,
  toggleGuideVisibility,
  toggleGuideHighlight,
  setGuideColor,
  availablePresets,
} from '../store'
import { canvasStickerOptionsOnlyChild } from '../../index'
import type { CropPreset } from '../types'

// Custom preset inputs
const customWidth = ref<number>(800)
const customHeight = ref<number>(600)
const customName = ref<string>('')

// Get preset by ID
function getPreset(id: string): CropPreset {
  return cropPresets.value.find(p => p.id === id) || {
    id,
    name: '未知',
    width: 0,
    height: 0,
    ratio: 1,
  }
}

// Add custom preset
function addCustom() {
  if (!customWidth.value || !customHeight.value) return
  addCustomCropGuide(
    customWidth.value,
    customHeight.value,
    customName.value || undefined
  )
  customName.value = ''
}

// Safe zone size display
const safeZoneSize = computed(() => {
  if (!safeZone.value.valid) return '-'
  const canvasChild = canvasStickerOptionsOnlyChild.value
  if (!canvasChild) return '-'
  const w = canvasChild.width.value
  const h = canvasChild.height.value
  const safeW = (safeZone.value.right - safeZone.value.left) * w
  const safeH = (safeZone.value.bottom - safeZone.value.top) * h
  return `${safeW.toFixed(0)}px × ${safeH.toFixed(0)}px`
})

// Safe zone percentage display
const safeZonePercent = computed(() => {
  if (!safeZone.value.valid) return '-'
  const pct = (safeZone.value.right - safeZone.value.left) *
    (safeZone.value.bottom - safeZone.value.top) * 100
  return `${pct.toFixed(1)}%`
})
</script>

<style scoped>
.crop-guide-modal {
  padding: 0 4px;
}

.crop-guide-modal__toggles {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 24px;
}

.crop-guide-modal__toggle-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.crop-guide-modal__toggle-label {
  font-size: 13px;
  color: var(--1s-text-color, #333);
}

.crop-guide-modal__section {
  margin-bottom: 4px;
}

.crop-guide-modal__section-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  color: var(--1s-text-color, #333);
}

.crop-guide-modal__empty {
  text-align: center;
  padding: 16px;
  color: var(--1s-text-color-tertiary, #aaa);
  font-size: 13px;
}

.crop-guide-modal__list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-height: 200px;
  overflow-y: auto;
}

.crop-guide-modal__add-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.crop-guide-modal__add-row {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.crop-guide-modal__add-grid-wrapper {
  flex: 1;
  min-width: 0;
}

.crop-guide-modal__all-added {
  text-align: center;
  padding: 8px;
  color: var(--1s-text-color-tertiary, #aaa);
  font-size: 12px;
}

.crop-guide-modal__custom {
  background: var(--1s-control-surface-background, #f8f8f8);
  border-radius: 8px;
  padding: 12px;
}

.crop-guide-modal__custom-title {
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 8px;
  color: var(--1s-text-color-secondary, #666);
}

.crop-guide-modal__custom-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.crop-guide-modal__custom-row:last-child {
  margin-bottom: 0;
}

.crop-guide-modal__custom-x {
  font-size: 14px;
  color: var(--1s-text-color-tertiary, #aaa);
}

.crop-guide-modal__safezone-info {
  background: var(--1s-control-surface-background, #f8f8f8);
  border-radius: 8px;
  padding: 10px 12px;
}

.crop-guide-modal__safezone-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: var(--1s-text-color, #333);
  padding: 2px 0;
}

.crop-guide-modal__safezone-warn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 12px;
  background: rgba(255, 152, 0, 0.1);
  border-radius: 8px;
  color: #e65100;
  font-size: 13px;
}

.crop-guide-modal__safezone-hint {
  padding: 8px 12px;
  color: var(--1s-text-color-tertiary, #aaa);
  font-size: 12px;
}
</style>
