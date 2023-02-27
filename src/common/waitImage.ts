/*
    当image标签被定义src属性时，需异步等待加载完成才能使用
*/
export function waitImage(image: any) {
    return new Promise((resolve: any) => {
        image.onload = () => resolve(image)
    })
}