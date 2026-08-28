<template>
  <ToggleGroupItem
    v-bind="forwarded"
    :class="
      cn(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        $attrs.class ?? ''
      )
    "
  >
    <slot />
  </ToggleGroupItem>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import {
  ToggleGroupItem,
  type ToggleGroupItemProps,
  useForwardProps,
} from 'radix-vue'
import { type ToggleVariants, toggleVariants } from '@/components/ui/toggle'
import { cn } from '@/lib/utils'

interface Props extends ToggleGroupItemProps {
  variant?: ToggleVariants['variant']
  size?: ToggleVariants['size']
}

const props = defineProps<Props>()
const context = inject<{
  variant?: ToggleVariants['variant']
  size?: ToggleVariants['size']
}>('toggleGroup', {})

const forwarded = useForwardProps(props)
</script>
