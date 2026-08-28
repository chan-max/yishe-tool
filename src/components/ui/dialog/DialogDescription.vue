<template>
  <DialogDescription
    v-bind="props"
    :class="cn('text-xs text-muted-foreground', $attrs.class ?? '')"
  >
    <slot />
  </DialogDescription>
</template>

<script setup lang="ts">
import { DialogDescription, type DialogDescriptionProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<DialogDescriptionProps>()
</script>
