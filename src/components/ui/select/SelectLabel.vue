<template>
  <SelectLabel
    :class="cn('px-2 py-1.5 text-xs font-semibold text-[var(--1s-text-color-secondary)]', $attrs.class ?? '')"
  >
    <slot />
  </SelectLabel>
</template>

<script setup lang="ts">
import { SelectLabel, type SelectLabelProps } from 'radix-vue'
import { cn } from '@/lib/utils'

defineProps<SelectLabelProps>()
</script>
