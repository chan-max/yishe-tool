<template>
  <TabsList
    v-bind="props"
    :class="
      cn(
        'inline-flex h-7 items-center justify-center rounded-lg bg-muted p-0.5 text-muted-foreground select-none',
        $attrs.class ?? ''
      )
    "
  >
    <slot />
  </TabsList>
</template>

<script setup lang="ts">
import { TabsList, type TabsListProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<TabsListProps>()
</script>
