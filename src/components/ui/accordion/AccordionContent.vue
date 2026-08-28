<template>
  <AccordionContent
    v-bind="props"
    class="overflow-hidden text-xs data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
  >
    <div :class="cn('pb-4 pt-0', $attrs.class ?? '')">
      <slot />
    </div>
  </AccordionContent>
</template>

<script setup lang="ts">
import { AccordionContent, type AccordionContentProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<AccordionContentProps>()
</script>
