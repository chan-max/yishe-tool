<template>
  <h1>home</h1>
  <h1>
    {{account}}
  </h1>
</template>

<script setup>
import { useUserStore } from '@/store/stores/user.ts'
import { storeToRefs } from 'pinia'
const useStore = useUserStore()

const { isLogin, account } = storeToRefs(useStore)

</script>

<style>
</style>