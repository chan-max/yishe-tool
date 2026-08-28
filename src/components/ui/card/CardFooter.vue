<template>
  <div :class="cn('flex items-center p-4 pt-0', $attrs.class ?? '')">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils'
</script>
