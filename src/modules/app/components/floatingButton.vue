<template>
  <van-floating-bubble axis="xy" magnetic="x" v-model:offset="offset">
    +
  </van-floating-bubble>
</template>

<script setup>
import { add } from "ionicons/icons";
import {ref} from 'vue'

const offset = ref({
})

</script>

<style></style>
