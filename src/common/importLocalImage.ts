/*
    异步读取本地照片（可多选），返回照片文件 数组类型
*/

export function importLocalImage() {
    let input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;
    input.dispatchEvent(new MouseEvent('click'))
    return new Promise((resolve, reject) => {
        input.onchange = (e: any) => {
            resolve(e.target.files);
        };
    });
}