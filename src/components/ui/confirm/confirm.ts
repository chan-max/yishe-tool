import { createApp, h, ref, type Component } from 'vue'
import ConfirmHost from './ConfirmHost.vue'

export interface ConfirmOptions {
  title?: string
  description?: string
  okText?: string
  cancelText?: string
  centered?: boolean
}

export type ConfirmResolve = (val: boolean) => void

let confirmInstance: { show: (opts: ConfirmOptions) => Promise<boolean> } | null = null

function getInstance() {
  if (confirmInstance) return confirmInstance

  const el = document.createElement('div')
  document.body.appendChild(el)

  const app = createApp({
    render: () => h(ConfirmHost, { ref: (v: any) => { confirmInstance = v } }),
  })
  app.mount(el)

  return confirmInstance!
}

export function confirm(opts: ConfirmOptions): Promise<boolean> {
  return getInstance().show(opts)
}

export default { confirm }
