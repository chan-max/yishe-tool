<template>
  <ToggleGroupRoot
    v-bind="forwarded"
    :class="cn('flex items-center justify-center gap-1', $attrs.class ?? '')"
  >
    <slot />
  </ToggleGroupRoot>
</template>

<script setup lang="ts">
import { provide } from 'vue'
import {
  ToggleGroupRoot,
  type ToggleGroupRootEmits,
  type ToggleGroupRootProps,
  useForwardPropsEmits,
} from 'radix-vue'
import type { ToggleVariants } from '@/components/ui/toggle'
import { cn } from '@/lib/utils'

interface Props extends ToggleGroupRootProps {
  variant?: ToggleVariants['variant']
  size?: ToggleVariants['size']
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'default',
})
const emits = defineEmits<ToggleGroupRootEmits>()

provide('toggleGroup', {
  variant: props.variant,
  size: props.size,
})

const forwarded = useForwardPropsEmits(props, emits)
</script>
