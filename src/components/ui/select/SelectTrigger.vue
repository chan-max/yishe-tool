<template>
  <SelectTrigger
    v-bind="forwarded"
    :class="
      cn(
        'flex h-7 w-full items-center justify-between rounded-md border border-input bg-transparent px-2.5 py-1 text-xs text-foreground shadow-xs ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 select-none',
        $attrs.class ?? ''
      )
    "
  >
    <slot />
    <SelectIcon as-child>
      <ChevronDown class="h-3 w-3 opacity-50 ml-1 shrink-0" />
    </SelectIcon>
  </SelectTrigger>
</template>

<script setup lang="ts">
import {
  SelectIcon,
  SelectTrigger,
  type SelectTriggerProps,
  useForwardProps,
} from 'radix-vue'
import { ChevronDown } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

const props = defineProps<SelectTriggerProps>()
const forwarded = useForwardProps(props)
</script>
