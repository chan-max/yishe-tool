<template>
    <div class="designiy-model-info">
      {{currentOperatingBaseModelInfo}}
    </div>
</template>
  <script setup>
  import { currentOperatingBaseModelInfo } from "../../store";
  
  </script>
  <style lang="less">
  .designiy-model-info {
    width: 320px;
    height: 100%;
    padding:20px;
  }
  </style>
  