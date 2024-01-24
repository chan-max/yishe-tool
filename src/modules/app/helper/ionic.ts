/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-18 19:22:11
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-01-24 21:30:58
 * @FilePath: /1s/src/modules/app/helper/ionic.ts
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
 */
import {
    IonPage,
    IonTextarea,
    IonButtons,
    IonModal,
    IonInput,
    IonList,
    IonItem,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonToolbar,
    IonContent,
    IonTitle,
    IonHeader,
    IonFooter,
    IonButton,
    IonIcon,
    IonAvatar,
    IonRippleEffect,
    IonThumbnail,
    IonCardHeader,
    IonLabel,
    IonCard,
    IonLoading,
    IonCardContent,
    IonCardTitle,
    IonCardSubtitle,
    IonSkeletonText,
    IonProgressBar,
    IonMenuToggle,
    IonRouterOutlet
} from "@ionic/vue";

export function initIonicComponents(app) {
    const components = [
        IonPage,
        IonTextarea,
        IonButtons,
        IonList,
        IonItem,
        IonInfiniteScroll,
        IonInfiniteScrollContent,
        IonButton,
        IonIcon,
        IonAvatar,
        IonRippleEffect,
        IonThumbnail,
        IonCard,
        IonCardContent,
        IonCardTitle,
        IonCardSubtitle,
        IonCardHeader,
        IonLoading,
        IonLabel,
        IonHeader,
        IonFooter,
        IonToolbar,
        IonContent,
        IonTitle,
        IonModal,
        IonInput,
        IonSkeletonText,
        IonProgressBar,
        IonMenuToggle,
        IonRouterOutlet
    ]

    components.forEach((component) => {
        app.component(component.name, component)
    })
}