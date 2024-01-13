import { IonButtons, IonButton, IonIcon, IonAvatar, IonRippleEffect, IonThumbnail, IonCardHeader, IonCard,IonLoading, IonCardContent, IonCardTitle, IonCardSubtitle } from "@ionic/vue";


export function initIonicComponents(app) {
    [
        IonButtons,
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
        IonLoading
    ].forEach((component) => {
        app.component(component.name, component)
    })
}