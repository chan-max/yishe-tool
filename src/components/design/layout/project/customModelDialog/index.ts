import { Modal } from "ant-design-vue"

import component from './index.vue'
import { ref } from 'vue'

import Api from '@/api'

export const openCustomModelDetailModal = () => {
}


export const showDetailModal = ref(false)

const detailInfo = ref()

export function useCustomModelDetailDialog() {

    async function open(info) {

        /*
            这里需要处理 模型信息 ，将所需要的资源直接请求回来，用于渲染
        */

        info.meta.modelInfo = await resolveModelInfo(info.meta.modelInfo)
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



/**
 * 获取模型的远程资源
*/
async function resolveModelInfo(modelInfo) {
    await Promise.all([
        new Promise(async (resolve, reject) => {
            modelInfo.fetchResult = await Api.getProductModelById(modelInfo.baseModelId)
            resolve(void 0)
        }),
        ...modelInfo.decals ? modelInfo.decals.map(async (decal) => {
            return new Promise(async (resolve) => {
                decal.fetchResult = await Api.getStickerById(decal.id)
                resolve(void 0)
            })
        }) : []
    ])

    return modelInfo
}
