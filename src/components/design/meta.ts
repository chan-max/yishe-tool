import {message} from 'ant-design-vue'



export const meta = {
    onMainModelLoading:function(){
        message.loading({ content: `正在加载模型...`, key: 'loadingmodel', duration: 0 });
    },
    onMainModelLoaded:function(){
        message.success({ content: '模型加载成功', key: 'loadingmodel', duration: 1 });
    },
    onMainModelLoadedError:function(){
        message.error({ content: '模型加载失败!', key: 'loadingmodel', duration: 1 });
    }
}