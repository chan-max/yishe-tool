import { Modal } from "ant-design-vue"

import component from './index.vue'
import { ref } from 'vue'

export const openCustomModelDetailModal = () => {
    Modal.info({

    })
}


export const showDetailModal = ref(false)

const detailInfo = ref()

export function useCustomModelDetailDialog() {


    function open(info) {
        showDetailModal.value = true
        detailInfo.value = info
    }

    return {
        show: showDetailModal,
        open,
        component,
        detailInfo
    }

}



