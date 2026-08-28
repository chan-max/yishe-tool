<template>
  <h3
    :class="
      cn('text-sm font-semibold leading-none tracking-tight text-foreground', $attrs.class ?? '')
    "
  >
    <slot />
  </h3>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils'
</script>
