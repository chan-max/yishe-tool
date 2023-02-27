/*
    文件类型转 image元素类型
*/

export function fileToHTMLImageElement(file: File) {
    return new Promise((resolve, reject) => {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (event: any) {
            let image: any = new Image();
            image.src = event.target.result;
            image.onload = () => {
                resolve(image)
            };
        };
    })
}