<template>
  <button @click="select">click</button>
</template>

<script setup>
import { onMounted } from "@vue/runtime-core";
import { importLocalImage } from "../common/importLocalImage";
import { fileToHTMLImageElement } from "../common/fileToHTMLImageElement";
import { importLocalModel } from "../common/importLocalModel";

async function select() {
  let model = await importLocalModel();
  console.log(model);
}


</script>

<style>
</style>