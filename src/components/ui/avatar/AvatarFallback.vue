<template>
  <AvatarFallback
    v-bind="props"
    :class="
      cn(
        'flex h-full w-full items-center justify-center rounded-full bg-muted font-medium text-xs text-muted-foreground select-none',
        $attrs.class ?? ''
      )
    "
  >
    <slot />
  </AvatarFallback>
</template>

<script setup lang="ts">
import { AvatarFallback, type AvatarFallbackProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<AvatarFallbackProps>()
</script>
