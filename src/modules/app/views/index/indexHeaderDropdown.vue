<template>
  <ion-button id="popover-button">
    <ion-icon
      slot="icon-only"
      :ios="ellipsisHorizontal"
      :md="ellipsisVertical"
    ></ion-icon>
  </ion-button>
  <ion-popover trigger="popover-button" :dismiss-on-select="true">
    <ion-content>
        111
    </ion-content>
  </ion-popover>
</template>
<script setup>
import { IonButton,IonPopover,IonContent,IonItem,IonIcon } from "@ionic/vue";
import { ellipsisHorizontal, ellipsisVertical } from "ionicons/icons";
</script>
<style lang=""></style>
