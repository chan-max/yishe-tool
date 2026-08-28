<template>
  <AvatarRoot
    :class="
      cn(
        'relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full',
        $attrs.class ?? ''
      )
    "
  >
    <slot />
  </AvatarRoot>
</template>

<script setup lang="ts">
import { AvatarRoot } from 'radix-vue'
import { cn } from '@/lib/utils'
</script>
