import { ref } from 'vue'

export const showStickerModal = ref(false)

export const currentSticker = ref({} as any)

export function openStickerModal(info) {
    showStickerModal.value = true
    currentSticker.value = info
}