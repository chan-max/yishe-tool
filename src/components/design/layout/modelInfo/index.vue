<template>
    <div class="designiy-model-info">
      {{currentOperatingModelInfo}}
    </div>
</template>
  <script setup>
  import { currentOperatingModelInfo } from "../../store";
  
  </script>
  <style lang="less">
  .designiy-model-info {
    width: 320px;
    height: 100%;
    padding:20px;
  }
  </style>
  