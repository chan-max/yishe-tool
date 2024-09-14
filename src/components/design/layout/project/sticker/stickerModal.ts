
import { Modal } from "ant-design-vue"

import stickerDetailModal from './stickerDetailModal.vue'
import { ref } from 'vue'

import Api from '@/api'


export const showStickerDetailModal = ref(false)

const detailInfo = ref()

export function useStickerDetailModal() {

    async function open(info) {
        showStickerDetailModal.value = true
        detailInfo.value = info
    }

    return {
        show: showStickerDetailModal,
        open,
        component: stickerDetailModal,
        detailInfo
    }
}