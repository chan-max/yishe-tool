/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-18 19:22:11
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-02-06 22:05:06
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
    IonRouterOutlet,
    IonBackButton,
    IonDatetimeButton,
    IonDatetime,
    IonBadge,
    IonSearchbar,
    IonSegment,
    IonSegmentButton,
    IonSpinner,
    IonItemOption,
    IonItemOptions,
    IonItemSliding,
    IonRefresher,
    IonRefresherContent
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
        IonRouterOutlet,
        IonBackButton,
        IonDatetimeButton,
        IonDatetime,
        IonBadge,
        IonSearchbar,
        IonSegment,
        IonSegmentButton,
        IonSpinner,
        IonItemOption,
        IonItemOptions,
        IonItemSliding,
        IonRefresher,
        IonRefresherContent
    ]

    components.forEach((component) => {
        app.component(component.name, component)
    })
}