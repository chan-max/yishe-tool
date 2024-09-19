<template>
    <svg class="svg-icon" :style="{ width: `${size}px`, height: `${size}px`, color: `inherit` }">
        <use :xlink:href="`#icon-${name}`" />
    </svg>
</template>

<script lang="ts" setup>
defineProps({
    name: {
        type: String,
        required: true,
        default: '',
    },
    size: {
        default: 30,
    },
})
</script>
