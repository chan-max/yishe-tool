<template>
  <Label
    v-bind="props"
    :class="
      cn(
        'text-xs font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70 select-none',
        $attrs.class ?? ''
      )
    "
  >
    <slot />
  </Label>
</template>

<script setup lang="ts">
import { Label, type LabelProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<LabelProps>()
</script>
