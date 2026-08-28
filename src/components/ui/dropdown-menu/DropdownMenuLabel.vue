<template>
  <DropdownMenuLabel
    v-bind="props"
    :class="cn('px-2 py-1.5 text-xs font-semibold text-foreground', $attrs.class ?? '')"
  >
    <slot />
  </DropdownMenuLabel>
</template>

<script setup lang="ts">
import { DropdownMenuLabel, type DropdownMenuLabelProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<DropdownMenuLabelProps>()
</script>
