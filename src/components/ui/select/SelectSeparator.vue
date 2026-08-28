<template>
  <SelectSeparator
    v-bind="props"
    :class="cn('-mx-1 my-1 h-px bg-[var(--1s-divider-color)]', $attrs.class ?? '')"
  />
</template>

<script setup lang="ts">
import { SelectSeparator, type SelectSeparatorProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<SelectSeparatorProps>()
</script>
