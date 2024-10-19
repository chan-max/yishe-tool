import { ref } from 'vue'

export const showCustomModelModal = ref(false)

export const currentCustomModel = ref({} as any)

export function openCustomModelModal(info){
    showCustomModelModal.value = true
    currentCustomModel.value = info
}