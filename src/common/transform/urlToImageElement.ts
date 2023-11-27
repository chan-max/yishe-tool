

export const urlToImageElement = (url: string) => new Promise((resolve, reject) => {
    let img = document.createElement('img');
    img.src = url
    img.onload = () => resolve(img)
    img.onerror = () => reject()
})