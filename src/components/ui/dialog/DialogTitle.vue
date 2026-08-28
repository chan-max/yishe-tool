<template>
  <DialogTitle
    v-bind="props"
    :class="cn('text-base font-semibold leading-none tracking-tight text-foreground', $attrs.class ?? '')"
  >
    <slot />
  </DialogTitle>
</template>

<script setup lang="ts">
import { DialogTitle, type DialogTitleProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<DialogTitleProps>()
</script>
