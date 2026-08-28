<template>
  <DropdownMenuTrigger v-bind="props" :class="cn('outline-none', $attrs.class ?? '')">
    <slot />
  </DropdownMenuTrigger>
</template>

<script setup lang="ts">
import { DropdownMenuTrigger, type DropdownMenuTriggerProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<DropdownMenuTriggerProps>()
</script>
