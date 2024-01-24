<template>
  <ion-page>
    <ion-header collapse="fade">
      <ion-toolbar>
        back
      </ion-toolbar>
    </ion-header>
    <ion-content>
        <div style="width:100%;height:6000px;"></div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { IonPage, IonHeader, IonContent, IonToolbar } from "@ionic/vue";
import { useRoute } from "vue-router";

const route = useRoute();

const modelInfo = JSON.parse(route.query.modelInfo || null);
</script>

<style></style>
