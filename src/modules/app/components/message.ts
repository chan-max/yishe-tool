import { toastController } from "@ionic/vue";

function createMessageFn(type){
    return async (data) => {
        const toast = await toastController.create({
            duration: 1000,
            position: "bottom",
            ...data
          });

          const message = typeof data == 'string' ? data : data.content

          toast.message = message;

          if(type == 'info'){
          }else if(type == 'success'){
            toast.style = "color:var(--ion-color-success)";
          }else if(type == 'error'){
            toast.style = "color:var(--ion-color-danger)";
          }
          await toast.present();
    }
}

export const message = {
    info:createMessageFn('info'),
    success:createMessageFn('success'),
    error:createMessageFn('error'),
}
