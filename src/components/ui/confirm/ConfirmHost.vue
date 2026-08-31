<template>
  <Dialog :open="!!current" @update:open="onOpenChange">
    <DialogContent class="max-w-[360px] p-5 gap-3">
      <DialogHeader>
        <DialogTitle class="text-sm font-semibold">{{ current?.title || '提示' }}</DialogTitle>
      </DialogHeader>
      <div v-if="current?.description" class="text-xs text-muted-foreground">
        {{ current.description }}
      </div>
      <DialogFooter class="gap-2 mt-2">
        <Button variant="outline" class="h-8 text-xs flex-1" @click="onCancel">
          {{ current?.cancelText || '取消' }}
        </Button>
        <Button class="h-8 text-xs flex-1" @click="onOk">
          {{ current?.okText || '确定' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { ConfirmOptions, ConfirmResolve } from './confirm'

const current = ref<ConfirmOptions | null>(null)
let resolveFn: ConfirmResolve | null = null

function onOpenChange(open: boolean) {
  if (!open && current.value) {
    onCancel()
  }
}

function onOk() {
  const r = resolveFn
  current.value = null
  resolveFn = null
  r?.(true)
}

function onCancel() {
  const r = resolveFn
  current.value = null
  resolveFn = null
  r?.(false)
}

function show(opts: ConfirmOptions): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    resolveFn = resolve
    current.value = opts
  })
}

defineExpose({ show })
</script>
