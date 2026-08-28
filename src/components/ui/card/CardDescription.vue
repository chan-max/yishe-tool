<template>
  <p :class="cn('text-xs text-muted-foreground', $attrs.class ?? '')">
    <slot />
  </p>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils'
</script>
