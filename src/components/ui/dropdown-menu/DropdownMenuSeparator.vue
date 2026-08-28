<template>
  <DropdownMenuSeparator
    v-bind="props"
    :class="cn('-mx-1 my-1 h-px bg-muted', $attrs.class ?? '')"
  />
</template>

<script setup lang="ts">
import { DropdownMenuSeparator, type DropdownMenuSeparatorProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<DropdownMenuSeparatorProps>()
</script>
