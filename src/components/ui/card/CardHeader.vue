<template>
  <div :class="cn('flex flex-col space-y-1.5 p-4', $attrs.class ?? '')">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils'
</script>
