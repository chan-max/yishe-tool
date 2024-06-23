import { message } from 'ant-design-vue'


export function formatUrl(url) {
    return url.startsWith('http') ? url : 'https://' + url;
}

/*
    当image标签被定义src属性时，需异步等待加载完成才能使用
*/
export function waitImage(image: any) {
    return new Promise((resolve: any, reject) => {

        let timer = setTimeout(() => {
            message.error('图片加载超时')
            reject()
        }, 3333);

        image.onload = () => {
            clearTimeout(timer)
            resolve(image)
        }
    })
}