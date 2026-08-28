<template>
  <div :class="cn(badgeVariants({ variant }), $attrs.class ?? '')">
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { type BadgeVariants, badgeVariants } from '.'
import { cn } from '@/lib/utils'

interface Props {
  variant?: BadgeVariants['variant']
  class?: HTMLAttributes['class']
}

defineProps<Props>()
</script>
