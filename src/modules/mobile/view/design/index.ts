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


/**
 * 材料相关
*/
export const showMaterialPopup = ref(false)
export const showMaterialDetailPopup = ref(false)
export const currentMaterialDetail = ref({} as any)


/**
 * 上传
*/

export const showUploadPopup = ref(false)

// 展示贴纸列表
export const showDecalPopup = ref(false)

// 图片上传弹层
export const showUploadImagePopup = ref(false)


export const showDecalOperationPopup = ref(false)





// 服装颜色选择

export const showColorPopup = ref(false)