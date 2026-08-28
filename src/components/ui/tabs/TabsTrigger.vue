<template>
  <TabsTrigger
    v-bind="props"
    :class="
      cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md px-2.5 py-0.5 text-xs font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-xs select-none',
        $attrs.class ?? ''
      )
    "
  >
    <slot />
  </TabsTrigger>
</template>

<script setup lang="ts">
import { TabsTrigger, type TabsTriggerProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<TabsTriggerProps>()
</script>
