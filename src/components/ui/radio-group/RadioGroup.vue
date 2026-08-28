<template>
  <RadioGroupRoot :class="cn('grid gap-2', $attrs.class ?? '')" v-bind="forwarded">
    <slot />
  </RadioGroupRoot>
</template>

<script setup lang="ts">
import {
  RadioGroupRoot,
  type RadioGroupRootEmits,
  type RadioGroupRootProps,
  useForwardPropsEmits,
} from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<RadioGroupRootProps>()
const emits = defineEmits<RadioGroupRootEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>
