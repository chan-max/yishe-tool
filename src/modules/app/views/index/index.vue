<template>
    <ion-page>
      <ion-header >
        <ion-toolbar>
          <ion-title>衣设首页</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content :fullscreen="true">
        <ion-button router-direction="root" router-link="/scan"> 扫一扫 </ion-button>
        <ion-button router-direction="root" router-link="/login"> 登录 </ion-button>
        <ion-button @click="$router.push({name:'Signup'})"> 注册 </ion-button>
      </ion-content>
    </ion-page>
</template>
  
<script setup lang="ts">
  import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent ,IonButton} from '@ionic/vue';
  </script>
  