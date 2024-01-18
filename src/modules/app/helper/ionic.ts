import {
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
    IonSkeletonText
} from "@ionic/vue";

export function initIonicComponents(app) {
    const components = [
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
        IonSkeletonText
    ]

    components.forEach((component) => {
        app.component(component.name, component)
    })
}