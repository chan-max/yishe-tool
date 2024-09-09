<script lang="ts" setup>
defineProps({
    name: {
        type: String,
        required: true,
        default: 'car',
    },
    size: {
        type: Number,
        default: 30,
    },
    color: {
        type: String,
        default: '#000',
    },
})
</script>

<template>
    <svg class="svg-icon" :style="{ width: `${size}px`, height: `${size}px`, color: `${color}` }">
        <use :xlink:href="`#icon-${name}`" :fill="color" />
    </svg>
</template>