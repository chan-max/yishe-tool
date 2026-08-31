import { reactive } from 'vue'

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'default'

export interface ToastItem {
  id: number
  message: string
  title?: string
  type: ToastType
  duration: number
}

export const toasts = reactive<ToastItem[]>([])

let _id = 0

function push(message: string, type: ToastType = 'default', duration = 3000) {
  const id = ++_id
  toasts.push({ id, message, type, duration })
  if (duration > 0) {
    setTimeout(() => remove(id), duration)
  }
  return id
}

export function remove(id: number) {
  const idx = toasts.findIndex(t => t.id === id)
  if (idx !== -1) toasts.splice(idx, 1)
}

export const toast = {
  success: (msg: string, duration?: number) => push(msg, 'success', duration),
  error: (msg: string, duration?: number) => push(msg, 'error', duration ?? 4000),
  warning: (msg: string, duration?: number) => push(msg, 'warning', duration ?? 4000),
  info: (msg: string, duration?: number) => push(msg, 'info', duration),
  default: (msg: string, duration?: number) => push(msg, 'default', duration),
  dismiss: remove,
}

export default toast
