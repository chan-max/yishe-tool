<template>
  <SelectGroup v-bind="props">
    <slot />
  </SelectGroup>
</template>

<script setup lang="ts">
import { SelectGroup, type SelectGroupProps } from 'radix-vue'

const props = defineProps<SelectGroupProps>()
</script>
