import { ref } from 'vue'


// 产品模型列表
export const showProductPopup = ref(false)


// 贴纸列表
export const showStickerPopup = ref(false)

// 贴纸详情
export const showStickerDetailPopup = ref(false)

export const currentSticker = ref({} as any)

// 展示贴纸详情
export function showStickerDetail(info) {
    showStickerDetailPopup.value = true
    currentSticker.value = info
}