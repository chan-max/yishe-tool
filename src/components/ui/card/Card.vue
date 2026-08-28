<template>
  <div
    :class="
      cn(
        'rounded-xl border bg-card text-card-foreground shadow-xs transition-colors',
        $attrs.class ?? ''
      )
    "
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils'
</script>
