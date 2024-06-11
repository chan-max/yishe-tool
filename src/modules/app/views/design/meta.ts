
import {loadingController} from '@ionic/vue'
import {message} from '@/modules/app/components/message'



export const meta = {
    mainModelLoading:null,
    onMainModelLoading:async function(){
        const mainModelLoading = meta.mainModelLoading = await loadingController.create({
            message: "正在加载模型...",
            duration: 0,
            showBackdrop: true,
          });
        mainModelLoading.present();
    },
    onMainModelLoaded:function(){
        meta.mainModelLoading.dismiss()
        message.success({ content: '模型加载成功',position:'top'});
    },
    onMainModelLoadedError:function(){
        meta.mainModelLoading.dismiss()
        message.error({ content: '模型加载失败!',position:'top'});
    }
}