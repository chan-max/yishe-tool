
import { ref } from 'vue'



/**
 * pc 和移动端通用
*/

export const showShareCardModal = ref(false)

export const shareCardCustomModelInfo = ref()

export const openShareCardModal = (info) => {
    showShareCardModal.value = true
    shareCardCustomModelInfo.value = info
}

export function createCustomModelShareLink(id = '') {

    if (!id) {
        id = shareCardCustomModelInfo.value.id
    }

    // 保存模型的 id 和生成链接的时间
    return `https://1s.design/#/preview?id=${id}&timestamp=${Date.now()}`
}