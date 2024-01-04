<template>
  <ion-button id="popover-button">
    <ion-icon
      slot="icon-only"
      :ios="ellipsisHorizontal"
      :md="ellipsisVertical"
    ></ion-icon>
  </ion-button>
</template>
<script setup>
import { IonButton,IonPopover,IonContent,IonItem,IonIcon } from "@ionic/vue";
import { ellipsisHorizontal, ellipsisVertical } from "ionicons/icons";
</script>
<style lang="">

</style>
