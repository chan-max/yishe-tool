<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      <div
        v-for="t in toasts"
        :key="t.id"
        class="pointer-events-auto min-w-[240px] max-w-[360px] rounded-lg border p-3 shadow-lg"
        :class="{
          'border-border bg-card text-card-foreground': t.type === 'default' || t.type === 'info',
          'border-destructive/50 bg-destructive/10 text-destructive-foreground': t.type === 'error',
          'border-yellow-500/50 bg-yellow-500/10 text-yellow-900 dark:text-yellow-200': t.type === 'warning',
          'border-green-500/50 bg-green-500/10 text-green-900 dark:text-green-200': t.type === 'success',
        }"
        style="background-color: var(--1s-dialog-bg, var(--card, #fff));"
      >
        <div class="flex items-start gap-2">
          <CheckCircle2
            v-if="t.type === 'success'"
            class="h-4 w-4 shrink-0 text-green-500 mt-0.5"
          />
          <AlertCircle
            v-else-if="t.type === 'error'"
            class="h-4 w-4 shrink-0 text-destructive mt-0.5"
          />
          <AlertTriangle
            v-else-if="t.type === 'warning'"
            class="h-4 w-4 shrink-0 text-yellow-500 mt-0.5"
          />
          <Info
            v-else-if="t.type === 'info'"
            class="h-4 w-4 shrink-0 text-blue-500 mt-0.5"
          />
          <div class="flex-1 min-w-0">
            <p v-if="t.title" class="text-xs font-medium text-foreground">{{ t.title }}</p>
            <p class="text-xs text-foreground/80 break-words">{{ t.message }}</p>
          </div>
          <button
            class="shrink-0 text-muted-foreground hover:text-foreground"
            @click="remove(t.id)"
          >
            <X class="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-vue-next'
import { toasts, remove } from './toast'
</script>
