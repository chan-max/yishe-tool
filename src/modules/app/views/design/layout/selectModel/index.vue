<template>
  <ion-modal :is-open="showSelectModel">
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button size="small" @click="showSelectModel = false">
            <ion-icon slot="icon-only" :icon="closeOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>模型</ion-title>
        <ion-buttons slot="end">
          <ion-button size="small" @click="ensure">确认</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding"> </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { showSelectModel } from "@/modules/app/views/design/store";
import { closeOutline } from "ionicons/icons";

function ensure() {
  showSelectModel.value = false;
}
</script>

<style></style>
