import { ref } from 'vue'


export const showShareCardPopup = ref(false)

export const currentShareCardInfo = ref({})

export function showShareCard(info){
    currentShareCardInfo.value = info
    showShareCardPopup.value = true
}