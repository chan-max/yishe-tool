import { IonButtons,IonModal,IonInput,IonList,IonItem,IonInfiniteScroll,IonInfiniteScrollContent,IonToolbar,IonContent,IonTitle,IonHeader,IonFooter, IonButton, IonIcon, IonAvatar, IonRippleEffect, IonThumbnail, IonCardHeader, IonLabel,IonCard, IonLoading, IonCardContent, IonCardTitle, IonCardSubtitle } from "@ionic/vue";


export function initIonicComponents(app) {
    [
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
        IonInput
    ].forEach((component) => {
        app.component(component.name, component)
    })
}