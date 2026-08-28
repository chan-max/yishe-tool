<template>
  <SliderRoot
    :class="
      cn(
        'relative flex w-full touch-none select-none items-center py-1',
        $attrs.class ?? ''
      )
    "
    v-bind="forwarded"
  >
    <SliderTrack
      class="relative h-1 w-full grow overflow-hidden rounded-full bg-secondary cursor-pointer"
    >
      <SliderRange class="absolute h-full bg-primary" />
    </SliderTrack>
    <SliderThumb
      v-for="(_, key) in modelValue ?? [defaultValue ?? 0]"
      :key="key"
      class="block h-3.5 w-3.5 rounded-full border border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 cursor-grab active:cursor-grabbing shadow-xs"
    />
  </SliderRoot>
</template>

<script setup lang="ts">
import {
  SliderRange,
  SliderRoot,
  type SliderRootEmits,
  type SliderRootProps,
  SliderThumb,
  SliderTrack,
  useForwardPropsEmits,
} from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<SliderRootProps>()
const emits = defineEmits<SliderRootEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>
