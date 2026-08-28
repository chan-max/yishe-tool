<template>
  <Toggle
    v-bind="forwarded"
    :class="cn(toggleVariants({ variant, size }), $attrs.class ?? '')"
  >
    <slot />
  </Toggle>
</template>

<script setup lang="ts">
import {
  Toggle,
  type ToggleEmits,
  type ToggleProps,
  useForwardPropsEmits,
} from 'radix-vue'
import { type ToggleVariants, toggleVariants } from '.'
import { cn } from '@/lib/utils'

interface Props extends ToggleProps {
  variant?: ToggleVariants['variant']
  size?: ToggleVariants['size']
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'default',
  disabled: false,
})
const emits = defineEmits<ToggleEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>
